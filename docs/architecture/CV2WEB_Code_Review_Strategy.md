# CV2WEB – Comprehensive Code Review, Refactor & Reset Strategy

## 1. Purpose & Scope
This guide provides a linear, end-to-end roadmap for a senior engineer to audit, clean, and future-proof the **CV2WEB** codebase.  
Goals:
1. **Detach** all legacy dependencies ensuring a fully self-contained solution.  
2. **Stabilise** functionality by eliminating bugs, logic errors, and edge-case failures.  
3. **Optimise** performance, readability, and maintainability.  
4. **Harden** security and input validation.  
5. **Document** every public surface for seamless onboarding.  
6. **Verify** output quality using sample CVs located at `data/cv_examples/`.

---

## 2. High-Level Workflow
1. **Bootstrap & Baseline** – run fresh installs, linters, and the full test-suite to capture the current state.  
2. **Module-by-Module Audit** – traverse the codebase starting from `backend/schemas/unified.py`, analysing one logical unit at a time.  
3. **Refactor & Optimise** – apply the checklist (Section 4) to each unit.  
4. **Regression Testing** – execute automated + manual tests for every change.  
5. **Legacy Detachment Pass** – remove or rewrite any lingering legacy hooks.  
6. **Comprehensive CV Validation** – run the end-to-end flow on every example CV and record results.  
7. **Final Review & Documentation** – polish docs, generate changelog, and prepare release.

> Tip: Track progress via Git branches named `audit/<module>` and squash-merge after green tests.

---

## 3. Prerequisites & Environment
```bash
# Clone fresh and install deps
git clone <repo-url> cv2web && cd cv2web
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm ci # for frontend workspaces (if using npm)

# Verify baseline health
pytest -q
npm run lint --workspaces | cat
```
*Ensure no extra services (e.g., Celery) run unless explicitly required.*

---

## 4. Module-by-Module Audit Plan

### 4.1 Top-Level Traversal Map (EXHAUSTIVE)
Follow this **exact order** so that downstream modules build on a verified foundation:
1. **Core Schemas & Data Contracts**
   * `backend/schemas/unified.py`
   * `api/schemas.py`
2. **Public API Layer**
   * `api/routes/` – review every `*.py` file, e.g. `auth.py`, `cv.py`, `cv_to_portfolio.py`.
3. **Domain / Service Layer** – _critical business logic_
   * `services/__init__.py`
   * `services/llm/*.py`
   * `services/local/*.py`
   * `services/portfolio/*.py`
4. **Utility & Shared Modules**
   * `extract_cv_for_magic.py`
   * `packages/` – e.g. `design-tokens`, `new-renderer`, `tailwind-preset`.
   * `scripts/utilities/*.sh` & `scripts/*.py` helper scripts.
5. **Rendering & Component Libraries**
   * `aceternity-components-library/`
   * `aceternity-gallery-app/`
   * `magic-ui-experiments/` & `mcp-integration/`
6. **Legacy Folder – for elimination / migration**
   * `legacy/` (services, scripts, tests)
7. **Tests & Fixtures**
   * `tests/`, `legacy/tests/`, `data/test_files/`, `test_outputs/`

> Only proceed to the next bullet after previous passes **all** tests and linters.

### 4.2 Per-Module Checklist
For **each file / function** perform:
1. **Static Analysis**  
   * Run `ruff`, `mypy`, and `bandit`; eliminate warnings.  
2. **Bug & Logic Inspection**  
   * Manually trace critical paths, add failing tests, fix defects.  
3. **Legacy Dependency Scan**  
   * Search for imports from `legacy.*`, outdated APIs, or commented-out code; replace or delete.  
4. **Performance Review**  
   * Profile hotspots with `cProfile`; refactor O(n²) loops, optimise I/O.  
5. **Duplicate / Dead Code Removal**  
   * Use `vulture` & `pylint --duplicate-code`.  
6. **Error Handling Hardening**  
   * Wrap external calls in `try/except`; log with `logging` not `print`.  
7. **Input Validation**  
   * For all public functions ensure `pydantic`/`dataclass` validation or explicit checks.  
8. **Security Audit**  
   * Guard against path traversal, code injection, and secrets leakage.  
9. **Documentation & Type Hints**  
   * Add/refresh docstrings (Google-style) and full type annotations.  
10. **Readability & Style**  
    * Apply `black`/`isort`; use expressive names; split >300 line files.

> Commit after each subsection with message `audit(<module>): <action>`.

### 4.3 SCRIPT EXECUTION & VERIFICATION ORDER
Use this sequence whenever you need to spin up or validate the system end-to-end:
1. **Environment Setup** – see Section 3 (venv, npm, etc.).
2. **Linters & Static Checks**
   ```bash
   ruff check .
   mypy --strict .
   bandit -r .
   ```
3. **Python Unit Tests** – quick feedback loop
   ```bash
   pytest -q
   ```
4. **Storybook for UI Components** (optional but recommended)
   ```bash
   yarn workspace aceternity-gallery-app storybook | cat
   ```
5. **Build Tailwind Renderer** (verify preset resolution)
   ```bash
   cd packages/new-renderer && npm run build
   ```
6. **CV Example Harness** – executes conversion scripts against all sample CVs
   ```bash
   bash scripts/run_cv_examples.sh
   ```
7. **HTML Validation & Visual Spot Check**
   ```bash
   npm run html-validate "test_outputs/**/*.html"
   python -m http.server --directory test_outputs 8080 &
   # open browser → http://localhost:8080
   ```
8. **Integration / Smoke Tests** (if defined)
   ```bash
   pytest tests/comprehensive_test.py
   ```
