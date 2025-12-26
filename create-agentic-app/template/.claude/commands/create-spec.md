---
description: Create a new spec with requirements and implementation plan
---

# Create Feature

This command creates a new feature specification folder with requirements and implementation plan documents.

## Instructions

### Given the above conversation:

1. **Create feature folder**
   - Store the requirements and implementation plan in `/specs`
   - Create a new subfolder for this feature using kebab-case (e.g., `add-auth`)

2. **Create requirements.md**
   - Document what the feature does and why
   - Include acceptance criteria
   - Reference any related features or dependencies

3. **Create implementation-plan.md**
   - Split the implementation into phases
   - Create actionable tasks for each phase
   - Each task should have a checkbox: `[ ] Task description`
   - Tasks should be specific enough for an agent to implement independently
   - Include dependencies between tasks where relevant
   - Mark complex tasks with `[complex]` suffix (these will get their own GitHub issue when published)
   - **Add a `### Technical Details` section after each phase's tasks**
   - **Capture ALL technical specifics from the planning conversation**: CLI commands, database schemas, code snippets, file paths, configuration values
   - **This is the single source of truth** - anything not captured here is lost

4. **Create action-required.md**
   - Extract all manual steps that require human action
   - Include tasks like: account creation, API key setup, environment variables, third-party service configuration, DNS settings, etc.
   - Each task has a checkbox and brief context (one-liner explaining why it's needed)
   - Keep these tasks in the implementation plan as well (for full context)
   - If no manual steps exist, create the file with a "None required" note

5. **Exclude testing tasks**
   - Do NOT include unit or e2e testing tasks
   - UNLESS the user explicitly asks for testing to be included

### If no conversation exists:

Ask the user what the requirements are first, then create the spec subfolder with:

- `requirements.md`
- `implementation-plan.md`
- `action-required.md`

## Implementation Plan Format

Use this structure for `implementation-plan.md`:

```markdown
# Implementation Plan: {Feature Name}

## Overview

Brief summary of what will be built.

## Phase 1: {Phase Name}

{Brief description of this phase's goal}

### Tasks

- [ ] Task 1 description
- [ ] Task 2 description (depends on Task 1)
- [ ] Task 3 description [complex]
  - [ ] Sub-task 3a
  - [ ] Sub-task 3b

### Technical Details

{Include CLI commands, code snippets, schemas, and other implementation specifics discussed during planning that are relevant to this phase's tasks.}

## Phase 2: {Phase Name}

{Brief description}

### Tasks

- [ ] Task 4 description (depends on Phase 1)
- [ ] Task 5 description

### Technical Details

{Technical details for Phase 2 tasks.}
```

**Note:** Tasks marked with `[complex]` or containing nested sub-tasks will be created as separate GitHub issues when published (linked to their parent phase issue).

## Capturing Technical Details

**CRITICAL**: The implementation plan must capture ALL technical details discussed during planning. The plan is the single source of truth - anything not captured here is lost.

Each phase should include a `### Technical Details` section containing:

- **CLI commands**: Package installations, migrations, code generation
- **Database schemas**: Table definitions, column types, relations
- **Code snippets**: Key implementation patterns, type definitions, configuration
- **File paths**: Where code should be created or modified
- **Environment variables**: Required config values and their purpose
- **API endpoints**: Routes, methods, request/response shapes
- **Third-party integration**: SDK usage, webhook formats, auth flows

These details flow through to GitHub issues via `/publish-to-github`, making them available to any agent (or human) implementing the tasks.

## action-required.md Format

Use this structure for `action-required.md`:

```markdown
# Action Required: {Feature Name}

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **{Action}** - {Brief reason why this is needed}

## During Implementation

- [ ] **{Action}** - {Brief reason}

## After Implementation

- [ ] **{Action}** - {Brief reason}

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
```

### When No Manual Steps Exist

If the feature has no manual steps, create the file with:

```markdown
# Action Required: {Feature Name}

No manual steps required for this feature.

All tasks can be implemented automatically.
```

## Next Steps

After creating the feature, inform the user:

> Feature specification created at `specs/{feature-name}/`
>
> **Next steps:**
>
> 1. Review `action-required.md` for tasks you need to complete manually
> 2. Review the requirements and implementation plan
> 3. Run `/publish-to-github` to create GitHub issues and project
> 4. Use `/continue-feature` to start implementing

## Notes

- Keep tasks atomic - each should be implementable in a single session
- Tasks should produce working, testable code when complete
- Use clear, descriptive task names that explain what will be done
- Note dependencies explicitly when tasks must be done in order
- Common manual tasks: account creation, API key generation, environment variables, OAuth app configuration, DNS/domain setup, billing setup, third-party service registration
- **Don't lose planning details**: If technical specifics were discussed during planning (commands, schemas, code patterns), they MUST appear in the `### Technical Details` section of the relevant phase. Review the conversation before finalizing to ensure nothing is missed.

### When to Use `[complex]`

Mark a task with `[complex]` when it:

- Has multiple sub-tasks that need individual tracking
- Requires significant architectural decisions or discussion
- Spans multiple files or systems
- Would benefit from its own GitHub issue for comments/review

Most tasks should NOT be marked complex - reserve this for genuinely substantial work items.
