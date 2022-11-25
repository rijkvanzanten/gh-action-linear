# gh-action-linear

Basic sync from GitHub to Linear.

## Installation

Add a GitHub Actions workflow file with the following contents:

```yaml
# .github/workflows/linear.yaml

on:
  issues:
    types:
      - opened
      - closed
      - reopened

jobs:
  linear:
    runs-on: ubuntu-latest
    steps:
      - uses: rijkvanzanten/gh-action-linear@v0.0.1
        with:
          linear-api-key: ${{ secrets.LINEAR_API_KEY }}
          linear-team-id: ${{ secrets.LINEAR_TEAM }}
          linear-status-opened: f530949b-53ce-42d2-ad70-f6eeb62dd983
          linear-status-closed: b9ee8921-766d-4cd2-91a0-592a77c4533e
          linear-status-reopened: 30185842-da55-4098-883f-105d30bff37b
```

> **Warning**
> DO NOT put your API key hardcoded in this file. Use [GitHub
> Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) instead.

## What it is

A GitHub Action that will automatically create new triage Issues in Linear for every opened Issue on
the current GitHub Repo. It will handle the following events:

### When an issue is **created**

- Opens a new issue on Linear using the GitHub Issue title as the Linear Issue title, and using the
  GitHub Issue contents as Linear Issue Description in the following format:
  ```
  GitHub user @xxx wrote:

  > Contents of the original GitHub Issue

  [View original issue on GitHub](link-to-issue)
  ```
- Posts a comment on GitHub with the link to the created Linear Issue using the Linear Identifier:
  ```
  Linear: [TEST-7](https://linear.app/team/issue/TEST-7/this-is-a-new-issue)

  <!-- linear-issue-id: [9ad72225-6826-466e-ae47-fe58e22edbec] -->
  ```

### When an issue is **closed**

- Sets the Linear status issue to the configured closed status by looking up the UUID from the posted comment

### When an issue is **reopened**

- Sets the Linear status issue to the configured reopened status by looking up the UUID from the posted comment

## What it isn't

It is _not_ a full sync between GitHub and Linear. Labels, milestones, assignees, or any other
pieces of information on GitHub are ignored and won't be sent to Linear.

I've explicitly chosen not to sync anything from Linear back to GitHub. This is meant to allow
Linear users to have a "private mirror" of their "public" GitHub Issues.
