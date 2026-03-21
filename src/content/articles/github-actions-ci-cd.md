---
title: "GitHub Actions: The CI/CD Platform You're Probably Underusing"
date: "2026-02-08"
description: "Beyond 'npm test on push' — matrix builds, reusable workflows, OIDC cloud auth, and the patterns that turn GitHub Actions from a test runner into a deployment platform."
category: "devOps"
tags: ["GitHub Actions", "CI/CD", "DevOps", "Automation", "YAML"]
readTime: "10 min read"
---

Most teams I've worked with use GitHub Actions the same way: run tests on push, maybe lint, maybe build a Docker image. It's a glorified test runner with a YAML config. And that's fine — but it's like buying a Swiss Army knife and only using the bottle opener.

GitHub Actions is a full deployment platform. Matrix builds, reusable workflows, OIDC authentication to cloud providers, environment protection rules, caching that actually works. The gap between "we run `npm test` on push" and "we have a production-grade CI/CD pipeline" is smaller than you think, and most of it is just knowing what's available.

## Beyond the Basic Workflow

Here's what most teams have:

```yaml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

It works. It's also leaving 80% of the platform on the table. Let's fix that.

## Matrix Builds: Test Across Everything

If you're shipping a library or a service that needs to run in multiple environments, matrix builds are the most underused feature in Actions.

```yaml
name: CI Matrix
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 22]
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

Nine parallel jobs — three Node versions across three operating systems. The `fail-fast: false` is important: without it, one failure cancels all other jobs. You want to see the full failure matrix, not just the first one.

You can also exclude specific combinations and include additional ones:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18, 20, 22]
    exclude:
      - os: windows-latest
        node-version: 18   # Don't test legacy Node on Windows
    include:
      - os: ubuntu-latest
        node-version: 22
        experimental: true  # Custom variable for conditional steps
```

For monorepos, you can matrix across packages:

```yaml
strategy:
  matrix:
    package: [api, web, shared, cli]
steps:
  - run: npm ci --workspace=packages/${{ matrix.package }}
  - run: npm test --workspace=packages/${{ matrix.package }}
