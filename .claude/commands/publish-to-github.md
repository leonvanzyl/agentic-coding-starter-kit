---
description: Publish a feature from /specs to GitHub Issues and Projects
---

# Publish Feature to GitHub

This command publishes a feature from the /specs folder to GitHub, creating:

- An Epic issue containing the full requirements
- Phase issues for each phase in the implementation plan (with task checklists)
- A GitHub Project to track progress
- Labels for organization
- A `github.md` file in the specs folder with all references

## Prerequisites

- The GitHub CLI (`gh`) must be authenticated: `gh auth status`
- The GitHub CLI must have project scopes: Token scopes should include `project` and `read:project`. If missing, run: `gh auth refresh -s project,read:project`
- A feature folder must exist in /specs with `requirements.md` and `implementation-plan.md`

## Instructions

### 1. Identify the Feature

Look for the feature folder attached to the conversation or specified by the user.
The folder should be at `/specs/{feature-name}/` and contain:

- `requirements.md` - Feature requirements
- `implementation-plan.md` - Task breakdown with phases

If no folder is specified, ask the user which feature to publish.

### 2. Extract Feature Information

- **Feature name**: Use the folder name (e.g., `answer-scoring`)
- **Feature title**: Parse the main heading from `requirements.md`
- **Phases**: Parse all phases from `implementation-plan.md`, including phase title, description, and task checklists

### 3. Get Repository Information

Run: `gh repo view --json nameWithOwner,owner -q '.nameWithOwner + " " + .owner.login'`

This returns both values, e.g., `leonvanzyl/json-anything leonvanzyl`

Store the results as:

- `{repository}` - Full repo name (e.g., `leonvanzyl/json-anything`)
- `{owner}` - Repository owner (e.g., `leonvanzyl`)

### 4. Create Labels (if they don't exist)

```bash
gh label create "epic" --color "7057ff" --description "Feature epic" 2>/dev/null || true
gh label create "feature/{feature-name}" --color "0E8A16" --description "Feature: {feature-title}" 2>/dev/null || true
gh label create "phase-1" --color "C5DEF5" --description "Phase 1 tasks" 2>/dev/null || true
gh label create "phase-2" --color "BFD4F2" --description "Phase 2 tasks" 2>/dev/null || true
gh label create "phase-3" --color "A2C4E0" --description "Phase 3 tasks" 2>/dev/null || true
```

### 5. Create the Epic Issue

Create an Epic issue with the full requirements:

```bash
gh issue create \
  --title "Epic: {Feature Title}" \
  --label "epic" \
  --label "feature/{feature-name}" \
  --body-file specs/{feature-name}/requirements.md
```

Capture the issue number from the output (e.g., `#100`).

### 6. Create Phase Issues

For each phase in the implementation plan, create an issue containing all tasks for that phase:

**Issue body template:**

```markdown
## Context

Part of Epic: #{epic-number}

## Overview

{Phase description/focus from implementation plan}

## Tasks

{Copy the full task checklist from the implementation plan for this phase, preserving markdown checkboxes}

## Acceptance Criteria

- [ ] All tasks in this phase completed
- [ ] Code passes lint and typecheck
- [ ] Changes follow project conventions
```

**Command:**

```bash
gh issue create \
  --title "Phase {n}: {Phase Title}" \
  --label "feature/{feature-name}" \
  --label "phase-{n}" \
  --body "{issue-body}"
```

Capture each phase issue number for linking.

### 6a. Handle Complex Phases (Optional)

If a phase meets any of these criteria, consider breaking out individual tasks as separate issues:

- Phase has **more than 15 tasks**
- A task has **nested sub-tasks** (indented checkboxes)
- A task is marked with `[complex]` in the implementation plan

**For complex phases:**

1. Create the phase issue as normal (it becomes the parent)
2. For each complex task, create a separate task issue:

```bash
gh issue create \
  --title "{Task description}" \
  --label "feature/{feature-name}" \
  --label "phase-{n}" \
  --body "## Context

Part of Phase: #{phase-issue-number}
Part of Epic: #{epic-number}

## Task

{Task description with any sub-tasks}

## Acceptance Criteria

- [ ] Implementation complete
- [ ] Code passes lint and typecheck
- [ ] Changes follow project conventions"
```

3. Update the phase issue to replace the task checkbox with a linked issue reference:

**Before:**
```markdown
- [ ] Create complex authentication system [complex]
```

