---
description: Continue implementing the next task for a GitHub-published feature
---

# Continue Feature Implementation

This command finds and implements the next available task for a feature that has been published to GitHub.

## Prerequisites

- The GitHub CLI (`gh`) must be authenticated
- The feature must have been published to GitHub (github.md exists in the feature folder)
- The feature folder should be attached to the conversation

## Instructions

### 1. Locate the Feature

Look for the feature folder attached to the conversation. It should be at `/specs/{feature-name}/` and contain:

- `requirements.md` - Feature requirements (for context)
- `implementation-plan.md` - Original task breakdown
- `github.md` - GitHub references (required)

If no folder is attached, ask the user to drag the feature folder into the conversation.

### 2. Read GitHub References

Parse `github.md` to extract:

- `feature_name` from frontmatter
- `epic_issue` number from frontmatter
- `repository` from frontmatter

If `github.md` doesn't exist, inform the user:

> "This feature hasn't been published to GitHub yet. Run `/publish-to-github` first to create the GitHub issues and project."

### 3. Query Open Tasks

List all open issues for this feature:

```bash
gh issue list \
  --label "feature/{feature_name}" \
  --state open \
  --json number,title,body,labels \
  --limit 100
```

### 4. Parse and Sort Tasks

For each issue returned:

1. Extract the `Sequence` number from the issue body (format: `**Sequence**: N`)
2. Extract dependencies from the issue body (format: `**Depends on**: #X, #Y` or `None`)
3. Skip the Epic issue (has label `epic`)

### 5. Check Dependencies

For each potential task:

1. Parse its dependencies
2. Check if all dependency issues are closed: `gh issue view {dep-number} --json state -q .state`
3. A task is "available" if all its dependencies are `CLOSED`

### 6. Select Next Task

From all available (unblocked) tasks, select the one with the **lowest sequence number**.

If no tasks are available:

- If all tasks are closed: Report "🎉 All tasks for {feature_name} are complete!"
- If tasks exist but are blocked: Report which tasks are blocked and by what

### 7. Display Task Information

Before implementing, show:

```
📋 Next Task: #{number} - {title}

Phase: {phase}
Sequence: {sequence}
Dependencies: {deps or "None"}

## Task Description
{task description from issue body}

Proceeding with implementation...
```

### 8. Set Issue Status to "In Progress"

Before starting implementation, update the issue status on the GitHub Project board. This is **required** when `project_number` exists in `github.md`.

**IMPORTANT**: Do NOT rely on labels like "status/in-progress" as they may not exist in the repository. Always update the Project board status directly.

#### Step 8.1: Add a comment indicating work has started

```bash
gh issue comment {issue-number} --repo {repository} --body "🚀 **Status Update**: Implementation started

Working on this task now..."
```

#### Step 8.2: Get the project item ID for this issue

```bash
gh project item-list {project_number} --owner {owner} --format json
```

Parse the JSON output to find the item where `content.number` matches your issue number. Extract the `id` field - this is the `{item_id}`.

Example: For issue #8, find the item with `"content": {"number": 8, ...}` and note its `"id"` value (e.g., `"PVTI_lAHOBLPcNM4BJm9zzgh_JP0"`).

#### Step 8.3: Get the Status field ID and option IDs

```bash
gh project field-list {project_number} --owner {owner} --format json
```

From the output, find the field with `"name": "Status"`. Extract:

- `id` - this is the `{status_field_id}` (e.g., `"PVTSSF_lAHOBLPcNM4BJm9zzg5uLNA"`)
- `options` array - find the option with `"name": "In Progress"` and note its `id` as `{in_progress_option_id}` (e.g., `"47fc9ee4"`)

#### Step 8.4: Construct the project ID

The project ID follows the pattern `PVT_kwHO{owner_id}M4{project_suffix}`. You can derive it from the item IDs which contain the same pattern, or use:

```bash
gh project view {project_number} --owner {owner} --format json
```

#### Step 8.5: Update the project item status to "In Progress"

```bash
gh project item-edit \
  --project-id {project_id} \
  --id {item_id} \
  --field-id {status_field_id} \
  --single-select-option-id {in_progress_option_id}
```

**Complete Example** (with real values from a session):

```bash
# Step 8.1: Comment on the issue
gh issue comment 8 --repo leonvanzyl/json-anything --body "🚀 **Status Update**: Implementation started

Working on this task now..."

# Step 8.2: Get item ID (parse JSON to find item with content.number == 8)
gh project item-list 3 --owner leonvanzyl --format json
# Found: "id": "PVTI_lAHOBLPcNM4BJm9zzgh_JP0"

# Step 8.3: Get field IDs (find Status field and "In Progress" option)
gh project field-list 3 --owner leonvanzyl --format json
# Found Status field: "id": "PVTSSF_lAHOBLPcNM4BJm9zzg5uLNA"
# Found "In Progress" option: "id": "47fc9ee4"

# Step 8.5: Update status
gh project item-edit \
  --project-id PVT_kwHOBLPcNM4BJm9z \
  --id PVTI_lAHOBLPcNM4BJm9zzgh_JP0 \
  --field-id PVTSSF_lAHOBLPcNM4BJm9zzg5uLNA \
  --single-select-option-id 47fc9ee4
```

