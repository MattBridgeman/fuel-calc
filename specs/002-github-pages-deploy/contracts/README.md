# Contracts: Automated Deployment to GitHub Pages

**Feature**: Automated Deployment to GitHub Pages  
**Date**: 2026-01-19  
**Purpose**: Define the interfaces and contracts for the CI/CD deployment system

## Overview

This feature implements infrastructure automation using GitHub Actions. The "contracts" here define the workflow interface, job contracts, and integration points with GitHub's systems.

## Workflow Contract

### Workflow Interface

**File**: `.github/workflows/deploy-pages.yml`  
**Type**: GitHub Actions Workflow YAML

**Required Structure**:
```yaml
name: <workflow-name>
on:
  <trigger-events>
permissions:
  <required-permissions>
jobs:
  <job-definitions>
```

**Contract Requirements**:
- MUST be valid YAML syntax
- MUST define at least one job
- MUST specify trigger events
- MUST specify required permissions
- MUST follow GitHub Actions workflow schema

## Job Contracts

### Build Job Contract

**Job ID**: `build`  
**Type**: GitHub Actions Job

**Required Properties**:
- `runs-on`: Runner specification (e.g., `ubuntu-latest`)
- `steps`: Array of step definitions

**Required Steps**:
1. Checkout repository code
2. Setup Node.js environment
3. Install dependencies (`npm ci`)
4. Build application (`npm run build`)
5. Validate build artifacts
6. Upload Pages artifact

**Output Contract**:
- MUST produce Pages artifact via `actions/upload-pages-artifact`
- Artifact MUST contain `dist/` directory contents
- Build MUST fail if validation checks fail

**Error Contract**:
- Non-zero exit code from any step MUST stop workflow
- Build failure MUST prevent deployment
- Error messages MUST be visible in workflow logs

### Deploy Job Contract

**Job ID**: `deploy`  
**Type**: GitHub Actions Job

**Required Properties**:
- `runs-on`: Runner specification (e.g., `ubuntu-latest`)
- `environment`: GitHub Pages environment (`github-pages`)
- `needs`: Dependency on `build` job
- `permissions`: `pages: write` and `contents: read`

**Required Steps**:
1. Deploy Pages artifact to GitHub Pages

**Input Contract**:
- REQUIRES successful completion of `build` job
- REQUIRES Pages artifact from `build` job

**Output Contract**:
- MUST deploy artifact to GitHub Pages
- Deployment MUST be accessible at repository's Pages URL
- Deployment MUST replace previous deployment

**Error Contract**:
- Deployment failure MUST be reported in workflow status
- Previous deployment MUST remain live on failure
- Error messages MUST be visible in workflow logs

## Integration Contracts

### GitHub Actions Platform Contract

**Interface**: GitHub Actions workflow execution

**Required Capabilities**:
- Execute workflows on trigger events
- Provide runner environments (Ubuntu, Windows, macOS)
- Manage job execution and dependencies
- Provide artifact storage and retrieval
- Report workflow status via checks

**Contract Requirements**:
- Workflow MUST be triggered on specified events
- Jobs MUST execute in specified order (via `needs`)
- Artifacts MUST be available between jobs
- Status checks MUST be reported to repository

### GitHub Pages Contract

**Interface**: GitHub Pages deployment service

**Required Capabilities**:
- Accept deployment artifacts
- Host static files
- Provide public URL for repository
- Update deployment on new artifacts

**Contract Requirements**:
- Repository MUST have GitHub Pages enabled
- Deployment MUST be accessible at public URL
- New deployment MUST replace previous deployment
- Deployment MUST be available within minutes of completion

### Node.js Build Contract

**Interface**: Node.js runtime and npm package manager

**Required Capabilities**:
- Execute Node.js scripts
- Install npm packages from `package.json`
- Run npm scripts (e.g., `npm run build`)
- Access file system for build output

**Contract Requirements**:
- Node.js version MUST be compatible with project
- `npm ci` MUST install dependencies from `package-lock.json`
- `npm run build` MUST execute Vite build process
- Build output MUST be written to `dist/` directory

## Permission Contracts

### Workflow Permissions

**Required Permissions**:
- `contents: read`: Read repository code
- `pages: write`: Deploy to GitHub Pages
- `id-token: write`: Required for Pages deployment (automatic)

**Contract Requirements**:
- Permissions MUST be explicitly declared in workflow
- Permissions MUST be sufficient for all workflow steps
- Permissions MUST follow principle of least privilege

## Trigger Contract

### Event Trigger

**Event Type**: `push`  
**Branch Filter**: `main`

**Contract Requirements**:
- Workflow MUST trigger on push to `main` branch
- Workflow MUST NOT trigger on other branches (unless specified)
- Workflow MUST trigger on merge commits to `main`
- Workflow MUST trigger on direct pushes to `main`

## Artifact Contract

### Pages Artifact

**Type**: GitHub Pages deployment artifact  
**Source**: `dist/` directory  
**Format**: Directory structure with static files

**Contract Requirements**:
- Artifact MUST contain all files from `dist/` directory
- Artifact MUST include `index.html` at root
- Artifact MUST preserve directory structure
- Artifact MUST be uploaded before deployment job runs

## Validation Contract

### Build Validation

**Validation Checks**:
1. `dist/` directory exists
2. `dist/index.html` exists
3. Build process completed without errors

**Contract Requirements**:
- Validation MUST occur after build step
- Validation failure MUST stop workflow
- Validation MUST provide clear error messages
- Validation MUST check critical files only

## Notes

- Contracts define the interface between workflow and GitHub systems
- Contracts ensure reliable, predictable deployment behavior
- Error contracts ensure proper failure handling
- Integration contracts define external system requirements
- All contracts follow GitHub Actions best practices

