# Pollster - Real-Time Poll Application

## Project Overview

Pollster is a full-stack real-time poll application with complete type safety across the stack.

- **Backend:** FastAPI with Python
- **Frontend:** React with TypeScript
- **Contract:** OpenAPI 3.1 specification as the single source of truth
- **Type safety is paramount** - strict mode enabled everywhere

## Tech Stack & Tooling

### Backend
- Python 3.12
- uv for package management
- FastAPI web framework
- Pydantic for data validation
- mypy with strict mode enabled
- ruff for linting and formatting
- pytest and pytest-asyncio for testing

### Frontend
- TypeScript with strict mode
- React
- Vite for build tooling
- ESLint with typescript-eslint plugin
- Prettier for code formatting

### Contract
- OpenAPI 3.1 specification
- Generated types for both backend (Pydantic) and frontend (TypeScript)

### Infrastructure
- Docker Compose for containerization

## Development Rules

1. **Always run `make all` after backend changes** - This runs linting, type checking, and tests
2. **Always run `npm run build` after frontend changes** - This verifies TypeScript compilation
3. **Never commit code that doesn't pass type checks** - Both mypy and tsc must pass
4. **Update OpenAPI spec FIRST when changing API shape** - The spec is the source of truth
5. **Regenerate types after OpenAPI changes** - Keep generated code in sync with spec

## Code Style

### Backend (Python)
- All functions must have type hints
- Use Pydantic models for request/response schemas
- Prefer explicit over implicit
- Keep functions small and focused

### Frontend (TypeScript)
- No `any` types allowed
- Use generated API types from OpenAPI
- Prefer explicit over implicit
- Keep components small and focused

## Testing Requirements

- Every endpoint needs at least one happy path test
- Every endpoint needs at least one error case test
- Run tests before claiming work is complete
- Use pytest for backend tests
- Verify type safety catches errors at compile time, not runtime
