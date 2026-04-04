---
title: OpenToFu
layout: post
parent: Terraform
---

OpenTofu is a fork of the main Terraform branch.
Hashicorp chose to switch from MPL to BSL license, prompting the community to create an open-source alternative.

## Background

In August 2023 HashiCorp relicensed Terraform (and other products) from the **Mozilla Public License 2.0 (MPL)** to the **Business Source License 1.1 (BSL)**. The BSL restricts use in products that compete with HashiCorp's commercial offerings. In response, the community — backed by Gruntwork, Spacelift, Env0, and others — forked Terraform at v1.5.7 (the last MPL release) and created **OpenTofu**, now stewarded by the **Linux Foundation**.

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
[OpenToFu Docs](https://opentofu.org/){: .btn .btn-blue }
[OpenTofu GitHub](https://github.com/opentofu/opentofu){: .btn .btn-blue }
[OpenTofu Registry](https://github.com/opentofu/registry){: .btn .btn-blue }
