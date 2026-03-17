---
title: "Terraform for Engineers Who've Only Used the Console"
date: "2026-01-20"
description: "A practical introduction to Terraform — state, modules, planning, and the real pain points — for developers who've been clicking through AWS console and want to stop."
category: "devOps"
tags: ["Terraform", "IaC", "AWS", "DevOps", "Infrastructure"]
readTime: "11 min read"
---

## The Console Isn't Scaling

You have an AWS account. You've been clicking through the console — creating EC2 instances, setting up RDS databases, configuring load balancers. It works. Your app runs.

Then someone asks: "Can you recreate this in a staging environment?" And you realize you have no idea what you actually configured. Was it `t3.medium` or `t3.large`? What security group rules did you add? Which subnet is the database in?

This is where Infrastructure as Code starts to make sense — not as a best practice to follow because someone told you to, but as a real solution to a real problem: your infrastructure exists only in the console's UI state, and that state lives nowhere reproducible.

## What Terraform Actually Is

Terraform is a tool that lets you describe your infrastructure in `.tf` files (HCL syntax), compare that description against what actually exists in your cloud account, and reconcile the differences.

The core loop is:

1. **Write** — Describe what you want in `.tf` files
2. **Plan** — Terraform shows you what it would change
3. **Apply** — Terraform makes those changes
4. **State** — Terraform records what it created so it can manage it later

```hcl
# main.tf — your first Terraform file
provider "aws" {
  region = "eu-central-1"
}

resource "aws_instance" "api" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name        = "api-server"
    Environment = "production"
  }
}
```

Run `terraform plan` and Terraform tells you: "I'm going to create one EC2 instance with these exact specs." Run `terraform apply` and it does it. Run `terraform apply` again and nothing happens — because the real state already matches the desired state.

That last part is the key insight. Terraform is *declarative*: you describe the end state, not the steps to get there. If the instance already exists with the right configuration, Terraform does nothing.

## State: The Most Important Concept

When you run `terraform apply`, Terraform creates a file called `terraform.tfstate`. This file maps your `.tf` definitions to real AWS resource IDs. It's how Terraform knows that the `aws_instance.api` in your code corresponds to instance `i-0abc123def456` in your account.

This state file is both essential and dangerous:

- **Without it**, Terraform can't manage your resources. It would try to create duplicates every time you run `apply`.
- **If it's corrupted or lost**, you'll need to import every existing resource back into state manually. This is painful.
- **If two people modify it simultaneously**, you get state corruption.

For solo projects, local state is fine. For teams, use remote state:

```hcl
# backend.tf — store state in S3 with DynamoDB locking
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

The DynamoDB table provides locking — if someone is running `apply`, nobody else can modify state simultaneously. Set this up on day one. Not day two. Day one.

## The Plan/Apply Workflow

`terraform plan` is your safety net. It shows you exactly what will change before anything happens:

```bash
$ terraform plan

Terraform will perform the following actions:

  # aws_instance.api will be created
  + resource "aws_instance" "api" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t3.medium"
      + tags          = {
          + "Name"        = "api-server"
          + "Environment" = "production"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

The symbols matter:
- `+` means create (safe)
- `~` means modify in-place (usually safe)
- `-/+` means destroy and recreate (**not safe** — causes downtime)
- `-` means destroy (**definitely not safe**)

The most common mistake beginners make is not reading the plan carefully. Changing certain properties on an AWS resource forces a replacement — Terraform will destroy the old resource and create a new one. For a database, that means data loss. For a server, that means downtime.

Always read the plan. Every line.

## Variables and Environments

Hardcoding values in `.tf` files works for a tutorial but not for real infrastructure. Variables let you parameterize:

```hcl
# variables.tf
variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

# main.tf
resource "aws_instance" "api" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Name        = "api-${var.environment}"
    Environment = var.environment
  }
}
```

Then use `.tfvars` files per environment:

```hcl
# prod.tfvars
environment   = "production"
instance_type = "t3.large"

# staging.tfvars
environment   = "staging"
instance_type = "t3.small"
```

```bash
terraform plan -var-file="prod.tfvars"
terraform plan -var-file="staging.tfvars"
```

Same code, different environments. This is the "recreate staging" problem, solved.

## Modules: Reusable Infrastructure

When you find yourself copy-pasting resource blocks, extract a module:

```
modules/
  api-server/
    main.tf      # resource definitions
    variables.tf # inputs
    outputs.tf   # outputs
```

```hcl
# modules/api-server/main.tf
resource "aws_instance" "this" {
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.subnet_id

  tags = {
    Name = "${var.name}-api"
  }
}

# modules/api-server/outputs.tf
output "instance_id" {
  value = aws_instance.this.id
}
```

```hcl
# environments/prod/main.tf
module "api" {
  source        = "../../modules/api-server"
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.large"
  subnet_id     = module.vpc.private_subnet_ids[0]
  name          = "prod"
}
```

Modules are just directories with `.tf` files. No framework, no registry requirement, no magic. Start with inline resources, extract modules when you have actual duplication.

## The Real Pain Points

### Drift

Someone logs into the console and changes a security group rule manually. Terraform doesn't know. Next time you run `plan`, Terraform will either try to revert the change (if your code doesn't include it) or not notice at all (if you haven't refreshed state).

Run `terraform plan` regularly, even when you haven't changed code. It catches drift.

### Dependency Hell

Terraform has a provider for almost everything — AWS, GCP, Azure, Cloudflare, Datadog, PagerDuty. Each provider has its own version and its own bugs. Provider version pinning is essential:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

The `~>` operator means "5.x but not 6.x." Without this, a provider update can change resource behavior unexpectedly.

### The Blast Radius Problem

Terraform operates on the directory level. If all your infrastructure is in one directory, `terraform apply` can potentially modify everything — your database, your servers, your DNS, your IAM roles — in a single operation.

Split your Terraform into isolated "stacks" by risk level:

```
infrastructure/
  network/        # VPC, subnets — rarely changes
  data/           # RDS, ElastiCache — changes are high-risk
  compute/        # ECS, EC2 — changes are medium-risk
  dns/            # Route53 — low frequency
```

A mistake in `compute/` can't accidentally delete your database because it's in a different state file.

## The Honest Assessment

Terraform has real costs: learning curve, state management complexity, and the constant temptation to over-abstract. But the alternative — clickops and tribal knowledge — has higher costs that you pay later, usually at 2 AM when you need to recreate an environment and nobody remembers how it was set up.

Start small. Terraform your next new resource instead of clicking through the console. Get comfortable with `plan` and `apply`. Add remote state when you have a teammate. Extract modules when you have duplication.

Infrastructure as Code is not about the tool. It's about having a single source of truth for what your infrastructure looks like. Terraform is a good way to get there.
