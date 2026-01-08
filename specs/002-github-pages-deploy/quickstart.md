# Quickstart: Automated Deployment to GitHub Pages

**Feature**: Automated Deployment to GitHub Pages  
**Date**: 2026-01-19  
**Purpose**: Get the CI/CD pipeline up and running quickly

## Prerequisites

- GitHub repository with the fuel-calc project
- Repository must have GitHub Pages enabled (one-time setup)
- Push access to the repository
- Node.js and npm installed locally (for testing build process)

## One-Time Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

**Note**: This enables GitHub Pages and creates the `github-pages` environment automatically.

### 2. Verify Build Process

Before setting up CI/CD, verify the build works locally:

```bash
# Install dependencies
npm ci

# Run build
npm run build

# Verify dist/ directory exists with index.html
ls dist/index.html
```

If the build succeeds and `dist/index.html` exists, you're ready to proceed.

## Implementation Steps

### Step 1: Create Workflow Directory

Create the GitHub Actions workflow directory if it doesn't exist:

```bash
mkdir -p .github/workflows
```

### Step 2: Create Workflow File

Create `.github/workflows/deploy-pages.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Validate build
        run: |
          if [ ! -f dist/index.html ]; then
            echo "Error: dist/index.html not found"
            exit 1
          fi

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 3: Commit and Push

Commit the workflow file and push to the main branch:

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: add GitHub Actions workflow for Pages deployment"
git push origin main
```

### Step 4: Verify Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow run named "Deploy to GitHub Pages"
4. Click on the workflow run to see progress
5. Wait for it to complete (typically 2-5 minutes)

### Step 5: Check Deployment Status

Once the workflow completes:

1. Go to **Settings** → **Pages** in your repository
2. You should see the deployment status and URL
3. Visit the URL to verify the site is live

## Verification Checklist

- [ ] GitHub Pages enabled in repository settings
- [ ] Workflow file created at `.github/workflows/deploy-pages.yml`
- [ ] Workflow file committed and pushed to main branch
- [ ] Workflow run appears in Actions tab
- [ ] Build job completes successfully
- [ ] Deploy job completes successfully
- [ ] Site is accessible at GitHub Pages URL
- [ ] Site displays correctly (check in browser)

## Testing the Pipeline

### Test Build Locally

Before pushing, test that the build works:

```bash
npm ci
npm run build
```

### Test Workflow Trigger

To test the workflow:

1. Make a small change to any file (e.g., update a comment)
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Check the Actions tab for the new workflow run
4. Verify deployment completes successfully

## Troubleshooting

### Workflow Not Triggering

**Problem**: Workflow doesn't run when pushing to main.

**Solutions**:
- Verify workflow file is in `.github/workflows/` directory
- Check file has `.yml` or `.yaml` extension
- Verify YAML syntax is valid (no indentation errors)
- Check that you're pushing to `main` branch (not `master`)

### Build Fails

**Problem**: Build job fails during `npm run build`.

**Solutions**:
- Check workflow logs for specific error
- Verify `package.json` has `build` script
- Test build locally: `npm ci && npm run build`
- Check Node.js version matches project requirements

### Deployment Fails

**Problem**: Deploy job fails.

**Solutions**:
- Verify GitHub Pages is enabled in repository settings
- Check that Pages source is set to "GitHub Actions"
- Verify workflow has `pages: write` permission
- Check deployment logs for specific error

### Site Not Accessible

**Problem**: Deployment succeeds but site doesn't load.

**Solutions**:
- Wait a few minutes (Pages can take time to update)
- Check Pages URL in repository settings
- Verify `dist/index.html` exists in build output
- Check browser console for errors
- Clear browser cache and try again

## Next Steps

After successful deployment:

1. **Monitor Deployments**: Check Actions tab regularly to ensure deployments succeed
2. **Review Logs**: If a deployment fails, review logs to identify issues
3. **Update Workflow**: Modify workflow as needed (e.g., add notifications)
4. **Documentation**: Update project README with deployment information

## Workflow Customization

### Change Node.js Version

To use a different Node.js version, update the `setup-node` step:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # Change version here
    cache: 'npm'
```

### Add Notifications

To add Slack/email notifications on deployment, add a step after deployment:

```yaml
- name: Notify on success
  if: success()
  run: |
    # Add notification logic here
```

### Deploy on Other Branches

To deploy on other branches, update the trigger:

```yaml
on:
  push:
    branches:
      - main
      - develop  # Add other branches
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)

