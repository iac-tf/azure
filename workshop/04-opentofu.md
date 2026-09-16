---
title: "4 · OpenTofu"
layout: post
parent: Workshop
nav_order: 5
permalink: /workshop/opentofu/
redirect_from:
  - /terraform/opentofu/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## Background

OpenTofu is a fork of the main Terraform branch. In August 2023 HashiCorp relicensed Terraform (and other products) from the **Mozilla Public License 2.0 (MPL)** to the **Business Source License 1.1 (BSL)**. The BSL restricts use in products that compete with HashiCorp's commercial offerings. In response, the community — backed by Gruntwork, Spacelift, env0, and others — forked Terraform at v1.5.7 (the last MPL release) and created **OpenTofu**, now stewarded by the **Linux Foundation**.

## Pros

* More open to feature requests — community-driven roadmap via GitHub RFCs
* For the first 5 years there is already a commitment to provide 18 FTEs from multiple companies
* Became part of the Linux Foundation — vendor-neutral governance
* Compatibility promise from the OpenTofu team — drop-in replacement for Terraform ≤ 1.5
* MPL 2.0 licensed — safe to use in any context without BSL restrictions
* State format is compatible — existing `.tfstate` files work with OpenTofu

## Cons

* Splintering of community — some providers and modules are tested against Terraform first
* Smaller ecosystem than Terraform (growing, but still newer)
* Tooling (Terraform Cloud, CDK for Terraform) is HashiCorp-specific and may not work with OpenTofu

## Compatibility

OpenTofu is a **drop-in replacement** for Terraform up to version 1.5. Most `.tf` configuration files, providers, and modules work without modification. Replace the `terraform` binary with `tofu` and the workflow is identical:

```bash
# Terraform
terraform init && terraform plan && terraform apply

# OpenTofu (identical workflow)
tofu init && tofu plan && tofu apply
```

## Installing OpenTofu

```bash
# macOS
brew install opentofu

# Ubuntu / Debian
curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh | sh

# Windows
winget install OpenTofu.OpenTofu
```

## Links

[OpenTofu Docs](https://opentofu.org/){: .btn .btn-blue }
[OpenTofu GitHub](https://github.com/opentofu/opentofu){: .btn .btn-blue }
[OpenTofu Registry](https://github.com/opentofu/registry){: .btn .btn-blue }

</div>

---

There's no separate lab for this module — the OpenTofu workflow is deliberately identical to Terraform's (see module 3), so the only thing that changes is which license governs the binary you run.

{% include quiz.html id="opentofu-quiz" title="OpenTofu" questions='[{"q":"Why was OpenTofu created in 2023?","choices":["Terraform was discontinued by HashiCorp","HashiCorp relicensed Terraform from MPL to the more restrictive BSL","Terraform dropped support for Azure","OpenTofu actually predates Terraform"],"correct":1,"explain":"The community forked the last MPL-licensed release (v1.5.7) in direct response to the BSL relicensing."},{"q":"Who governs OpenTofu today?","choices":["HashiCorp exclusively","The Linux Foundation, as vendor-neutral governance","Microsoft","No one — it is unmaintained"],"correct":1,"explain":"OpenTofu is a Linux Foundation project, backed by a multi-company commitment of engineering time."},{"q":"Is OpenTofu compatible with existing Terraform state files?","choices":["No, migrating requires rewriting all state from scratch","Yes, existing .tfstate files work with OpenTofu directly","Only for AWS-only configurations","Only if the project never used modules"],"correct":1,"explain":"The state format did not change in the fork, so tofu can pick up an existing .tfstate file produced by terraform."},{"q":"A startup wants to build a commercial infrastructure-management SaaS product on top of an IaC engine, and wants zero license risk around competing with the engine’s vendor. What fits best?","choices":["Terraform (BSL) — no restrictions apply to SaaS products","OpenTofu (MPL 2.0) — no BSL-style competition restriction","ARM Templates, since JSON has no license at all","Bicep, since it is proprietary either way"],"correct":1,"explain":"BSL specifically restricts building products that compete with the licensor’s commercial offerings — exactly the scenario this startup is in, so the MPL-licensed OpenTofu avoids that risk entirely."}]' %}

## Next Up

The [azapi provider](../azapi/) closes Terraform's day-0 coverage gap by talking to the ARM API directly.
