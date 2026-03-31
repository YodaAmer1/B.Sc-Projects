# AGENTS.md

## Purpose

This file defines how AI coding agents should work in this repository.

The project is a **student web application**. The main goals are:

1. Learn fundamentals correctly
2. Keep the code clean and readable
3. Build good engineering habits
4. Prefer simple, maintainable solutions over clever ones

This repository is mentored by a developer with a **Java / Spring Boot backend background**, so explanations, code comments, and architecture decisions should be written in a way that is understandable to someone coming from Java.

---

## Project Context

### Expected stack
- **Backend:** Python using **FastAPI** or **Flask**  
- **Frontend:** React + TypeScript  
- **Optional server/runtime for frontend integration:** Express.js
- **Database:** TBD
- **Environment:** local development first, deployment later

### Team context
This is a **student team project**.  
Code must be:
- easy to read
- easy to explain
- easy to review
- easy to extend by junior developers

Do not optimize early.  
Do not introduce unnecessary abstractions.  
Do not add advanced patterns unless they clearly improve learning and maintainability.

---

## High-Level Engineering Rules

### Core principles
Always follow these principles:

- **KISS** — Keep it simple
- **YAGNI** — Do not build things that are not needed yet
- **SOLID** — Apply in a lightweight, practical way
- **DRY** — Avoid duplication, but do not over-abstract too early
- Prefer **clarity over cleverness**
- Prefer **explicit code over magic**
- Prefer **small focused files/functions** over large multi-purpose ones

### Architecture principles
- Separate concerns clearly
- Keep business logic out of controllers/routes where possible
- Keep database access isolated from presentation logic
- Use DTO/schema models for request/response boundaries
- Validate inputs at the application boundary
- Handle errors consistently
- Keep configuration outside the codebase where possible
- Use environment variables for runtime configuration
- Avoid tight coupling between frontend and backend internals

---

## How the Agent Should Behave

When making changes in this repository, the agent must:

1. Read the existing structure before making changes
2. Respect the current folder organization and naming conventions
3. Make the smallest correct change that solves the problem
4. Explain tradeoffs when there is more than one valid approach
5. Avoid introducing breaking changes unless explicitly requested
6. Avoid rewriting unrelated files
7. Avoid adding dependencies unless they are clearly justified
8. Prefer step-by-step, teachable solutions over "smart" shortcuts
9. Write code that junior developers can understand
10. Leave the repository in a runnable state

If something is unclear, do not invent a complex architecture.  
Instead, choose the simplest reasonable implementation and document assumptions.

---

## Output Style for the Agent

When answering or generating code, the agent should:

- be concise but complete
- explain changes in a practical way
- mention where files should be placed
- mention commands needed to run/test the solution
- point out common mistakes students may make
- avoid vague advice such as "just improve architecture"

When relevant, explain Python concepts in a way that helps someone with Java/Spring Boot experience:
- decorators ↔ annotations
- Pydantic ↔ DTO/validation classes
- dependency injection in FastAPI ↔ Spring dependency injection
- virtual environments ↔ Maven/Gradle project environment isolation
- Python modules/packages ↔ Java packages
- Alembic migrations ↔ Flyway/Liquibase mindset

---

## Repository Structure Guidelines

Preferred high-level structure:

```text
root/
  backend/
  frontend/
  docs/
  README.md
  AGENTS.md
```

### Backend structure
If backend is FastAPI, prefer something close to:

```text
backend/
  app/
    main.py
    api/
      routes/
    core/
    models/
    schemas/
    services/
    repositories/
    db/
    utils/
  tests/
  requirements.txt
  README.md
```

Notes:
- `api/routes` -> request handlers / endpoints
- `schemas` -> request/response models
- `services` -> business logic
- `repositories` -> persistence/data-access logic
- `core` -> config, security, shared setup
- `db` -> DB session, migrations setup, base metadata
- keep files focused and small

If backend is Flask, keep a similar layered structure.  
Do not place everything in a single `app.py` unless the project is intentionally minimal at the very beginning.

### Frontend structure
Prefer something like:

```text
frontend/
  src/
    app/
    pages/
    components/
    features/
    services/
    hooks/
    types/
    utils/
    router/
    styles/
  public/
  package.json
  README.md
```

Notes:
- `pages` -> route-level UI
- `components` -> reusable UI parts
- `features` -> domain-oriented grouping when needed
- `services` -> API calls and client logic
- `types` -> shared TypeScript interfaces/types
- `hooks` -> custom React hooks
- avoid dumping all components into one folder if the app grows

### Docs structure
Use the `docs/` folder for project artifacts such as:
- requirements summary
- ERD
- API notes
- architecture diagrams
- sprint planning notes
- setup instructions

---

## Backend Coding Rules

