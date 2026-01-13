# Live Coding Session: Building a Full-Stack App with Coding Agents

## Overview

**Project:** Real-time Poll System with full type safety across the
stack

**Tech Stack:**
- **Backend:** Python (FastAPI, Pydantic, uv)
- **Frontend:** TypeScript (React, Vite)
- **Contract:** OpenAPI (generated types for both ends)
- **Infrastructure:** Docker Compose, pre-commit hooks

**Duration:** 45-60 minutes

**What we'll demonstrate:**
- Setting up a bulletproof development environment from scratch
- OpenAPI as the single source of truth
- Type safety catching errors at compile time (not runtime)
- Deterministic feedback at every layer (linters, types, tests)
- Agent handling real-world full-stack complexity

---

## The Pitch

> "We're going to build a full-stack poll application. I will write
> zero code myself—only prompts. The agent will set up the entire
> project, configure all tooling, and implement everything. When it
> makes mistakes, you'll see how deterministic feedback from linters,
> type checkers, and tests guide it to the correct solution."

---

## Phase 0: Instruction File (CLAUDE.md)

**The first thing we build is the agent's instruction manual.**

### Prompt 0.1: Create CLAUDE.md

> "Create a CLAUDE.md file for a project called 'pollster'—a real-time
> poll application. This file will guide all AI development on the
> project. Include:
>
> **Project Overview:**
> - Full-stack poll app: FastAPI backend, React frontend, OpenAPI
>   contract
> - Type safety is paramount—strict mode everywhere
>
> **Tech Stack & Tooling:**
> - Backend: Python 3.12, uv, FastAPI, Pydantic, mypy (strict), ruff,
>   pytest
> - Frontend: TypeScript, React, Vite, ESLint, Prettier
> - Contract: OpenAPI 3.1 as single source of truth
> - Infra: Docker Compose
>
> **Development Rules:**
> - Always run 'make all' after backend changes
> - Always run 'npm run build' after frontend changes
> - Never commit code that doesn't pass type checks
> - Update OpenAPI spec FIRST when changing API shape
> - Regenerate types after OpenAPI changes
>
> **Code Style:**
> - All functions must have type hints (backend)
> - No 'any' types allowed (frontend)
> - Prefer explicit over implicit
> - Keep functions small and focused
>
> **Testing Requirements:**
> - Every endpoint needs at least one happy path test
> - Every endpoint needs at least one error case test
> - Run tests before claiming work is complete"

**Talking points:**
- **INSTRUCTION FILES**: First thing we create—before any code
- This is the agent's "brain dump" of project context
- Reduces hallucination by giving explicit rules
- Agent will reference this throughout the session
- "We're telling the agent how to be a good developer on THIS project"

---

### Prompt 0.2: Verify Understanding

> "Read back the key rules from CLAUDE.md. What must you do after
> changing the OpenAPI spec? What must pass before you commit?"

**Talking points:**
- Agent internalizes the rules
- Establishes accountability
- Shows audience the agent "understands" context
- **GUARD RAILS**: Rules are now embedded in the session

---

## Phase 1: Project Foundation

### Prompt 1.1: Initialize Project Structure

> "Create a new project called 'pollster' with this structure:
> - /backend (Python with FastAPI)
> - /frontend (TypeScript with React + Vite)
> - /docker for containerization
> - A root docker-compose.yml
>
> Use uv for Python package management. Initialize git.
> Don't implement anything yet—just the skeleton."

**Talking points:**
- Agent understands modern tooling (uv over pip)
- Clean separation of concerns from the start
- Git initialized for version control

---

### Prompt 1.2: Backend Tooling Setup

> "Set up the backend with strict quality enforcement:
> - uv for dependency management with a pyproject.toml
> - FastAPI and Pydantic as dependencies
> - pytest and pytest-asyncio for testing
> - mypy with strict mode enabled
> - ruff for linting AND formatting
> - Create a ruff.toml that treats warnings as errors
> - Create a Makefile with targets: lint, typecheck, test, format, all
> - Make sure 'make all' fails if ANY check fails
>
> Verify by running 'make all' on the empty project."

