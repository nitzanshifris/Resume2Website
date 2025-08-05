"""
Test Portfolio API Endpoints
Tests for portfolio generation and download functionality
"""
import pytest
import json
import tempfile
import zipfile
from pathlib import Path
from fastapi.testclient import TestClient

from main import app
from backend.schemas.unified import CVData

client = TestClient(app)


# Sample CV data for testing
SAMPLE_CV_DATA = {
    "personalInformation": {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "phone": "+1-555-0123",
        "linkedinUrl": "https://linkedin.com/in/johnsmith",
        "location": "San Francisco, CA"
    },
    "summary": {
        "text": "Experienced software engineer with 5+ years in full-stack development."
    },
    "experience": {
        "experienceItems": [
            {
                "title": "Senior Software Engineer",
                "company": "Tech Corp",
                "startDate": "2020-01",
                "endDate": "2023-12",
                "description": "Led development of microservices architecture",
                "achievements": ["Improved performance by 40%", "Mentored 3 junior developers"]
            }
        ]
    },
    "skills": {
        "skillCategories": [
            {
                "categoryName": "Programming Languages",
                "skills": ["Python", "JavaScript", "TypeScript", "Go"]
            },
            {
                "categoryName": "Frameworks",
                "skills": ["React", "FastAPI", "Node.js", "Django"]
            }
        ]
    },
    "projects": {
        "projectItems": [
            {
                "name": "E-commerce Platform",
                "description": "Built a scalable e-commerce platform using React and Python",
                "technologies": ["React", "Python", "PostgreSQL"],
                "githubUrl": "https://github.com/johnsmith/ecommerce",
                "liveUrl": "https://myecommerce.com"
            }
        ]
    },
    "education": {
        "educationItems": [
            {
                "institution": "University of California",
                "degree": "BS Computer Science",
                "startDate": "2016-09",
                "endDate": "2020-05",
                "gpa": "3.8"
            }
        ]
    }
}