9. **CI Pipeline Simulation** – run the composite GitHub Action locally
   ```bash
   act pull_request
   ```

> Capture timing & resource metrics at each step to spot regressions early.

### 4.4 **Portfolio Generation Convergence Check** (MANDATORY PAUSE)
When you reach **`api/routes/portfolio.py`**:
1. **STOP** and open the following reference scripts located at project root:
   * `mcp_portfolio_generation.py`
   * `mcp_portfolio_generation_v3.py`
   * `mcp_portfolio_generation_v4.py`
   * `mcp_portfolio_generation_fixed.py`
   * `mcp_portfolio_generation_final.py`
2. **Compare Responsibilities**
   * Identify overlapping logic (component selection, zip packaging, cleanup, async orchestration).
   * Highlight unique features in each version (e.g., Magic-UI prompts, template selectors).  
   * Document differences in a markdown table `docs/portfolio_generation_diff.md` for visibility.
3. **Decide on Ownership**
   * **Route handler** (`portfolio.py`) should remain the single **API façade**.
   * Extract algorithmic logic into **strategy modules** under `services/portfolio/strategies/`.
4. **Refactor Plan**
   * Migrate common utilities (zip, temp-dir, cleanup) into `services/portfolio/utils.py`.
   * Implement a pluggable strategy pattern (see 4.5) so the API can delegate to either Aceternity or Magic-UI.

### 4.5 Dual Strategy Architecture
Create two independent strategies for site generation:
| Strategy | Module | Description | Trigger |
|----------|--------|-------------|---------|
| **Aceternity Template Injection** | `services/portfolio/strategies/aceternity.py` | Uses Storybook-validated templates + components (e.g., current *Emma Portfolio*) and **injects CV data** into predefined slots. Ensures pixel-perfect output with minimal variation. | `include_aceternity_components=True` in API request |
| **Magic-UI MCP Smart Builder** | `services/portfolio/strategies/magic_ui.py` | Employs Magic-UI MCP scripts & LLM prompts to choose, assemble, and tweak components dynamically for personalised style. | `include_aceternity_components=False` (or explicit flag) |

Implementation notes:
* Define a **`PortfolioStrategy`** ABC with `select_components()` and `generate()` methods.
* Register strategies in a `strategy_registry` and pick by request flags.
* Ensure both strategies share **identical output contract** (folder layout, index.html) so downstream ZIP & preview logic stays unchanged.
* Unit-test each strategy separately with the same CV fixtures.

> Goal: prevent divergent code paths and eliminate redundant *mcp_portfolio_generation*.py versions after consolidation.

---

## 5. Detailed Guidelines
### 5.1 Bug & Logic Error Detection
* Add unit tests that assert expected behaviour for edge cases.  
* Compare outputs between old and refactored functions using fixtures.  
* Use `pytest --lf` to iterate quickly on failing cases.

### 5.2 Legacy Code Removal
* **Identify:** `grep -R "legacy"` and scan `legacy/` folder references.  
* **Migrate:** Port useful logic into `services/` following modern patterns.  
* **Delete:** Remove obsolete files after tests cover replacement.

### 5.3 Performance Optimisation
* Prefer list comprehensions or generator expressions over manual loops.  
* Cache filesystem accesses; batch DB queries.  
* Use async where I/O-bound.

### 5.4 Error Handling Patterns
```python
def parse_cv(path: Path) -> CV:
    try:
        data = path.read_text()
    except Exception as exc:
        logger.exception("Failed to read CV %s", path)
        raise CVParsingError from exc
```
*Never swallow exceptions silently.*

### 5.5 Security Best Practices
* Use `python-dotenv` for secrets.  
* Sanitize user inputs before shelling out or rendering HTML.  
* Enforce HTTPS and CORS policies in API routes.

---

## 6. Testing Strategy with Sample CVs
1. **Test Harness**  
   Create a script `scripts/run_cv_examples.sh`:
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   for cv in data/cv_examples/**/*.{pdf,md,txt,jpg,png}; do
       echo "Processing $cv"
       python api/routes/cv_to_portfolio.py "$cv" --out test_outputs/$(basename "$cv")
   done
   ```
2. **Expected Output**  
   * Each CV should generate a portfolio site in `test_outputs/<name>/index.html` without errors.  
   * Validate HTML with `npm run html-validate`.  
   * Visually inspect a random sample via local server.
3. **Result Log Template**  
   | CV File | Status | Notes |
   |---------|--------|-------|
   | `sample_cv.txt` | ✅ | – |
   | ... | ... | ... |

Record discrepancies and open issues accordingly.

---

## 7. Continuous Integration Recommendations
* GitHub Actions workflow:
  * matrix: {python 3.10-3.12}  
  * steps: lint → type-check → test → build-storybook.  
* Fail build on any warning escalation.

---

## 8. Final Verification & Delivery
1. Re-run full harness, ensuring **zero errors / warnings**.  
2. Tag the release `v1.0-refactor` and generate `CHANGELOG.md` via `git-cliff`.  
3. Publish Storybook (`yarn build-storybook`) to static hosting.  
4. Hold peer code-review session; address feedback.  
5. Archive legacy folder for historical reference only (do **not** ship).

---

### Appendix A – Recommended Tooling
* **Linters:** `ruff`, `pylint`, `black`, `isort`, `bandit`.  
* **Test libs:** `pytest`, `hypothesis`, `pytest-cov`.  
* **Profilers:** `cProfile`, `py-spy`.  
* **Docs:** `mkdocs` or `Sphinx` for API docs auto-generation.

---

> **End of Strategy Document** – Happy Refactoring!  
> _For clarifications ping @TechLead on Slack._ 