**Talking points:**
- **DETERMINISTIC FEEDBACK FOUNDATION**: Every tool configured to fail
  loudly
- **WARNINGS-AS-ERRORS**: ruff and mypy in strict mode
- Agent setting up its own guardrails
- Makefile = reproducible commands

**Expected friction:** Agent might miss a config option. Running
`make all` will reveal it immediately.

---

### Prompt 1.3: Frontend Tooling Setup

> "Set up the frontend with equally strict enforcement:
> - Vite with React and TypeScript (strict mode)
> - ESLint with typescript-eslint plugin
> - Prettier for formatting
> - Configure tsconfig.json with strict: true, noImplicitAny: true,
>   noUnusedLocals: true
> - Add npm scripts: lint, typecheck, format, build
> - 'npm run build' should fail on any TypeScript error
>
> Verify by running 'npm run build'."

**Talking points:**
- Same philosophy on frontend: fail fast, fail loudly
- TypeScript strict mode = compile-time safety
- Parallel to backend setup shows consistency

---

### Prompt 1.4: Pre-commit Hooks

> "Add pre-commit hooks that run on every commit:
> - Backend: ruff format check, ruff lint, mypy
> - Frontend: prettier check, eslint, tsc --noEmit
>
> Use pre-commit framework. Make a test commit to verify hooks work."

**Talking points:**
- **GUARD RAILS**: Impossible to commit broken code
- Agent is building its own safety net
- Every future prompt benefits from this foundation

---

### Prompt 1.5: Docker Setup

> "Create Docker configuration:
> - backend/Dockerfile (Python 3.12, uv for deps)
> - frontend/Dockerfile (Node 20, multi-stage build for production)
> - docker-compose.yml that runs both services
> - Backend on port 8000, frontend on port 3000
> - Frontend should proxy /api to backend
>
> Don't start them yet—just create the configs."

**Talking points:**
- Containerization = reproducible environments
- Multi-stage builds show production awareness
- Agent handling infrastructure, not just code

---

## Phase 2: OpenAPI Contract

### Prompt 2.1: Define the API Contract

> "Create an OpenAPI 3.1 spec at /openapi.yaml that defines our
> Poll API:
>
> Models:
> - Poll: id (uuid), question (string), options (array of Option),
>   created_at, is_active
> - Option: id (uuid), text (string), vote_count (integer)
> - CreatePollRequest: question, options (array of strings, min 2,
>   max 10)
> - VoteRequest: option_id (uuid)
> - PollResults: poll_id, total_votes, options with percentages
>
> Endpoints:
> - POST /api/polls - create poll
> - GET /api/polls - list active polls
> - GET /api/polls/{id} - get poll with current results
> - POST /api/polls/{id}/vote - cast vote
>
> Include validation constraints (min/max lengths, required fields)."

**Talking points:**
- **SINGLE SOURCE OF TRUTH**: OpenAPI defines the contract
- Both frontend and backend will generate types from this
- Validation rules live in one place
- **OPINIONATED DESIGN**: No ambiguity about the API shape

---

### Prompt 2.2: Generate Backend Models

> "Generate Pydantic models from the OpenAPI spec. Put them in
> backend/app/models.py. Use datamodel-code-generator. Make sure
> all fields have proper type hints."

**Talking points:**
- Generated code = no drift between spec and implementation
- Pydantic enforces types at runtime too
- Agent using code generation tools

**Alternative if generator issues:**

> "Write Pydantic models that exactly match the OpenAPI spec.
> Include all validation constraints. Use UUID, datetime, and
> proper Optional types."

---

### Prompt 2.3: Generate Frontend Types

> "Generate TypeScript types from the OpenAPI spec. Use
> openapi-typescript to create frontend/src/api/types.ts. Then
> create an API client in frontend/src/api/client.ts using fetch
> with proper typing."