class TestPortfolioAPI:
    """Test suite for Portfolio API endpoints"""
    
    def test_generate_portfolio_success(self):
        """Test successful portfolio generation"""
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "Portfolio generated successfully" in data["message"]
        assert data["portfolio_id"] is not None
        assert data["download_url"] is not None
        assert "/portfolio/download/" in data["download_url"]
    
    def test_generate_portfolio_without_aceternity(self):
        """Test portfolio generation without Aceternity components"""
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": False
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
    
    def test_generate_portfolio_invalid_data(self):
        """Test portfolio generation with invalid CV data"""
        invalid_data = {"invalid": "data"}
        
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": invalid_data,
                "user_name": "John Smith"
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_generate_portfolio_empty_name(self):
        """Test portfolio generation with empty user name"""
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_download_portfolio_success(self):
        """Test successful portfolio download"""
        # First generate a portfolio
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 200
        portfolio_id = response.json()["portfolio_id"]
        
        # Then download it
        download_response = client.get(f"/api/v1/portfolio/download/{portfolio_id}")
        
        assert download_response.status_code == 200
        assert download_response.headers["content-type"] == "application/zip"
        assert "attachment" in download_response.headers["content-disposition"]
        
        # Verify it's a valid ZIP file
        with tempfile.NamedTemporaryFile() as tmp_file:
            tmp_file.write(download_response.content)
            tmp_file.flush()
            
            assert zipfile.is_zipfile(tmp_file.name)
            
            # Check ZIP contents
            with zipfile.ZipFile(tmp_file.name, 'r') as zip_ref:
                files = zip_ref.namelist()
                
                # Should contain essential portfolio files
                assert any("package.json" in f for f in files)
                assert any("page.tsx" in f for f in files)
                assert any("layout.tsx" in f for f in files)
                assert any("globals.css" in f for f in files)
    
    def test_download_portfolio_not_found(self):
        """Test downloading non-existent portfolio"""
        response = client.get("/api/v1/portfolio/download/nonexistent-id")
        
        assert response.status_code == 404
        assert "Portfolio not found" in response.json()["detail"]
    
    def test_get_portfolio_info_success(self):
        """Test getting portfolio information"""
        # First generate a portfolio
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 200
        portfolio_id = response.json()["portfolio_id"]
        
        # Get portfolio info
        info_response = client.get(f"/api/v1/portfolio/info/{portfolio_id}")
        
        assert info_response.status_code == 200
        info_data = info_response.json()
        
        assert info_data["portfolio_id"] == portfolio_id
        assert info_data["user_name"] == "John Smith"
        assert "created_at" in info_data
        assert "components_used" in info_data
        assert len(info_data["components_used"]) > 0
        
        # Check component structure
        component = info_data["components_used"][0]
        assert "section" in component
        assert "component_type" in component
        assert "reason" in component
    
    def test_get_portfolio_info_not_found(self):
        """Test getting info for non-existent portfolio"""
        response = client.get("/api/v1/portfolio/info/nonexistent-id")
        
        assert response.status_code == 404
        assert "Portfolio not found" in response.json()["detail"]
    
    def test_list_portfolios(self):
        """Test listing available portfolios"""
        # Generate a portfolio first
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 200
        
        # List portfolios
        list_response = client.get("/api/v1/portfolio/list")
        
        assert list_response.status_code == 200
        list_data = list_response.json()
        
        assert "portfolios" in list_data
        assert len(list_data["portfolios"]) >= 1
        
        # Check portfolio structure
        portfolio = list_data["portfolios"][0]
        assert "portfolio_id" in portfolio
        assert "user_name" in portfolio
        assert "created_at" in portfolio
        assert "component_count" in portfolio
    
    def test_force_cleanup(self):
        """Test force cleanup endpoint"""
        # Generate a portfolio first
        response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "John Smith",
                "include_aceternity_components": True
            }
        )
        
        assert response.status_code == 200
        
        # Force cleanup
        cleanup_response = client.delete("/api/v1/portfolio/cleanup")
        
        assert cleanup_response.status_code == 200
        cleanup_data = cleanup_response.json()
        
        assert "Cleaned up" in cleanup_data["message"]
        
        # Verify portfolios are cleaned up
        list_response = client.get("/api/v1/portfolio/list")
        assert len(list_response.json()["portfolios"]) == 0


class TestPortfolioIntegration:
    """Integration tests for complete portfolio workflow"""
    
    def test_complete_workflow(self):
        """Test complete workflow from generation to download"""
        # Step 1: Generate portfolio
        generate_response = client.post(
            "/api/v1/portfolio/generate",
            json={
                "cv_data": SAMPLE_CV_DATA,
                "user_name": "Integration Test User",
                "include_aceternity_components": True
            }
        )
        
        assert generate_response.status_code == 200
        portfolio_id = generate_response.json()["portfolio_id"]
        
        # Step 2: Get portfolio info
        info_response = client.get(f"/api/v1/portfolio/info/{portfolio_id}")
        assert info_response.status_code == 200
        
        # Step 3: Download portfolio
        download_response = client.get(f"/api/v1/portfolio/download/{portfolio_id}")
        assert download_response.status_code == 200
        
        # Step 4: Verify ZIP contents are valid
        with tempfile.NamedTemporaryFile() as tmp_file:
            tmp_file.write(download_response.content)
            tmp_file.flush()
            
            with zipfile.ZipFile(tmp_file.name, 'r') as zip_ref:
                # Extract and verify key files
                files = zip_ref.namelist()
                
                # Should have Next.js structure
                assert any("app/page.tsx" in f for f in files)
                assert any("app/layout.tsx" in f for f in files)
                assert any("package.json" in f for f in files)
                assert any("tailwind.config.js" in f for f in files)
                
                # Should have Aceternity components (if included)
                has_components = any("components/ui/" in f for f in files)
                assert has_components  # Should be included by default
                
                # Verify package.json content
                with zip_ref.open("package.json") as pkg_file:
                    package_data = json.load(pkg_file)
                    assert "integration-test-user-portfolio" in package_data["name"]
                    assert "dependencies" in package_data
                    assert "next" in package_data["dependencies"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])