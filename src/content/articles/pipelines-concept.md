---
title: "Pipelines Are a Way of Thinking, Not a Tool"
date: "2026-01-25"
description: "CI/CD is one implementation. The pipeline is the idea — and understanding it as a mental model makes you a better engineer regardless of the tool you use."
category: "devOps"
tags: ["Pipelines", "Architecture", "CI/CD", "DevOps", "Mental Models"]
readTime: "8 min read"
---

When someone says "pipeline," most developers hear "CI/CD." GitHub Actions, Jenkins, GitLab CI — something that runs tests and deploys code. And that's fine as far as it goes, but it's like hearing "array" and only thinking "shopping list." The pipeline is a much older, much more general idea, and understanding it as a mental model — not a tool — will change how you design systems.

## The Original Pipeline

The pipeline concept predates DevOps by decades. It comes from Unix, 1973, and it looks like this:

```bash
cat access.log | grep "POST /api" | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

Six stages. Each one takes input, transforms it, produces output. Each one is independent — `grep` doesn't know or care that `awk` comes next. Each one does exactly one thing. The pipe (`|`) is just the connective tissue.

This command finds the top 20 IP addresses making POST requests to your API. But more importantly, it demonstrates the pipeline mental model:

```
Input → Stage → Output → Stage → Output → Stage → Output
```

Every stage has a contract: it reads from stdin, it writes to stdout. That contract is what makes composition possible. You can swap any stage, add stages, remove stages. The pipeline is modular not because someone designed a plugin system, but because the interface between stages is simple and universal.

Doug McIlroy, who invented Unix pipes, described it as: "Write programs that do one thing and do it well. Write programs to work together." That's not just Unix philosophy. That's the pipeline pattern.

## CI/CD: One Implementation

A CI/CD pipeline is the same idea applied to software delivery:

```
Code Push → Lint → Test → Build → Deploy Staging → Approve → Deploy Production
```

Each stage takes an input (the code, the artifact, the approval), does one thing, and produces an output for the next stage. Jenkins didn't invent this — it just made it accessible. GitHub Actions didn't reinvent it — it just made it YAML.

But here's what matters: the *properties* of this pipeline are identical to the Unix pipe. Stages are independent. Each stage can be observed (logs, metrics). Failures are contained — a failing test doesn't corrupt your deployment; it stops the pipeline. You can swap stages without rewriting the whole thing.

When teams struggle with CI/CD, it's usually because they've violated the pipeline model. They create stages that depend on side effects from other stages. They build monolithic steps that lint, test, build, and deploy in one script. They make the stages tightly coupled, which means you can't run one without the others.

If you think of CI/CD as "a pipeline tool" instead of "the pipeline pattern applied to delivery," you'll never see these design mistakes for what they are.

## Data Pipelines: Same Pattern, Different Domain

ETL (Extract, Transform, Load) pipelines are the same mental model applied to data:

```
Raw Data → Extract → Clean → Transform → Validate → Load → Serve
```

A typical data pipeline might look like this:

```python
# Each function is a pipeline stage
# Input → Output, no side effects, independently testable

def extract(source_config):
    """Pull raw data from source systems."""
    raw = fetch_from_api(source_config["endpoint"])
    return raw

def clean(raw_data):
    """Remove nulls, fix encodings, deduplicate."""
    cleaned = [r for r in raw_data if r["id"] is not None]
    cleaned = deduplicate(cleaned, key="id")
    return cleaned

def transform(cleaned_data, schema):
    """Reshape data to match target schema."""
    return [
        {
            "user_id": r["id"],
            "name": f"{r['first']} {r['last']}",
            "active": r["status"] == "active",
            "updated_at": parse_timestamp(r["modified"]),
        }
        for r in cleaned_data
    ]

def validate(transformed_data):
    """Check data quality constraints."""
    errors = []
    for record in transformed_data:
        if not record["user_id"]:
            errors.append(f"Missing user_id: {record}")
    if errors:
        raise DataQualityError(errors)
    return transformed_data

def load(validated_data, target):
    """Write to destination."""
    target.bulk_upsert(validated_data)