**Talking points:**
- **VERTICAL INTEGRATION**: Same spec generates both ends
- TypeScript will catch any API misuse at compile time
- No more "hope the API matches" bugs

---

## Phase 3: Backend Implementation

### Prompt 3.1: Implement Poll Endpoints

> "Implement the FastAPI endpoints in backend/app/main.py:
> - Use an in-memory dict for storage (we'll add a DB later)
> - Implement all four endpoints from the OpenAPI spec
> - Use the generated Pydantic models
> - Add proper HTTP status codes (201 for create, 404 for not found)
>
> Run 'make all' after to verify types and lint pass."

**Talking points:**
- Watch agent implement from spec
- `make all` provides immediate feedback
- Type hints enforced by mypy strict mode

**Expected friction:** Agent might have type annotation issues.
mypy will catch them.

---

### Prompt 3.2: Add Backend Tests

> "Write pytest tests for all endpoints in backend/tests/test_api.py:
> - Test creating a poll
> - Test listing polls
> - Test getting a specific poll
> - Test voting (happy path)
> - Test voting for non-existent poll (404)
> - Test voting for non-existent option (400)
> - Test creating poll with less than 2 options (validation error)
>
> Run 'make test' and fix any failures."

**Talking points:**
- **DETERMINISTIC FEEDBACK**: Tests define expected behavior
- Agent will likely miss an edge case—tests catch it
- **RECURSIVE IMPROVEMENT LOOP**: fail -> read error -> fix -> repeat

---

### Prompt 3.3: Add Vote Validation

> "Add validation to prevent voting twice from the same session.
> Use a simple in-memory set tracking (poll_id, session_id) pairs.
> Get session_id from an X-Session-ID header. Return 409 Conflict
> if already voted. Add tests for this."

**Talking points:**
- New requirement = new tests first
- Agent handles business logic complexity
- Type system + tests = confidence

---

## Phase 4: Frontend Implementation

### Prompt 4.1: Create Poll List Component

> "Create a React component at frontend/src/components/PollList.tsx
> that:
> - Fetches polls from GET /api/polls on mount
> - Displays each poll's question and option count
> - Links to individual poll view
> - Shows loading and error states
> - Use the generated API types
>
> Run 'npm run build' after to verify no type errors."

**Talking points:**
- Generated types from OpenAPI catch mistakes
- `npm run build` = deterministic type checking
- Agent handling React patterns

**Expected friction:** Type mismatches between API response and
component expectations. TypeScript will flag them.

---

### Prompt 4.2: Create Poll Detail Component

> "Create frontend/src/components/PollDetail.tsx that:
> - Fetches a single poll by ID
> - Shows the question and all options with current vote counts
> - Shows percentage bar for each option
> - Has a Vote button for each option
> - Disables voting if already voted (track in localStorage)
> - Handles 404 (poll not found) gracefully
>
> Run 'npm run build' after."

**Talking points:**
- More complex component
- LocalStorage for session tracking (mirrors backend logic)
- Error handling requirements

---

### Prompt 4.3: Create Poll Form Component

> "Create frontend/src/components/CreatePoll.tsx that:
> - Has input for question
> - Has dynamic inputs for options (start with 2, add more button,
>   max 10)
> - Remove option button (but enforce minimum 2)
> - Validates before submit
> - POSTs to /api/polls and redirects to the new poll on success
> - Shows validation errors from API
>
> Use the CreatePollRequest type from generated types.
> Run 'npm run build'."

**Talking points:**
- Form validation complexity
- Type safety ensures request matches API expectations
- Dynamic form fields = real-world complexity

---

### Prompt 4.4: Wire Up Routing

> "Add react-router-dom and set up routes in App.tsx:
> - / -> PollList
> - /polls/:id -> PollDetail
> - /create -> CreatePoll
>
> Add navigation header with links. Run 'npm run build'."

**Talking points:**
- Agent handling routing setup
- Integration of all components
- Build verification

---

## Phase 5: Integration & Polish

### Prompt 5.1: Docker Integration Test

> "Start the full stack with docker-compose up --build. Test manually:
> 1. Create a poll via the UI
> 2. Vote on it
> 3. See results update
>
> Fix any issues that come up."

**Talking points:**
- **VERTICAL INTEGRATION**: Full stack running together
- Real integration issues surface
- Agent debugging across stack boundaries

**Expected friction:** CORS issues, proxy misconfiguration,
environment variables. Great learning moments.

---

### Prompt 5.2: Add Real-time Updates (Stretch Goal)

> "Add Server-Sent Events so poll results update in real-time:
> - Backend: GET /api/polls/{id}/stream endpoint
> - Frontend: EventSource connection in PollDetail
> - When someone votes, all viewers see updated counts
>
> Update the OpenAPI spec first, regenerate types, then implement."

**Talking points:**
- Spec-first workflow even for new features
- Real-time adds significant complexity
- Type safety remains intact through changes

---

### Prompt 5.3: Add End-to-End Test (Stretch Goal)

> "Add a simple e2e test using Playwright:
> - Start with docker-compose
> - Create a poll via UI
> - Vote on it
> - Verify vote count increased
>
> Add to Makefile as 'make e2e'."

**Talking points:**
- Full integration testing
- **DETERMINISTIC FEEDBACK** at the highest level
- Catches issues that unit tests miss

---

## Phase 6: GitHub & PR Self-Review

**Setup:** We have a working app. Now we publish it and set up
agentic code review.

### Prompt 6.1: Publish to GitHub

> "Create a new public GitHub repo called 'pollster-demo' and push
> our code:
> - Initialize with a good .gitignore (Python, Node, IDE files)
> - Create initial commit with everything
> - Push to GitHub
> - Give me the repo URL when done"

**Talking points:**
- Agent handles git workflow
- Real repo, real code
- Setting up for collaborative development patterns

---

### Prompt 6.2: Create GitHub Actions Workflow

> "Add a GitHub Actions workflow at .github/workflows/ci.yml that:
> - Triggers on pull requests
> - Runs backend checks: ruff lint, mypy, pytest
> - Runs frontend checks: eslint, tsc --noEmit, build
> - Fails fast if any check fails
>
> Commit and push."

**Talking points:**
- CI/CD = deterministic feedback on every PR
- Same checks locally and in CI
- **GUARD RAILS**: PRs can't merge if checks fail

---

### Prompt 6.3: Add Claude Code Review Workflow

> "Add a second workflow at .github/workflows/claude-review.yml that:
> - Triggers on pull request open and synchronize
> - Uses the claude-code-action to review PRs
> - Reference our CLAUDE.md for project conventions
>
> Use this template:
> ```yaml
> name: Claude Code Review
> on:
>   pull_request:
>     types: [opened, synchronize]
> jobs:
>   review:
>     runs-on: ubuntu-latest
>     steps:
>       - uses: actions/checkout@v4
>       - uses: anthropics/claude-code-action@v1
>         with:
>           anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
>           prompt: |
>             Review this PR for:
>             - Type safety (no 'any', proper hints)
>             - Test coverage for new endpoints
>             - OpenAPI spec consistency
>             - Code style per CLAUDE.md
>             Be specific about issues and suggest fixes.
> ```
>
> Commit and push."

**Talking points:**
- **AGENTIC CODE REVIEW**: Second agent as critic
- Reviews against our established rules (CLAUDE.md)
- Catches issues before human review
- Recursive improvement: agent writes, agent reviews

---

### Prompt 6.4: Demo the Self-Review

> "Create a new branch 'demo/add-poll-count'. Add a simple endpoint
> GET /api/stats that returns total poll count. Intentionally skip
> adding a test. Create a PR."

**Wait for Claude review to comment, then:**

> "Claude's review flagged the missing test. Add the test and push.
> Let's see if it approves now."

**Talking points:**
- Live demo of feedback loop
- Agent caught what we "forgot"
- **RECURSIVE IMPROVEMENT**: Write -> Review -> Fix -> Review
- No human needed to spot the gap
- "The agent is reviewing its own kind's work"

---

### Prompt 6.5: Merge and Clean Up

> "Merge the PR once checks pass. Delete the branch."

**Talking points:**
- Full PR workflow completed
- CI + Claude review = double verification
- Ready for parallel development phase

---

## Phase 7: Git Worktrees (Parallel Agents)

**Setup:** Now we'll demonstrate running two agents simultaneously
on separate features, each creating PRs that get auto-reviewed.

### Prompt 7.1: Create Worktrees

> "Create two git worktrees for parallel feature development:
> - ../pollster-feature-a on branch feature/poll-expiry
> - ../pollster-feature-b on branch feature/poll-stats
>
> List the worktrees to confirm."

**Talking points:**
- **GIT WORKTREES**: Each worktree = isolated working directory
- Same repo, different branches, different folders
- Agents won't step on each other's toes
- No stashing, no branch switching conflicts

---

### Prompt 7.2: Start Parallel Agents

Open two terminals side by side. Run agents simultaneously:

**Terminal 1 (Feature A - Poll Expiry):**

> "Working in ../pollster-feature-a. Add poll expiration:
> - Add expires_at field to Poll model (optional datetime)
> - Add expires_in_minutes field to CreatePollRequest (optional,
>   default null = never)
> - Filter expired polls from GET /api/polls
> - Return 410 Gone when voting on expired poll
> - Update OpenAPI spec, regenerate types, add tests
>
> Run make all after each change. When done, push and create a PR."

**Terminal 2 (Feature B - Poll Stats):**

> "Working in ../pollster-feature-b. Add poll statistics endpoint:
> - GET /api/polls/{id}/stats returns:
>   - total_votes
>   - votes_per_hour (array of last 24 hours)
>   - most_popular_option
>   - least_popular_option
> - Add a simple stats card to PollDetail component
> - Update OpenAPI spec, regenerate types, add tests
>
> Run make all after each change. When done, push and create a PR."

**Talking points while agents work:**
- Both agents working simultaneously
- Neither knows about the other
- No merge conflicts because different files
- **PARALLEL DEVELOPMENT**: 2x throughput
- Both PRs will get Claude reviews automatically

---

### Prompt 7.3: Review the PRs

Once both agents create PRs, show the audience:

- Two PRs open simultaneously
- Claude reviewing both in parallel
- CI running on both
- Any review comments being addressed

> "Check the PRs. If Claude left comments, address them and push."

**Talking points:**
- **AGENTIC REVIEW AT SCALE**: Multiple PRs, all reviewed
- CI + Claude review on every PR automatically
- Agents fixing their own issues based on peer review
- "This is the recursive improvement loop—at organizational scale"

---

### Prompt 7.4: Merge Both PRs

> "Merge both PRs once CI passes and reviews are addressed."

**Talking points:**
- Both features merged
- Full verification on both
- Same wall-clock time, double the output

---

### Prompt 7.5: Cleanup Worktrees

> "Remove the worktrees:
> - git worktree remove ../pollster-feature-a
> - git worktree remove ../pollster-feature-b"

**Talking points:**
- Clean workspace
- Features in main via merged PRs
- Ready for next parallel sprint

---

## Worktree + PR Demo Talking Points

| Moment                 | Point to Make                              |
|------------------------|--------------------------------------------|
| Creating worktrees     | "Each is a full working copy"              |
| Side-by-side terminals | "Neither agent knows about the other"      |
| Both agents running    | "This is 2x throughput, same wall-clock"   |
| Two PRs created        | "Now we have two PRs, both getting review" |
| Claude reviews both    | "Agentic review at scale—every PR, auto"   |
| Both merged            | "Full verification, double the features"   |

---

## Talking Points Reference

| Phase | Moment                       | Presentation Concept            |
|-------|------------------------------|---------------------------------|
| 0.1   | CLAUDE.md creation           | Instruction files / guidelines  |
| 0.2   | Agent reads back rules       | Guard rails internalized        |
| 1.2   | mypy strict mode             | Warnings-as-errors              |
| 1.4   | Pre-commit hooks             | Guard rails                     |
| 2.1   | OpenAPI spec                 | Single source of truth          |
| 2.2   | Generated models             | Vertical integration            |
| 3.1   | make all fails               | Deterministic feedback          |
| 3.2   | Test failures                | Recursive improvement loop      |
| 4.1   | Type mismatch                | Compile-time safety             |
| 5.1   | CORS error                   | Agent debugging real issues     |
| 6.3   | Claude review workflow       | Agentic code review             |
| 6.4   | Review catches missing test  | Recursive improvement via PR    |
| 7.2   | Side-by-side agents          | Git worktrees / parallel dev    |
| 7.3   | Two PRs reviewed             | Agentic review at scale         |

---

## Recovery Prompts

If agent gets stuck or makes repeated mistakes:

> "Read the error message carefully and explain what it means,
> then fix it."

> "Run make all / npm run build and address each error one at
> a time."

> "The issue is in [file]. Read it and look for the problem."

---

## Abort Prompts

If time is running short, skip to impressive finish:

> "Get the basic flow working: list polls, create poll, vote.
> Skip real-time and e2e."

> "Focus on making docker-compose up work with basic functionality."

---

## Audience Participation

- **After Phase 1:** "What would happen if we didn't set up these
  tools? How would the agent know it made a mistake?"

- **After Phase 2:** "How many of you have had bugs from frontend/
  backend type mismatches? That's impossible here."

- **During Phase 3:** "Watch the feedback loop—fail, read, fix,
  repeat. No human needed."

- **After Phase 5:** "We wrote zero code. Only prompts. Agent
  handled: Python, TypeScript, Docker, OpenAPI, testing, and
  real-time updates."

---

## Key Stats to Mention

By end of session, agents will have created:
- ~25-30 files across backend, frontend, and infra
- CLAUDE.md with project rules (referenced throughout)
- 2 Dockerfiles + compose config
- Full OpenAPI spec with validation
- Type-safe backend with tests (FastAPI + Pydantic + mypy)
- Type-safe frontend with components (React + TypeScript)
- Pre-commit hooks enforcing quality
- GitHub Actions CI pipeline
- Claude PR review workflow (agentic code review)
- Working containerized application on GitHub
- 3+ PRs created, reviewed by Claude, and merged
- 2 features developed in parallel via git worktrees

All from natural language prompts. All verified by deterministic
tooling. Zero code written by humans.

---

## Session Duration Estimates

| Phase                      | Time       | Cumulative |
|----------------------------|------------|------------|
| Phase 0: CLAUDE.md         | 5 min      | 5 min      |
| Phase 1: Foundation        | 10-15 min  | 20 min     |
| Phase 2: OpenAPI           | 5-10 min   | 30 min     |
| Phase 3: Backend           | 10-15 min  | 45 min     |
| Phase 4: Frontend          | 10-15 min  | 60 min     |
| Phase 5: Integration       | 5-10 min   | 70 min     |
| Phase 6: GitHub + PR Review| 10-15 min  | 85 min     |
| Phase 7: Worktrees         | 15-20 min  | 105 min    |

**Short version (45 min):** Phases 0-3, skip frontend/GitHub/worktrees

**Medium version (70 min):** Phases 0-5, skip GitHub/worktrees

**Full version (90-105 min):** All phases including PR review and
parallel agents

**Critical:** Never skip Phase 0—it sets up the entire demo narrative
about instruction files.

**Natural break points:**
- After Phase 3: "We have a working API with tests"
- After Phase 5: "We have a full-stack app running in Docker"
- After Phase 6: "We have CI/CD with automated code review"
