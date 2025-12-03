---
description: Publish a feature from /specs to GitHub Issues and Projects
---

# Publish Feature to GitHub

This command publishes a feature from the /specs folder to GitHub, creating:

- An Epic issue containing the full requirements
- Individual task issues for each item in the implementation plan
- A GitHub Project to track progress
- Labels for organization and sequencing
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
- **Tasks**: Parse all checkbox items from `implementation-plan.md`, noting their phase

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

### 6. Create Task Issues

For each task in the implementation plan, create an issue:

**Issue body template:**

```markdown
## Context

Part of Epic: #{epic-number}

## Task

{Task description from implementation plan}

## Acceptance Criteria

- [ ] Implementation complete
- [ ] Code passes lint and typecheck
- [ ] Changes follow project conventions

## Metadata

- **Sequence**: {sequence-number}
- **Depends on**: {comma-separated list of dependency issue numbers, or "None"}
- **Phase**: {phase-number}
```

**Command:**

```bash
gh issue create \
  --title "{Task description}" \
  --label "feature/{feature-name}" \
  --label "phase-{n}" \
  --body "{issue-body}"
```

Capture each issue number to build the dependency chain.

### 7. Update Epic with Task List

Edit the Epic issue to include a task list linking all sub-issues:

```bash
gh issue edit {epic-number} --body "{original-body}

---

## Tasks

### Phase 1
- [ ] #{task-1-number} {task-1-title}
- [ ] #{task-2-number} {task-2-title}

### Phase 2
- [ ] #{task-3-number} {task-3-title}
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
gh project item-add {project-number} --owner {owner} --url "https://github.com/{repository}/issues/{task-1-number}"
# ... repeat for all task issues
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

## Task Issues

| #         | Title   | Phase | Status |
| --------- | ------- | ----- | ------ |
| #{task-1} | {title} | 1     | Open   |
| #{task-2} | {title} | 1     | Open   |
| ...       | ...     | ...   | ...    |

## Labels

- `epic` - Feature epic marker
- `feature/{feature-name}` - Feature-specific label
- `phase-1`, `phase-2`, `phase-3` - Phase markers
```

### 11. Report Summary

After completion, report:

- Epic issue URL
- Number of task issues created
- Project board URL
- Location of github.md file

Example output:

```
Feature "{Feature Title}" published to GitHub!

Epic: https://github.com/{repository}/issues/{epic-number}
Project: https://github.com/users/{owner}/projects/{project-number} (linked to repo)
Tasks created: 8

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

- Task sequence numbers should be assigned based on order within phases (Phase 1 tasks get 1, 2, 3, etc., Phase 2 continues from there)
- Dependencies within the same phase are generally sequential
- Cross-phase dependencies should be explicit in the implementation plan
