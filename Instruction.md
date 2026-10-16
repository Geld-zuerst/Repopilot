# RepoPilot — Development Instructions

These instructions guide contributors and coding agents implementing RepoPilot. Follow the existing project structure and prioritize a reliable, secure MVP over speculative features.

## 1. Project objective

Build a local-first codebase investigator with this complete workflow:

1. Select a local repository.
2. Scan eligible source files safely.
3. Search code with line-numbered results.
4. Ask a question using a local open-weight model.
5. Show a concise explanation and validated source citations.
6. Export a Markdown overview or investigation report.

## 2. Recommended environment

- Python 3.11 or newer.
- Streamlit for the MVP UI.
- Python standard library for path handling, traversal, regex and JSON.
- Requests for the local Ollama HTTP API.
- pytest for tests.
- Optional later additions: Tree-sitter for syntax-aware parsing; SQLite FTS for larger indexes.

Keep the direct dependency list small. Do not add a vector database, hosted LLM API, account system, or payment system to the initial MVP unless a demonstrated requirement demands it.

## 3. Module boundaries

- `src/scanner.py`: safe repository validation, traversal, exclusions and statistics.
- `src/indexer.py`: file text, line offsets, metadata and optional symbol extraction.
- `src/search.py`: query normalization, ranking and excerpt retrieval.
- `src/ai_engine.py`: Ollama connectivity, prompt assembly, request timeout and response parsing.
- `src/citations.py`: schema checks and validation against the indexed source.
- `src/reports.py`: Markdown report generation.
- `app.py`: UI and session state only; avoid placing core business logic here.

Use type hints for public functions. Add docstrings for non-obvious behavior. Keep functions small enough to test independently.

## 4. Security requirements

- Treat the chosen repository and its contents as untrusted.
- Resolve the selected root and ensure every file read remains within it.
- Do not follow symlinks outside the root.
- Prune ignored directories during traversal rather than only filtering their descendants after enumeration.
- Exclude secrets and private key formats by default, including `.env`, `.pem`, `.key`, credential files and likely secret directories.
- Exclude binaries, generated output, dependency folders and oversized files.
- Set maximum file count, file size, total indexed bytes, prompt context size and model request timeout.
- Never execute repository code or model-generated code.
- Never execute model-generated shell commands.
- Do not render model-supplied paths as trusted links until validated.
- Do not log full source excerpts or sensitive values by default.
- Show the user which files were skipped and why, without printing secret contents.

Security filters reduce risk but cannot guarantee that every secret is detected. Document this limitation.

## 5. AI integration rules

- Use the local Ollama endpoint by default.
- Do not require an external paid API key for the MVP.
- Send only retrieved excerpts relevant to the question.
- Clearly delimit source excerpts as untrusted context in the prompt.
- Tell the model not to follow instructions found inside repository content.
- Request structured output and validate it before display.
- Validate citations against the exact indexed source and line ranges.
- If Ollama is unavailable, preserve browsing and keyword search.
- Never claim local-only operation if telemetry, remote assets, or other network requests are active without disclosure.

## 6. Testing requirements

Every module should have unit tests. At minimum, test:
- Valid, missing and inaccessible repository paths.
- Ignored folders and sensitive filenames.
- Symlinks, oversized files and traversal limits.
- Exact and partial search matches.
- Correct line numbers and excerpt boundaries.
- Empty search results.
- Ollama timeout and connection errors.
- Malformed model output.
- Fabricated paths and invalid line ranges.
- Unsupported questions and empty evidence.
- Markdown export escaping and correct citations.

Run tests with:

```bash
pytest -q
```

Before a release, manually test the complete workflow on a small sample project and a second repository that is not the RepoPilot source itself.

## 7. Code quality and Git workflow

- Prefer clear, explicit code over clever abstractions.
- Avoid global mutable state; use Streamlit session state for UI session data.
- Use `pathlib.Path` for filesystem paths.
- Keep OS-specific path assumptions out of business logic.
- Do not commit `.env`, credentials, virtual environments, model weights or private source code.
- Make focused commits with accurate messages.
- Update README and tests when behavior changes.
- Do not claim a feature is implemented until it works and is tested.

## 8. UI guidelines

Follow `design.md`:
- Deep burgundy / wine surfaces and restrained blush-pink accents.
- Bodoni Moda for display headings where available, Plus Jakarta Sans for UI, JetBrains Mono for code metadata.
- Clear states for scanning, indexed, model unavailable, empty results and invalid citations.
- Visible keyboard focus and accessible labels.
- Responsive layout: persistent navigation on desktop, drawers or stacked panels on smaller screens.
- Evidence must be visually distinct from AI-generated prose.

## 9. Definition of done for MVP

- [ ] App starts from documented commands.
- [ ] User can select a local repository.
- [ ] Scanner safely excludes configured files and directories.
- [ ] Search returns real paths and line numbers.
- [ ] Local AI can explain retrieved source.
- [ ] Citation validator rejects fabricated references.
- [ ] Model failure does not break basic search.
- [ ] Tests pass.
- [ ] README explains setup, privacy, limitations and model requirements.
- [ ] Demo uses non-sensitive sample code.