# The pipeline
raw = extract(config)
cleaned = clean(raw)
transformed = transform(cleaned, target_schema)
validated = validate(transformed)
load(validated, warehouse)
```

Each function is a stage. Each takes input and produces output. Each can be tested independently. You could swap `load` to write to a different database without touching anything else. You could add a `normalize` stage between `clean` and `transform` without rewriting the pipeline.

This is the same pattern as `cat | grep | sort`. The data is different, the language is different, the stakes are different. The architecture is identical.

## ML Pipelines: Same Pattern, Higher Stakes

Machine learning pipelines extend the model further:

```
Raw Data → Preprocess → Feature Engineering → Train → Evaluate → Register → Deploy → Monitor
```

Tools like Kubeflow, MLflow, and Vertex AI Pipelines exist because ML teams realized they needed the pipeline pattern with additional properties: versioning (which data, which features, which model), reproducibility (run the same pipeline, get the same model), and lineage (this prediction came from this model, trained on this data, using these features).

But strip away the ML-specific concerns and it's still: input → stage → output → stage → output. The mental model is the same.

![Pipeline flow diagram comparing CI/CD, data, and ML pipeline stages](/images/articles/pipelines-concept/pipeline-flow.svg)

## Event-Driven Pipelines: Async but Same Idea

Not every pipeline is synchronous. Event-driven architectures are pipelines where the connective tissue is a message queue instead of a function call or a Unix pipe:

```
User Action → Event → Process → Event → Enrich → Event → Store → Event → Notify
```

```
Order Placed → [Queue] → Validate Inventory → [Queue] → Process Payment → [Queue] → Ship
```

Each stage consumes an event, does its work, produces a new event. The stages are even more independent than in synchronous pipelines — they might run on different services, in different languages, on different schedules.

When I was working on LifeOS, the backend event flow followed this pattern. A user action produces an event, that event triggers processing, which produces another event, which triggers storage and notification. Each stage is a Go service (or function) that reads from a queue and writes to a queue. The pipeline model made it natural to add stages — analytics processing, for instance — without touching existing ones.

## The Shared Properties

Across all these implementations — Unix pipes, CI/CD, data pipelines, ML pipelines, event-driven systems — the pipeline pattern has consistent properties:

**1. Stages are independent.** Each stage knows its input contract and its output contract. It doesn't know what comes before or after.

**2. Failures are contained.** A failing stage stops the pipeline (or routes to error handling) without corrupting downstream stages. The blast radius is one stage.

**3. Each stage is observable.** You can log, meter, and trace each stage independently. When something goes wrong, you know *where* it went wrong.

**4. Stages are composable.** You can add, remove, reorder, or replace stages without rewriting the pipeline. The interface between stages is the stable contract.

**5. The pipeline is a directed flow.** Data moves in one direction. There are no cycles (that's a different pattern — feedback loops). The flow is predictable.

**6. Stages can be parallelized.** Independent stages can run concurrently. In CI/CD, that's parallel jobs. In data pipelines, that's parallel partitions. In Unix, that's how pipes actually work at the OS level — `grep` starts processing before `cat` finishes.

These properties aren't accidents. They're why the pattern works. And they're why every domain keeps reinventing it — it maps cleanly onto how we naturally decompose problems.

## Why This Mental Model Matters

When I approach a new problem, one of the first things I ask is: "Is this a pipeline?" Meaning: can I decompose this into stages with clear inputs and outputs, where each stage does one thing?

If yes, the design almost writes itself. The stages become functions, services, or jobs. The interfaces become data contracts. Error handling becomes "what happens when a stage fails." Observability becomes "what do I measure at each stage."

If no — if the problem involves cycles, shared mutable state, or stages that need to communicate bidirectionally — then the pipeline isn't the right model. Forcing a pipeline onto a non-pipeline problem creates complexity.

But here's what I've found: most problems are pipelines, or contain pipelines. A web request is a pipeline (middleware → auth → validate → handle → serialize → respond). A build system is a pipeline. Data processing is a pipeline. Deployment is a pipeline. Even debugging is a pipeline (reproduce → isolate → diagnose → fix → verify).

## The Tool Trap

The reason I'm writing this isn't to explain what a pipeline is — you already know. It's to push back on the tool-first thinking that dominates DevOps conversations.

"We need Jenkins." No, you need a pipeline. Jenkins is one way to run it.
"We need Airflow." No, you need orchestrated data stages. Airflow is one way to orchestrate them.
"We need Kafka." No, you need decoupled event processing. Kafka is one way to decouple.

When you understand the pipeline as a mental model, the tool becomes an implementation detail. You evaluate tools against the pattern's properties: does this tool let my stages be independent? Does it contain failures? Does it give me observability? Can I add stages without rewriting?

Some tools answer yes better than others. But the questions come from understanding the pattern, not from reading the tool's marketing page.

## Thinking in Pipelines

The most practical thing I can leave you with: next time you're designing a system, draw it as a pipeline first. Boxes and arrows. Input on the left, output on the right. Each box does one thing.

If the design fits naturally, you have your architecture. If it doesn't — if you keep drawing arrows that go backward, or boxes that need to talk to each other sideways — that's useful information too. It tells you the problem has a different shape, and you need a different pattern.

But start with the pipeline. It's the most general, most composable, most debuggable architecture pattern we have. Not because it's the newest or the most sophisticated — but because Doug McIlroy figured out something fundamental in 1973 that we keep rediscovering in every domain, every decade, with fancier tools and the same underlying idea.

Input. Stage. Output. Repeat.
