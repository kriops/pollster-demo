---
title: Coding Agents Need Deterministic Feedback
author: Kristoffer Opsahl
---

# Coding Agents Need Deterministic Feedback

<!-- end_slide -->

## The Core Insight

Coding agents perform better with technologies that provide:

- **Deterministic feedback**
- **Reduced complexity**

<!-- end_slide -->

## What Makes a Stack Agent-Friendly?

<!-- end_slide -->

## 1. Vertical Integration

The toolchain understands the entire stack:

- Frontend to database
- Type checking across boundaries
- Compile-time error detection

<!-- end_slide -->

## 2. Opinionated Design

"One idiomatic way of doing things"

- Less ambiguity for the agent
- Fewer architectural decisions to hallucinate
- Consistent patterns to follow

<!-- end_slide -->

## 3. Terseness

Compact code = preserved context window

- More code fits in the prompt
- Better holistic understanding
- Higher quality output

<!-- end_slide -->

## 4. Functional Properties

Immutability and limited side effects:

- Eliminates entire error categories
- Easier to reason about
- Predictable behavior

<!-- end_slide -->

## Real Results

2-week solo development produced:

<!-- end_slide -->

## What Was Built

- Multi-tenant SaaS platform
- Authentication & authorization
- Dynamic form builder
- AI integration

<!-- end_slide -->

## What Was Built (cont.)

- Event-driven batch processing
- Audit logging
- File storage & caching
- Internationalization
- Comprehensive tests

<!-- end_slide -->

## Guard Rails Are Essential

<!-- end_slide -->

## Guard Rail 1: Instructions

Project-level instruction files:

- Coding standards
- Architecture patterns
- Domain-specific rules

<!-- end_slide -->

## Guard Rail 2: Automated Testing

Run tests on every proposed change

- Immediate deterministic feedback
- Catches hallucinations early
- Builds confidence in changes

<!-- end_slide -->

## Guard Rail 3: Agentic Code Review

Use a second agent as critic

- Fresh perspective on changes
- Catches logical errors
- Recursive improvement loop

<!-- end_slide -->

## The Recursive Improvement Loop

Agent writes code

Tests run automatically

Critic agent reviews

Agent refines based on feedback

Repeat until quality bar met

<!-- end_slide -->

## CLI Access = Autonomy

Give agents controlled access to:

- Application logs
- System tools
- Development utilities

With safety guardrails in place.

<!-- end_slide -->

## Advanced Practices

<!-- end_slide -->

## Git Worktrees

Run multiple agents in parallel on separate branches:

- Each worktree = isolated working directory
- No conflicts between concurrent agents
- Merge results when both complete

<!-- end_slide -->

## SVG Illustration Libraries

1,585 pre-downloaded SVG illustrations:

- No external API calls needed
- Deterministic asset selection
- Agent can grep for keywords to find relevant images

<!-- end_slide -->

## Comprehensive Instruction Files

1,000+ lines of CLAUDE.md covering:

- PR workflow with explicit feedback loops
- Security patterns (scope-based auth)
- Domain-specific rules
- What NOT to do

<!-- end_slide -->

## Settings Whitelist

Explicit permissions for agent operations:

- Allowed git commands
- Allowed build tools
- Blocked dangerous operations

Predictable boundaries = confident agents.

<!-- end_slide -->

## Warnings-as-Errors

Compile with --warnings-as-errors:

- Unused variables = build failure
- Missing pattern matches = build failure
- Immediate feedback, no ambiguity

<!-- end_slide -->

## Key Takeaways

<!-- end_slide -->

## Takeaway 1

Choose technologies with strong, deterministic feedback loops.

<!-- end_slide -->

## Takeaway 2

Opinionated frameworks reduce hallucination surface area.

<!-- end_slide -->

## Takeaway 3

Guard rails are not optional:

- Instructions
- Tests
- Agentic review

<!-- end_slide -->

## Takeaway 4

Enable recursive self-improvement through automated feedback cycles.

<!-- end_slide -->

## The Bottom Line

"Coding agents are an absolutely insane superpower"

...when combined with appropriate technologies and defensive mechanisms.

<!-- end_slide -->

## Questions?

kristofferopsahl.com
