---
description: Create a new feature with requirements and implementation plan
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

4. **Exclude testing tasks**
   - Do NOT include unit or e2e testing tasks
   - UNLESS the user explicitly asks for testing to be included

### If no conversation exists:

Ask the user what the requirements are first, then create the spec subfolder with:

- `requirements.md`
- `implementation-plan.md`

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
- [ ] Task 3 description

## Phase 2: {Phase Name}

{Brief description}

### Tasks

- [ ] Task 4 description (depends on Phase 1)
- [ ] Task 5 description
      ...
```

## Next Steps

After creating the feature, inform the user:

> Feature specification created at `specs/{feature-name}/`
>
> **Next steps:**
>
> 1. Review the requirements and implementation plan
> 2. Run `/publish-to-github` to create GitHub issues and project
> 3. Use `/continue-feature` or drag the folder into a conversation to start implementing

## Notes

- Keep tasks atomic - each should be implementable in a single session
- Tasks should produce working, testable code when complete
- Use clear, descriptive task names that explain what will be done
- Note dependencies explicitly when tasks must be done in order