**After:**
```markdown
- [ ] #{task-issue-number} Create complex authentication system
```

This way the phase issue still tracks all work, but complex tasks get their own issue for detailed discussion and tracking.

### 7. Update Epic with Phase List

Edit the Epic issue to include a list linking all phase issues:

```bash
gh issue edit {epic-number} --body "{original-body}

---

## Phases

- [ ] #{phase-1-number} Phase 1: {Phase 1 Title}
- [ ] #{phase-2-number} Phase 2: {Phase 2 Title}
- [ ] #{phase-3-number} Phase 3: {Phase 3 Title}
...
"
```

### 8. Create GitHub Project and Link to Repository

Create the project under the repository owner:

```bash
gh project create --title "Feature: {Feature Title}" --owner {owner}
```

Note: If the project already exists or the user prefers to use an existing project, skip this step. You can list projects with: `gh project list --owner {owner}`

Capture the project number from the output (you may need to run `gh project list --owner {owner}` to get it).

Then link the project to the repository so it appears in the repo's Projects tab:

```bash
gh project link {project-number} --owner {owner} --repo {repository}
```

### 9. Add Issues to Project

```bash
gh project item-add {project-number} --owner {owner} --url "https://github.com/{repository}/issues/{epic-number}"
gh project item-add {project-number} --owner {owner} --url "https://github.com/{repository}/issues/{phase-1-number}"
# ... repeat for all phase issues
# ... also add any complex task issues that were broken out
```

### 10. Create github.md

Create `specs/{feature-name}/github.md` with all the GitHub references:

```markdown
---
feature_name: { feature-name }
feature_title: { Feature Title }
repository: { repository }
epic_issue: { epic-number }
project_number: { project-number }
labels:
  - epic
  - feature/{feature-name}
published_at: { current-date }
---

# GitHub References

This feature has been published to GitHub.

## Links

- [Epic Issue](https://github.com/{repository}/issues/{epic-number})
- [Project Board](https://github.com/users/{owner}/projects/{project-number}) (also linked to repository)

## Phase Issues

| #            | Title                    | Tasks | Status |
| ------------ | ------------------------ | ----- | ------ |
| #{phase-1}   | Phase 1: {Phase 1 Title} | {n}   | Open   |
| #{phase-2}   | Phase 2: {Phase 2 Title} | {n}   | Open   |
| ...          | ...                      | ...   | ...    |

## Complex Task Issues (if any)

| #          | Title        | Phase | Status |
| ---------- | ------------ | ----- | ------ |
| #{task-1}  | {Task title} | 1     | Open   |
| ...        | ...          | ...   | ...    |

_(Omit this section if no complex tasks were broken out)_

## Labels

- `epic` - Feature epic marker
- `feature/{feature-name}` - Feature-specific label
- `phase-1`, `phase-2`, `phase-3` - Phase markers
```

### 11. Report Summary

After completion, report:

- Epic issue URL
- Number of phase issues created
- Number of complex task issues created (if any)
- Total number of tasks across all phases
- Project board URL
- Location of github.md file

Example output:

```
Feature "{Feature Title}" published to GitHub!

Epic: https://github.com/{repository}/issues/{epic-number}
Project: https://github.com/users/{owner}/projects/{project-number} (linked to repo)
Phases created: 4
Complex task issues: 2 (optional, only if any were created)
Total tasks: 46

The github.md file has been created at specs/{feature-name}/github.md

To continue implementing, drag the specs/{feature-name}/ folder into a new conversation
and say "continue with this feature" or use /continue-feature.
```

## Error Handling

- If `gh auth status` fails, inform user to run `gh auth login`
- If project creation fails with "missing required scopes [project read:project]", inform user to run `gh auth refresh -s project,read:project`
- If the feature folder doesn't exist, ask user to run `/create-feature` first
- If labels/issues fail to create, report the error and continue with remaining items
- If github.md already exists, ask user if they want to overwrite or update it

## Notes

- Each phase issue contains the full task checklist from the implementation plan
- Tasks within a phase issue can be checked off as they're completed
- Phases should be executed sequentially (Phase 1 → Phase 2 → Phase 3, etc.)
- The Epic provides a high-level view with links to all phase issues
- Use the `[complex]` marker in implementation plans to flag tasks that need their own issue
- When breaking out complex tasks, the phase issue remains the parent tracker
