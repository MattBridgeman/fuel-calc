# Data Model: Automated Deployment to GitHub Pages

**Feature**: Automated Deployment to GitHub Pages  
**Date**: 2026-01-19  
**Purpose**: Define the structure and flow of the CI/CD deployment system

## Overview

This feature implements infrastructure automation rather than application data. The "data model" here describes the workflow structure, job definitions, and artifact flow through the deployment pipeline.

## Workflow Structure

### Workflow Entity

**Name**: `deploy-pages`  
**Type**: GitHub Actions Workflow  
**Location**: `.github/workflows/deploy-pages.yml`

**Properties**:
- `name`: Workflow display name
- `on`: Trigger events (push to main branch)
- `permissions`: Required GitHub permissions
- `jobs`: Job definitions (build and deploy)

**Relationships**:
- Contains: `build-job`, `deploy-job`
- Triggered by: Push events to main branch
- Produces: GitHub Pages deployment

### Build Job Entity

**Name**: `build`  
**Type**: GitHub Actions Job  
**Purpose**: Build the application using Vite

**Properties**:
- `runs-on`: Runner environment (ubuntu-latest)
- `steps`: Array of build steps
- `outputs`: Build artifact path

**Steps**:
1. **Checkout**: Check out repository code
   - Action: `actions/checkout@v4`
   - Purpose: Get source code

2. **Setup Node.js**: Configure Node.js environment
   - Action: `actions/setup-node@v4`
   - Properties: `node-version` (22.x), `cache` (npm)

3. **Install Dependencies**: Install npm packages
   - Command: `npm ci`
   - Purpose: Fast, reliable dependency installation

4. **Build Application**: Run Vite build
   - Command: `npm run build`
   - Output: `dist/` directory with built artifacts

5. **Validate Build**: Verify build artifacts exist
   - Check: `dist/index.html` exists
   - Purpose: Fail fast if build incomplete

6. **Upload Artifact**: Prepare artifact for deployment
   - Action: `actions/upload-pages-artifact@v3`
   - Input: `dist/` directory
   - Output: Pages artifact

**Relationships**:
- Part of: `deploy-pages` workflow
- Produces: Pages artifact
- Required by: `deploy-job`

### Deploy Job Entity

**Name**: `deploy`  
**Type**: GitHub Actions Job  
**Purpose**: Deploy built artifacts to GitHub Pages

**Properties**:
- `runs-on`: Runner environment (ubuntu-latest)
- `environment`: GitHub Pages environment (github-pages)
- `needs`: Build job (dependency)
- `permissions`: Pages write permission

**Steps**:
1. **Deploy to Pages**: Deploy artifact to GitHub Pages
   - Action: `actions/deploy-pages@v4`
   - Input: Pages artifact from build job
   - Output: Live GitHub Pages site

**Relationships**:
- Part of: `deploy-pages` workflow
- Depends on: `build-job`
- Produces: Live GitHub Pages deployment

## Artifact Flow

### Build Artifacts

**Source**: Vite build output  
**Location**: `dist/` directory  
**Contents**:
- `index.html`: Main HTML file
- `assets/`: JavaScript, CSS, and other assets
- `icons/`: PWA icons
- `manifest.json`: PWA manifest
- `service-worker.js`: Service worker file
- Other static assets

**Validation Rules**:
- `dist/index.html` MUST exist
- `dist/` directory MUST not be empty
- Build MUST complete without errors

### Pages Artifact

**Type**: GitHub Pages artifact  
**Source**: `dist/` directory  
**Upload Action**: `actions/upload-pages-artifact@v3`  
**Deploy Action**: `actions/deploy-pages@v4`

**Flow**:
1. Build job creates `dist/` directory
2. Build job uploads `dist/` as Pages artifact
3. Deploy job receives Pages artifact
4. Deploy job publishes to GitHub Pages

## State Transitions

### Workflow States

1. **Triggered**: Workflow starts on push to main
2. **Building**: Build job in progress
3. **Build Success**: Build job completed, artifact uploaded
4. **Build Failure**: Build job failed, workflow stops
5. **Deploying**: Deploy job in progress (only if build succeeded)
6. **Deployed**: Deployment complete, site live
7. **Deploy Failure**: Deployment failed (rare, usually network issues)

### Failure Handling

**Build Failure**:
- Workflow stops immediately
- No deployment attempted
- Status check shows failure
- Error logs available in workflow run

**Deploy Failure**:
- Workflow stops
- Previous deployment remains live
- Status check shows failure
- Error logs available in workflow run

## Validation Rules

### Pre-Build Validation
- Repository must have GitHub Pages enabled
- Workflow file must exist at `.github/workflows/deploy-pages.yml`
- `package.json` must exist with `build` script
- `vite.config.js` must exist

### Build Validation
- `npm ci` must complete successfully
- `npm run build` must complete successfully
- `dist/` directory must be created
- `dist/index.html` must exist

### Deployment Validation
- Build job must succeed
- Pages artifact must be uploaded
- GitHub Pages environment must be accessible
- Deployment action must complete successfully

## Dependencies

### External Dependencies
- **GitHub Actions**: Platform for workflow execution
- **GitHub Pages**: Deployment target
- **Node.js**: Runtime for build process
- **npm**: Package manager for dependencies

### Internal Dependencies
- **Vite**: Build tool (existing)
- **package.json**: Defines build script
- **vite.config.js**: Build configuration
- **Source code**: Application to build

## Notes

- This is infrastructure automation, not application data
- Workflow structure follows GitHub Actions conventions
- Artifact flow is linear: build → upload → deploy
- No complex state management required
- Failure handling is straightforward (fail fast)

