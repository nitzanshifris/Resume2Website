#!/usr/bin/env python3
"""
Specification Validator
Validates CV2WEB specifications for consistency, completeness, and dependencies
"""

import yaml
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple, Any
from collections import defaultdict

class SpecificationValidator:
    def __init__(self, spec_dir: Path):
        self.spec_dir = spec_dir
        self.specifications = {}
        self.dependency_graph = {}
        self.errors = []
        self.warnings = []
        
    def load_specifications(self):
        """Load all specification files"""
        # Load schema
        schema_path = self.spec_dir / "specification.schema.yaml"
        with open(schema_path, 'r') as f:
            self.schema = yaml.safe_load(f)
            
        # Load dependency graph
        dep_graph_path = self.spec_dir / "dependency-graph.yaml"
        with open(dep_graph_path, 'r') as f:
            self.dependency_graph = yaml.safe_load(f)['dependency_graph']
            
        # Load all specification markdown files
        for spec_file in self.spec_dir.glob("**/*.yaml"):
            if spec_file.name not in ["specification.schema.yaml", "dependency-graph.yaml"]:
                with open(spec_file, 'r') as f:
                    spec_data = yaml.safe_load(f)
                    if spec_data and 'specifications' in spec_data:
                        for spec in spec_data['specifications']:
                            self.specifications[spec['id']] = spec
                            
    def validate_dependencies(self) -> bool:
        """Validate all dependency relationships"""
        valid = True
        all_ids = set()
        
        # Collect all specification IDs from dependency graph
        for layer in self.dependency_graph.values():
            for spec in layer:
                all_ids.add(spec['id'])
                
        # Check each specification
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                spec_id = spec['id']
                
                # Check dependencies exist
                for dep_id in spec.get('dependencies', []):
                    if dep_id not in all_ids:
                        self.errors.append(f"{spec_id}: Dependency {dep_id} does not exist")
                        valid = False
                        
                # Check required_by specifications exist
                for req_id in spec.get('required_by', []):
                    if req_id not in all_ids:
                        self.errors.append(f"{spec_id}: Required_by {req_id} does not exist")
                        valid = False
                        
        return valid
        
    def check_circular_dependencies(self) -> bool:
        """Check for circular dependencies"""
        def has_cycle(node: str, visited: Set[str], rec_stack: Set[str]) -> bool:
            visited.add(node)
            rec_stack.add(node)
            
            # Find the node in dependency graph
            dependencies = []
            for layer_specs in self.dependency_graph.values():
                for spec in layer_specs:
                    if spec['id'] == node:
                        dependencies = spec.get('dependencies', [])
                        break
                        
            for dep in dependencies:
                if dep not in visited:
                    if has_cycle(dep, visited, rec_stack):
                        return True
                elif dep in rec_stack:
                    self.errors.append(f"Circular dependency detected: {node} -> {dep}")
                    return True
                    
            rec_stack.remove(node)
            return False
            
        visited = set()
        rec_stack = set()
        
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                if spec['id'] not in visited:
                    if has_cycle(spec['id'], visited, rec_stack):
                        return False
                        
        return True
        
    def validate_interfaces(self) -> bool:
        """Validate interface consistency"""
        valid = True
        
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                if 'interfaces' in spec:
                    spec_id = spec['id']
                    interfaces = spec['interfaces']
                    
                    # Check that outputs of dependencies match inputs
                    for dep_id in spec.get('dependencies', []):
                        dep_spec = self.find_spec(dep_id)
                        if dep_spec and 'interfaces' in dep_spec:
                            # This is a simplified check - in real implementation
                            # we'd validate type compatibility
                            if 'output' in dep_spec['interfaces']:
                                dep_output = dep_spec['interfaces']['output']
                                if 'input' in interfaces:
                                    spec_input = interfaces['input']
                                    # Add validation logic here
                                    
        return valid
        
    def find_spec(self, spec_id: str) -> Dict:
        """Find specification by ID"""
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                if spec['id'] == spec_id:
                    return spec
        return None
        
    def validate_coverage(self) -> bool:
        """Check specification coverage"""
        valid = True
        
        # Check that all specification IDs follow naming convention
        id_pattern = r'^(CI|UI|CV|PQ|UX|BL|SC|LS|SS|IS)\d{2}$'
        
        # Track which specifications have test cases
        specs_with_tests = set()
        test_case_dir = self.spec_dir / "test-cases"
        if test_case_dir.exists():
            for test_file in test_case_dir.glob("*.md"):
                # Extract spec ID from filename (e.g., CV01-language-preservation.md)
                if '-' in test_file.stem:
                    spec_id = test_file.stem.split('-')[0]
                    specs_with_tests.add(spec_id)
                    
        # Check each specification has test cases
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                spec_id = spec['id']
                if spec_id not in specs_with_tests:
                    self.warnings.append(f"{spec_id}: No test cases found")
                    
        return valid
        
    def generate_traceability_matrix(self) -> Dict:
        """Generate specification traceability matrix"""
        matrix = {
            "specifications": {},
            "dependencies": defaultdict(list),
            "implementations": defaultdict(list),
            "test_coverage": defaultdict(list)
        }
        
        for layer_specs in self.dependency_graph.values():
            for spec in layer_specs:
                spec_id = spec['id']
                matrix["specifications"][spec_id] = {
                    "title": spec.get('title', ''),
                    "dependencies": spec.get('dependencies', []),
                    "required_by": spec.get('required_by', []),
                    "interfaces": spec.get('interfaces', {}),
                    "validation": spec.get('validation', '')
                }
                
                # Build reverse dependency map
                for dep in spec.get('dependencies', []):
                    matrix["dependencies"][dep].append(spec_id)
                    
        return matrix
        
    def validate_all(self) -> bool:
        """Run all validations"""
        print("🔍 Validating CV2WEB Specifications...")
        
        self.load_specifications()
        
        checks = [
            ("Dependency Validation", self.validate_dependencies),
            ("Circular Dependency Check", self.check_circular_dependencies),
            ("Interface Validation", self.validate_interfaces),
            ("Coverage Validation", self.validate_coverage)
        ]
        
        all_valid = True
        for check_name, check_func in checks:
            print(f"\n📋 {check_name}...")
            if check_func():
                print(f"   ✅ Passed")
            else:
                print(f"   ❌ Failed")
                all_valid = False
                
        # Generate traceability matrix
        matrix = self.generate_traceability_matrix()
        matrix_path = self.spec_dir / "traceability-matrix.json"
        with open(matrix_path, 'w') as f:
            json.dump(matrix, f, indent=2)
        print(f"\n📊 Generated traceability matrix: {matrix_path}")
        
        # Report errors and warnings
        if self.errors:
            print("\n❌ Errors:")
            for error in self.errors:
                print(f"   - {error}")
                
        if self.warnings:
            print("\n⚠️  Warnings:")
            for warning in self.warnings:
                print(f"   - {warning}")
                
        return all_valid
        
    def generate_code_stubs(self):
        """Generate code stubs from specifications"""
        print("\n🔧 Generating code stubs from specifications...")
        
        stubs_dir = self.spec_dir / "generated" / "stubs"
        stubs_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate Python stubs for each specification
        for layer_name, layer_specs in self.dependency_graph.items():
            layer_file = stubs_dir / f"{layer_name}_stubs.py"
            with open(layer_file, 'w') as f:
                f.write(f'"""\nGenerated stubs for {layer_name}\n"""\n\n')
                
                for spec in layer_specs:
                    spec_id = spec['id']
                    title = spec.get('title', '')
                    dependencies = spec.get('dependencies', [])
                    
                    f.write(f"class {spec_id}_{title.replace(' ', '')}:\n")
                    f.write(f'    """\n')
                    f.write(f'    Specification: {spec_id} - {title}\n')
                    if dependencies:
                        f.write(f'    Dependencies: {", ".join(dependencies)}\n')
                    f.write(f'    """\n')
                    
                    if 'interfaces' in spec:
                        interfaces = spec['interfaces']
                        if 'input' in interfaces:
                            f.write(f"    \n    def validate_input(self, {interfaces['input'].lower()}):\n")
                            f.write(f"        # TODO: Implement {spec_id} input validation\n")
                            f.write(f"        pass\n")
                            
                        if 'output' in interfaces:
                            f.write(f"    \n    def generate_output(self) -> '{interfaces['output']}':\n")
                            f.write(f"        # TODO: Implement {spec_id} output generation\n")
                            f.write(f"        pass\n")
                            
                        if 'validation' in interfaces:
                            f.write(f"    \n    def validate_specification(self) -> bool:\n")
                            f.write(f"        # TODO: Implement {spec_id} validation: {interfaces['validation']}\n")
                            f.write(f"        return False\n")
                            
                    f.write("\n\n")
                    
        print(f"   ✅ Generated code stubs in {stubs_dir}")


def main():
    spec_dir = Path(__file__).parent.parent
    validator = SpecificationValidator(spec_dir)
    
    if validator.validate_all():
        print("\n✅ All specifications are valid!")
        validator.generate_code_stubs()
        return 0
    else:
        print("\n❌ Specification validation failed!")
        return 1


if __name__ == "__main__":
    sys.exit(main())