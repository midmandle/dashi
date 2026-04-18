---
name: test-and-commit
description: Build and test all Dashi sub-projects, then commit staged changes with a generated message if everything passes.
---

Run the following steps in order. Stop and report the failure if any step fails — do not commit.

## 1. Discover workspace packages

1. Read the root `package.json` and extract the `workspaces` globs.
2. For each glob, use the Glob tool to find matching directories containing a `package.json`.
3. Read each workspace `package.json` to determine which scripts are available (`build`, `test`, etc.).

## 2. Build and test all packages

Using the package list discovered above:

1. Find any package whose directory is under `packages/` — build it first with `npm run build -w <dir>`. This is the shared schema and must be compiled before any other package.
2. For each remaining package: run `npm run build -w <dir>` then, if it has a `test` script, `npm test -w <dir>`. Run these sequentially.

## 2. Commit

If all steps passed, create a git commit:

- Inspect `git diff --staged` and `git status` to understand what changed
- Write a concise commit message that describes *why* the changes were made, not just what files changed
- Commit only the already-staged files (do not `git add` anything)
- Append the standard co-author trailer:
  `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

If nothing is staged, report that there is nothing to commit.
