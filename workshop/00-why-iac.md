---
title: "0 · Why IaC"
layout: post
parent: Workshop
nav_order: 1
permalink: /workshop/why-iac/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## What Does "Infrastructure as Code" Mean?

Infrastructure as Code (IaC) means you describe your cloud resources — networks, VMs, storage accounts, databases — in text files, instead of clicking through a web portal. Those files live in version control, get reviewed like any other code change, and are applied by a tool (Bicep, Terraform, ARM, ...) that talks to the cloud provider's API on your behalf.

Two words come up constantly in IaC, and the rest of this workshop assumes you know them:

* **Declarative** — you describe the *end state* you want ("a Standard_LRS storage account named `x` exists"), not the step-by-step commands to get there. The tool figures out the "how."
* **Idempotent** — running the same deployment twice with no code changes produces the same result both times. No duplicate resources, no errors on the second run.

## Pros of IaC (as a practice, not any one tool)

* **Repeatability** — spin up an identical dev, staging, or DR environment from the same source, instead of hoping a human clicked the same 40 portal settings correctly twice.
* **Version control** — every infrastructure change has a diff, an author, a timestamp, and (ideally) a PR review — the same accountability you already expect from application code.
* **Automation / CI/CD** — deployments can run in a pipeline on merge, instead of a person following a runbook at 5pm on a Friday.
* **Documentation that can't go stale** — the config files *are* the infrastructure. There's no separate wiki page describing "how prod is set up" that quietly drifts out of date.
* **Faster, safer recovery** — if a resource (or an entire environment) is deleted, IaC lets you redeploy from code instead of reconstructing it from memory or old screenshots.
* **Blast-radius control** — plan/what-if previews (covered in every module from here on) tell you exactly what a change will do *before* it touches anything.

## Cons of IaC (the honest list)

* **Learning curve** — a new language (HCL, Bicep, JSON) and a new mental model (declarative vs. imperative) for every engineer touching infrastructure.
* **Tooling and process overhead** — someone has to own the pipeline, the state backend (for Terraform), secrets, and access control. It's not "free" compared to a person clicking the portal for a single one-off resource.
* **Drift management** — the moment someone (or some other automation) changes a resource outside of IaC, your code and reality disagree. See the lab below.
* **Upfront investment** — writing good, reusable, parameterized modules takes real time; it's easy to underestimate for a "quick" project.
* **Blast radius cuts both ways** — a bad `apply` can change or delete far more than a bad portal click, precisely *because* it's automated and can act on many resources at once. Previews and reviews mitigate this, but don't eliminate it.
* **Abstraction leaks** — every tool in this workshop has gaps where it lags the underlying cloud API (most visible in the [azapi module](../azapi/)) or where its preview isn't 100% accurate.

## The Core Trade-off

IaC trades a lower **day-to-day** cost per change (once it's set up: fast, reviewable, repeatable) for a higher **upfront** cost (learning the tool, building the pipeline, writing the first modules). For a single VM you'll never touch again, the portal is faster. For anything you'll deploy more than once, or that more than one person needs to reason about, IaC wins — which is why it's the default in professional cloud teams today.

</div>

---

{% capture drift_lab_task %}
An engineer manually changed this storage account's replication setting to `Standard_GRS` directly in the Azure Portal — that's **drift**: the deployed resource no longer matches what your code declares. You've decided the manual change was the right call, so instead of reverting it on the next deploy, update the declaration below to match reality.

Change `sku` so a plan/what-if against this code would show **zero** changes.
{% endcapture %}

{% capture drift_lab_starter %}{
  "resourceType": "Microsoft.Storage/storageAccounts",
  "sku": "Standard_LRS",
  "accessTier": "Hot",
  "minimumTlsVersion": "TLS1_2"
}{% endcapture %}

{% capture drift_lab_solution %}{
  "resourceType": "Microsoft.Storage/storageAccounts",
  "sku": "Standard_GRS",
  "accessTier": "Hot",
  "minimumTlsVersion": "TLS1_2"
}{% endcapture %}

{% include lab.html id="why-iac-lab" title="Resolve the Drift" lang="json" task=drift_lab_task starter=drift_lab_starter solution=drift_lab_solution checks='[{"test":"Standard_GRS","type":"contains","message":"sku is now Standard_GRS, matching the live resource"},{"test":"Standard_LRS","type":"not_contains","message":"the stale Standard_LRS value is gone"}]' %}

{% include quiz.html id="why-iac-quiz" title="Check your understanding" questions='[{"q":"IaC tools like Bicep and Terraform are described as \"declarative\". What does that mean?","choices":["You write step-by-step commands for how to create each resource","You describe the desired end state, and the tool figures out how to get there","You must declare every variable before using it","Declarative tools cannot be stored in version control"],"correct":1,"explain":"Declarative means you state what you want (e.g. \"a Standard_LRS storage account exists\"), not how to create it step by step — that is the opposite of imperative scripting."},{"q":"Running the same IaC deployment twice with no code changes should...","choices":["Fail on the second run","Produce the same result both times (idempotent)","Create a duplicate resource","Always delete and recreate everything"],"correct":1,"explain":"Idempotency is a core IaC property: re-running a deployment against unchanged code and unchanged infrastructure is a safe no-op."},{"q":"What is \"drift\" in an IaC context?","choices":["When your Terraform state file grows too large","When the deployed infrastructure no longer matches what your code declares","When you switch cloud providers mid-project","When a deployment takes a long time to finish"],"correct":1,"explain":"Drift happens whenever reality and code disagree — usually because someone changed a resource outside of the IaC workflow."},{"q":"Which of these is a genuine cost of adopting IaC as a practice, not just a quirk of one tool?","choices":["It makes all infrastructure completely immutable forever","Upfront learning curve and pipeline/process overhead for the team","It guarantees your cloud bill will be zero","It prevents anyone from ever using the Azure Portal again"],"correct":1,"explain":"IaC is a net win for anything deployed more than once, but it is not free — someone has to learn the tool and own the pipeline, state, and access control."}]' %}

## Next Up

Now that you know the vocabulary, module 1 dives into the oldest Azure-native option: [ARM Templates](../arm-templates/).
