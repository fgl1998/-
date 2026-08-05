# Reference Folder Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the generated production implementation in an independent reference folder and restore `express-backend` to its original simple example.

**Architecture:** Copy the current feature-branch project before changing branches, exclude dependency caches, build output, and secrets, then compare file hashes. Only after the copy is verified, switch the working repository to `main` and remove the two backed-up generated documents that are untracked there.

**Tech Stack:** PowerShell filesystem operations and Git.

## Global Constraints

- Source: `E:\面试项目\express-backend`.
- Reference destination: `E:\面试项目\express-backend-reference`.
- Exclude `node_modules`, `dist`, and `.env` from the reference copy.
- Never modify or remove `E:\面试项目\.claude`.
- Do not overwrite an existing reference destination.
- Do not switch branches until source and destination manifests match.
- Generated untracked documents may be removed from the practice project only after their reference copies exist.

---

### Task 1: Create and verify the independent reference copy

**Files:**
- Read: `E:\面试项目\express-backend`
- Create: `E:\面试项目\express-backend-reference`

**Interfaces:**
- Consumes: current `codex/express-production-backend` working tree.
- Produces: a standalone source reference without caches, build output, or secrets.

- [ ] **Step 1: Assert the destination does not exist**

```powershell
if (Test-Path -LiteralPath 'E:\面试项目\express-backend-reference') {
  throw 'Reference destination already exists'
}
```

- [ ] **Step 2: Copy approved project entries**

```powershell
New-Item -ItemType Directory -Path 'E:\面试项目\express-backend-reference'
Get-ChildItem -LiteralPath 'E:\面试项目\express-backend' -Force |
  Where-Object { $_.Name -notin @('node_modules', 'dist', '.env') } |
  Copy-Item -Destination 'E:\面试项目\express-backend-reference' -Recurse
```

- [ ] **Step 3: Verify manifests and SHA-256 hashes**

Build relative-path/hash manifests for source and destination, excluding the same three entries. Require equal file counts, equal relative paths, and equal SHA-256 hashes.

Expected: manifests are identical and the destination contains `src`, `tests`, `doc`, `docs`, `package.json`, and `package-lock.json`.

### Task 2: Restore the practice project

**Files:**
- Restore from Git: `E:\面试项目\express-backend`
- Preserve: `E:\面试项目\express-backend-reference`

**Interfaces:**
- Consumes: verified reference copy from Task 1.
- Produces: original simple Express example checked out from `main`.

- [ ] **Step 1: Add a local Git exclusion for the reference folder**

Append `/express-backend-reference/` to `E:\面试项目\.git\info\exclude` only when the exact line is absent.

- [ ] **Step 2: Switch to the original branch**

```powershell
git switch main
```

Expected: branch is `main`; generated tracked implementation files disappear from `express-backend`, while the independent reference folder remains unchanged.

- [ ] **Step 3: Remove only backed-up generated untracked documents**

After verifying the same two files exist in the reference copy, remove exactly:

```text
E:\面试项目\express-backend\doc\2026-08-03-production-backend-architecture-design.md
E:\面试项目\express-backend\doc\2026-08-03-production-backend-implementation.md
```

- [ ] **Step 4: Verify final state**

Confirm `git branch --show-current` is `main`, `git status --short` reports no `express-backend-reference` entry, the practice project contains the original `src/controllers`, `src/routes`, and `src/services` files, and the reference folder still contains `src/modules/user`, tests, Migration, and the tutorial index.
