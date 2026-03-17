---
title: "EKS vs. ECS: When Kubernetes Is Overkill"
date: "2026-01-05"
description: "An honest comparison of AWS EKS and ECS from someone who's run production workloads on both — and the question most teams skip: do you even need either?"
category: "devOps"
tags: ["AWS", "EKS", "ECS", "Kubernetes", "Docker", "DevOps"]
readTime: "10 min read"
---

## The Decision Nobody Makes Intentionally

Most teams don't choose between EKS and ECS after careful evaluation. What actually happens is one of two things:

1. Someone on the team has Kubernetes experience, so EKS it is.
2. Nobody wants to learn Kubernetes, so ECS wins by default.

Both are terrible ways to make an infrastructure decision. After running production workloads on both — EKS for Tafkeer's multi-service backend, ECS for simpler API deployments — here's the framework I wish I'd had earlier.

## ECS in 60 Seconds

ECS (Elastic Container Service) is AWS's own container orchestrator. You define a **task definition** (your container config), a **service** (how many copies, what load balancer), and a **cluster** (where it runs). AWS handles scheduling, scaling, and health checks.

```json
{
  "family": "api-service",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "123456789.dkr.ecr.eu-central-1.amazonaws.com/api:latest",
      "portMappings": [{ "containerPort": 3000 }],
      "memory": 512,
      "cpu": 256,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-service",
          "awslogs-region": "eu-central-1"
        }
      }
    }
  ]
}
```

With Fargate (serverless mode), you don't even manage EC2 instances. You describe the container, AWS runs it somewhere. The operational surface area is small.

## EKS in 60 Seconds

EKS (Elastic Kubernetes Service) is managed Kubernetes on AWS. AWS runs the control plane (API server, etcd, scheduler), and you manage the worker nodes (or use Fargate). You get the full Kubernetes API — pods, deployments, services, ingress, custom operators, the works.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: 123456789.dkr.ecr.eu-central-1.amazonaws.com/api:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

More YAML, more concepts, more power. That last part is the crux of the decision.

## The Honest Comparison

### Complexity

**ECS:** You need to understand task definitions, services, target groups, and IAM roles. That's about it. An experienced developer can go from zero to production deployment in a day.

**EKS:** You need to understand all of the above (because it's still AWS networking underneath), *plus* Kubernetes concepts: pods, deployments, services, ingress controllers, RBAC, namespaces, ConfigMaps, Secrets, PersistentVolumeClaims, and often Helm charts. Realistically, it takes weeks to become proficient.

The knowledge burden is the single biggest cost of EKS. Not the $0.10/hr control plane fee. Not the compute costs. The cognitive load on every engineer who needs to deploy, debug, or operate the system.

### Scaling

**ECS:** Auto-scales services based on CPU, memory, or custom CloudWatch metrics. It works. Configuration is straightforward.

**EKS:** Horizontal Pod Autoscaler (HPA) scales pods based on metrics. Cluster Autoscaler or Karpenter scales nodes when pods can't be scheduled. KEDA can scale based on queue depth or custom sources. More options, more knobs, more to get wrong.

For Tafkeer, I use HPA + Karpenter on EKS because AI inference workloads are bursty — usage spikes when Arabic-speaking regions wake up. Karpenter provisions GPU-capable nodes on demand and removes them when idle. This level of control isn't possible with ECS Fargate.

### Networking

**ECS:** Uses AWS VPC networking natively. Service-to-service communication goes through a load balancer or AWS Cloud Map for service discovery. Simple but limited.

**EKS:** Kubernetes networking adds a virtual network layer. Services get cluster-internal DNS (`api.default.svc.cluster.local`). You can use a service mesh (Istio, Linkerd) for observability and traffic management.

If your services talk to each other a lot, Kubernetes' built-in service discovery is genuinely more elegant than ECS's Cloud Map integration. If you have 2-3 services behind a load balancer, ECS is simpler.

### Cost

Here's a breakdown for a typical workload (3 services, ~4 vCPU total):

| Component | ECS Fargate | EKS + EC2 |
|-----------|-------------|-----------|
| Compute | ~$140/mo | ~$105/mo |
| Control plane | $0 | $73/mo |
| Load balancer | ~$25/mo | ~$25/mo |
| **Total** | **~$165/mo** | **~$203/mo** |

EKS is more expensive at small scale because of the fixed control plane cost. At larger scale (10+ services, 20+ vCPU), EKS on EC2 becomes cheaper because you avoid Fargate's markup on compute.

### Debugging

**ECS:** CloudWatch Logs, `ecs exec` to shell into a running container, CloudWatch metrics. The tooling is AWS-native and works.

**EKS:** `kubectl logs`, `kubectl exec`, `kubectl describe`, Prometheus, Grafana, `kubectl top`. More powerful, more to set up. When a pod is crash-looping, `kubectl describe pod` gives you events that are genuinely more helpful than ECS's equivalent.

## The Decision Framework

After going through this with multiple teams, here's the framework I use:

### Choose ECS when:

- **You have 1-5 services.** The orchestration needs are simple. ECS handles them with less overhead.
- **Your team doesn't have Kubernetes experience.** Learning Kubernetes to run three containers is a bad trade-off.
- **You want minimal operational burden.** ECS Fargate is genuinely "deploy and forget" for stable workloads.
- **You're a small team.** Every hour spent on infrastructure is an hour not spent on product.

### Choose EKS when:

- **You have 10+ services** with complex inter-service communication. Kubernetes' networking model starts paying for itself.
- **You need advanced scheduling** — GPU workloads, spot instances with graceful drainage, bin-packing optimization.
- **You're multi-cloud or cloud-agnostic.** Kubernetes abstracts the cloud provider. If you might move to GCP or Azure, Kubernetes skills transfer. ECS skills don't.
- **Your team already knows Kubernetes.** The biggest cost of EKS is learning. If that cost is paid, the benefits are real.
- **You need the ecosystem.** Istio, ArgoCD, Prometheus, cert-manager, external-dns — the Kubernetes ecosystem is massive. Nothing comparable exists for ECS.

### Choose neither when:

This is the option most teams forget. If you have a single API server, put it on:
- **AWS App Runner** — container deployment with zero infrastructure management
- **Lambda + API Gateway** — if your workload is request/response with no persistent connections
- **A plain EC2 instance with Docker Compose** — for prototypes and early-stage products

Not everything needs an orchestrator.

## What I'd Do Differently

Looking back at my infrastructure decisions:

- **Tafkeer (EKS):** Correct choice. Multiple services, GPU inference, bursty traffic, complex scheduling needs. Kubernetes earns its complexity here.
- **Portfolio site (neither):** Static hosting on Netlify. No containers needed.
- **Early-stage LifeOS prototype:** Should have started with ECS, migrated to EKS later when the service count justified it. We went straight to EKS and spent the first month fighting Kubernetes instead of building product.

The best infrastructure decision is the one that lets your team ship product fastest today while not painting you into a corner tomorrow. For most teams at most stages, that's ECS or something even simpler.

Kubernetes is a powerful tool. But powerful tools that you don't need are just expensive distractions.
