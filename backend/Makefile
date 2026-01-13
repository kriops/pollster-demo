.PHONY: all lint format typecheck test clean

# Run all checks - fails if ANY check fails
all: lint typecheck test
	@echo "All checks passed!"

# Lint with ruff
lint:
	uv run ruff check .

# Format with ruff
format:
	uv run ruff format .

# Format check (doesn't modify files)
format-check:
	uv run ruff format --check .

# Type check with mypy
typecheck:
	uv run mypy .

# Run tests with pytest
test:
	uv run pytest

# Clean up cache directories
clean:
	rm -rf __pycache__ .pytest_cache .mypy_cache .ruff_cache
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