**Note**: The `gh project item-edit` command returns no output on success. Verify the update worked by checking the project board or re-running `gh project item-list`.

### 9. Read Full Context

Before implementing:

1. Read the Epic issue for overall context: `gh issue view {epic_issue}`
2. Read `requirements.md` for feature requirements
3. Review relevant parts of the codebase based on the task

### 10. Implement the Task

Implement the task following project conventions:

- Follow existing code patterns in the codebase
- Use the `@/` import alias
- Run `pnpm lint && pnpm typecheck` after making changes
- Fix any lint or type errors before committing

### 11. Commit Changes

After successful implementation:

```bash
git add .
git commit -m "feat: {task title} (closes #{issue-number})"
```

The `closes #{issue-number}` syntax will automatically close the issue when pushed/merged.

### 12. Update Issue with Implementation Details

After committing, update the GitHub issue with comprehensive details about what was implemented:

```bash
# Update the issue with implementation summary
gh issue comment {issue-number} --body "✅ **Implementation Complete**

## Changes Made
- **Files Modified**: {list of files changed}
- **Files Added**: {list of new files, if any}

## Summary of Changes
{detailed description of what was implemented}

## Technical Details
{any relevant technical notes, decisions made, or patterns followed}

## Testing
- Lint: ✅ Passed
- TypeCheck: ✅ Passed
{any manual testing performed}

---
Commit: {commit-hash}
Ready for review and merge."
```

**Note**: Do NOT try to update labels like "status/done" as they may not exist in the repository. The Project board status update in Step 13 is the authoritative status indicator.

### 13. Update Project Board (if applicable)

If the feature has an associated GitHub Project board, update the status to "Done". You should already have the `{item_id}`, `{status_field_id}`, and `{project_id}` from Step 8.

From the field list obtained in Step 8.3, find the option with `"name": "Done"` and note its `id` as `{done_option_id}` (e.g., `"98236657"`).

```bash
gh project item-edit \
  --project-id {project_id} \
  --id {item_id} \
  --field-id {status_field_id} \
  --single-select-option-id {done_option_id}
```

**Complete Example** (continuing from Step 8):

```bash
# Using the same IDs from Step 8, but with "Done" option ID
gh project item-edit \
  --project-id PVT_kwHOBLPcNM4BJm9z \
  --id PVTI_lAHOBLPcNM4BJm9zzgh_JP0 \
  --field-id PVTSSF_lAHOBLPcNM4BJm9zzg5uLNA \
  --single-select-option-id 98236657
```

**Note**: The command returns no output on success.

### 14. Report Completion

After completing the task:

```
✅ Task #{number} complete: {title}

GitHub Updates:
- Issue #{number} status: "Done" ✅
- Project board: Updated ✅ (if applicable)
- Implementation details: Added to issue ✅

Changes made:
- {summary of files changed}
- {summary of functionality added}

Next steps:
- Push changes: `git push`
- Or continue: Drop the feature folder again and say "continue"

Remaining tasks: {count} open, {count} blocked
```

### 15. Prompt for Next Action

Ask the user:

> "Would you like me to continue with the next task, or would you prefer to review the changes first?"

If the user wants to continue, repeat from step 3.

## Handling Edge Cases

### No github.md file

```
❌ This feature hasn't been published to GitHub.

To publish, run: /publish-to-github

Or if you want to continue without GitHub integration, I can work from
the implementation-plan.md file directly. Would you like to do that instead?
```

### All tasks complete

```
🎉 Congratulations! All tasks for "{feature_name}" are complete!

Epic: https://github.com/{repository}/issues/{epic_issue}

You can close the Epic issue with:
gh issue close {epic_issue}
```

### All remaining tasks are blocked

```
⏸️ All remaining tasks are currently blocked.

Blocked tasks:
- #{number} "{title}" - blocked by #{dep} (still open)
- ...

To unblock, complete these dependencies first, or manually close them if
they're no longer needed.
```

### Implementation fails lint/typecheck

```
⚠️ Implementation has lint/type errors:

{error output}

Please review and fix these issues before I can commit. Would you like me
to attempt to fix them?
```

## Offline Mode (No GitHub)

If the user prefers not to use GitHub or gh is unavailable, fall back to the
implementation-plan.md approach:

1. Read `implementation-plan.md`
2. Find the first unchecked task `[ ]`
3. Implement it
4. Check off the task in the markdown file
5. Commit with a descriptive message

This maintains backward compatibility with the original workflow.

## Notes

- Only implement ONE task per invocation unless the user explicitly asks for more
- Always run lint and typecheck before committing
- Preserve the task's acceptance criteria when checking completion
- If a task is unclear, ask for clarification rather than guessing