```

Four packages tested in parallel. When your monorepo has 30-second test suites per package, running them in parallel instead of sequentially saves real time.

## Reusable Workflows: DRY Your CI

If you're copying workflow YAML between repositories, you're doing it wrong. Reusable workflows let you define a workflow once and call it from anywhere.

Create a shared workflow in a central repo:

```yaml
# .github/workflows/node-ci.yml in org/shared-workflows
name: Node CI
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: "20"
      working-directory:
        type: string
        default: "."
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ${{ inputs.working-directory }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm
          cache-dependency-path: ${{ inputs.working-directory }}/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Call it from any repo:

```yaml
# .github/workflows/ci.yml in any repo
name: CI
on: [push, pull_request]
jobs:
  ci:
    uses: org/shared-workflows/.github/workflows/node-ci.yml@main
    with:
      node-version: "22"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

One line to get linting, testing, and building. Update the shared workflow, and every repo picks up the change. This is how you scale CI across 20+ repositories without losing your mind.

## Composite Actions: Reusable Steps

Reusable workflows operate at the job level. Composite actions operate at the step level — smaller, more composable.

```yaml
# .github/actions/setup-project/action.yml
name: Setup Project
description: Install dependencies with caching
inputs:
  node-version:
    default: "20"
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
    - run: npm ci
      shell: bash
    - run: npx playwright install --with-deps
      shell: bash
      if: hashFiles('playwright.config.*') != ''
```

Now any workflow can use it:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      node-version: "22"
  - run: npm test
```

I use composite actions for repeated setup sequences: "install Node + dependencies + Playwright," "configure AWS credentials + login to ECR," "setup Go + install tools + lint." Anything you do in more than two workflows deserves to be a composite action.

## OIDC: Stop Storing Cloud Credentials as Secrets

This is the one that surprises people most. If you're still storing AWS access keys or GCP service account JSON as GitHub secrets, you're doing it the legacy way. OIDC (OpenID Connect) lets GitHub Actions authenticate to cloud providers without any stored credentials.

How it works: GitHub Actions generates a short-lived OIDC token for each workflow run. Your cloud provider trusts GitHub as an identity provider. The token is exchanged for temporary cloud credentials. No long-lived secrets.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write    # Required for OIDC
      contents: read
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-arn: arn:aws:iam::123456789:role/github-actions-deploy
          aws-region: eu-central-1

      # Now you have AWS credentials — no secrets needed
      - run: aws ecs update-service --cluster prod --service api --force-new-deployment
```

On the AWS side, you create an IAM role that trusts GitHub's OIDC provider and scopes it to your repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:your-org/your-repo:*"
      }
    }
  }]
}
```

I set this up for the Tafkeer deployment pipeline on AWS EKS, and it eliminated the rotation problem entirely. No more quarterly key rotation. No more "who has access to the production secrets." The credentials exist for the duration of the workflow run and then they're gone.

GCP and Azure have equivalent OIDC setups. If your cloud provider supports it, there's no reason to store long-lived credentials anymore.

## Environment Protection Rules

This is where Actions becomes a real deployment platform. Environments let you gate deployments with approvals, wait timers, and branch restrictions.

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: echo "Deploying to staging..."
      # ... deployment steps

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      url: https://yourapp.com
    steps:
      - run: echo "Deploying to production..."
      # ... deployment steps
```

In the GitHub repository settings, you configure the `production` environment to require:
- **Required reviewers** — one or more team members must approve
- **Wait timer** — delay before deployment proceeds (useful for canary observation)
- **Branch restrictions** — only `main` can deploy to production
- **Deployment branch policies** — enforce specific branch naming

The workflow pauses at the `deploy-production` job and waits for manual approval in the GitHub UI. This is the same approval gate you'd set up in ArgoCD or Spinnaker, but it's built into GitHub.

## Caching That Actually Works

The built-in caching is good, but most teams don't use it effectively. Beyond `actions/cache`, the setup actions have built-in caching:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm   # Automatic npm cache
```

For Docker builds, cache your layers:

```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

The `type=gha` uses GitHub Actions cache backend for Docker layer caching. The `mode=max` caches all layers, not just the final ones. This turned a 12-minute Docker build into a 2-minute build for a Go service I was working on — the base image, dependency installation, and build tool layers all hit cache.

For monorepos, cache strategically:

```yaml
- uses: actions/cache@v4
  with:
    path: |
      node_modules
      packages/*/node_modules
      ~/.cache/Cypress
      .next/cache
    key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-modules-
```

The `restore-keys` fallback is critical. If your lockfile changed, you still get a partial cache hit from the previous run instead of installing everything from scratch.

## A Real-World Workflow

Here's a workflow pattern close to what I use for a Next.js application deploying to AWS:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-arn: ${{ vars.AWS_ROLE_ARN }}
          aws-region: eu-central-1
      - uses: aws-actions/amazon-ecr-login@v2
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: |
            ${{ env.ECR_REGISTRY }}/app:${{ github.sha }}
            ${{ env.ECR_REGISTRY }}/app:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-arn: ${{ vars.AWS_ROLE_ARN }}
          aws-region: eu-central-1
      - run: |
          aws ecs update-service \
            --cluster staging \
            --service app \
            --force-new-deployment

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-arn: ${{ vars.AWS_ROLE_ARN }}
          aws-region: eu-central-1
      - run: |
          aws ecs update-service \
            --cluster production \
            --service app \
            --force-new-deployment
```

Quality gate → Docker build with layer caching → deploy to staging → manual approval → deploy to production. OIDC everywhere, no stored credentials. The `concurrency` block cancels outdated runs when you push again. This isn't a toy example — it's close to what runs in production.

## Self-Hosted Runners: When You Need More

GitHub's hosted runners are fine for most workloads, but there are cases where self-hosted runners make sense:

- **Large Docker builds** that need more than 7GB RAM
- **GPU workloads** for ML model testing
- **Network access** to private resources behind a VPN
- **Cost optimization** at scale (hosted runners bill per minute)

Setting up a self-hosted runner on an EC2 instance or a Kubernetes cluster with `actions-runner-controller` is straightforward, and the runner labels let you target specific hardware:

```yaml
jobs:
  heavy-build:
    runs-on: [self-hosted, linux, gpu]
    steps:
      - run: nvidia-smi  # GPU available
```

## The Mindset Shift

The jump from "CI that runs tests" to "CI/CD platform that deploys" is mostly about knowing these features exist. Matrix builds, reusable workflows, OIDC, environments with approvals, caching — none of this is hard to set up. It's just not covered in most "Getting Started with GitHub Actions" tutorials.

My advice: audit your current workflows. If you have duplicated YAML, extract reusable workflows. If you have cloud credentials as secrets, switch to OIDC. If you deploy by SSHing into a server, add environment protection rules. Each change is incremental, and each one makes your pipeline meaningfully better.

GitHub Actions isn't just a test runner. Treat it like the deployment platform it is.