### General
- Use clear function and variable names
- Prefer explicit return values
- Keep route handlers thin
- Put business logic in services
- Put DB queries in repositories or dedicated data-access modules
- Validate all request input
- Return consistent response structures where appropriate
- Do not swallow exceptions silently

### Python-specific rules
- Use type hints where practical
- Prefer dataclasses/Pydantic models where appropriate
- Avoid overly dynamic patterns unless necessary
- Avoid global mutable state
- Keep imports organized
- Prefer standard library first before adding packages
- Use logging instead of random print statements in application code

### API rules
- Use RESTful naming where practical
- Separate request schema from internal model when useful
- Use proper HTTP status codes
- Validate payloads
- Return clear error messages
- Do not leak internal stack traces to API consumers

### Database rules
- Use migrations if the project reaches persistent schema changes
- Name tables and columns consistently
- Add constraints intentionally
- Do not overcomplicate relationships early
- Document assumptions around entities and ownership

---

## Frontend Coding Rules

### React/TypeScript rules
- Use function components
- Use TypeScript types/interfaces for props and API models
- Keep components small and focused
- Move reusable logic into hooks when justified
- Keep API calls out of deeply nested presentational components
- Prefer controlled forms for beginner-friendly predictability
- Use React Router for page navigation when multiple pages exist

### UI rules
- Prefer simple, clean layouts
- Prioritize usability over visual complexity
- Avoid premature design-system complexity
- Keep naming consistent across components and pages
- Keep form validation clear and visible

### State management
- Start simple: local state + lifted state + context only if needed
- Do not introduce Redux/Zustand/etc. unless there is a clear reason
- Prefer simple patterns that students can understand

---

## Express.js Rules

If Express.js is used:
- keep routing modular
- separate routes, controllers, services, and middleware
- validate request bodies
- centralize error handling
- avoid putting all logic directly in route files

---

## Git and PR Workflow

The agent should assume the team uses a simple collaborative workflow:

- `main` = stable branch
- feature branches for each task
- pull requests for merging
- small PRs are preferred over huge PRs

When generating work:
- suggest a feature branch name if useful
- keep commits logically grouped
- include a short PR description when relevant

Example branch names:
- `feature/login-page`
- `feature/backend-project-skeleton`
- `feature/create-erd`
- `fix/form-validation`

---

## Task Breakdown Rules

When asked to create tasks for students:
- make tasks small and well-scoped
- include goal, deliverables, and acceptance criteria
- avoid giving one student a task that spans too many layers
- clearly state dependencies between tasks
- prefer beginner-friendly sequencing

A good task should answer:
- what to build
- where to put it
- what "done" means
- what not to do yet

---

## Testing Rules

Prefer basic, teachable testing:
- backend: unit tests for services, simple API tests
- frontend: component tests only where useful, avoid excessive setup early
- test core logic first
- do not build a heavy test architecture too early

When generating code:
- include at least minimal test examples for non-trivial logic
- keep test names descriptive
- follow Arrange / Act / Assert style where practical

---

## Documentation Rules

Every meaningful addition should keep docs updated.

At minimum, the agent should consider whether to update:
- `README.md`
- setup instructions
- environment variable documentation
- API usage examples
- architecture notes in `docs/`

If new commands, folders, or environment variables are introduced, document them.

---

## What the Agent Must Avoid

Do not:
- invent requirements that were not requested
- add large frameworks without justification
- restructure the whole repo unless explicitly asked
- mix unrelated refactoring with feature delivery
- create hidden magic or overly abstract code
- optimize prematurely
- write giant files when smaller focused files are better
- add unnecessary design patterns just because they are "enterprise"
- introduce security-sensitive defaults carelessly
- hardcode secrets, tokens, or credentials
- bypass validation and error handling

---

## Decision-Making Preferences

When multiple options are valid, prefer the option that is:

1. easier for students to understand
2. easier to review
3. easier to debug
4. easier to extend later

If choosing between:
- clever vs clear -> choose clear
- shorter vs more understandable -> choose understandable
- advanced vs teachable -> choose teachable
- generic abstraction vs concrete implementation -> choose concrete first

---

## File Creation Rules

When creating files:
- use consistent naming
- avoid placeholder files unless they provide value
- include minimal starter content where useful
- do not create empty architecture layers "just in case"

If creating a new module or feature, prefer showing a small but complete vertical slice.

---

## Example Agent Response Pattern

When implementing a task, prefer this format:

1. What was added
2. Why it was added
3. Files created/updated
4. How to run it
5. What students should learn from it
6. Possible next step

This helps the repository stay educational, not just functional.

---

## Final Instruction

This is a **learning-first** repository.

The best solution is usually the one that:
- works correctly
- is easy to explain in a code review
- is easy for students to modify
- keeps the codebase organized
- does not introduce unnecessary complexity
