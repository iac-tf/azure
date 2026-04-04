---
title: Home
layout: home
nav_order: 1
description: "An overview of IaC solutions on Azure"
permalink: /
---

Overview of IaC solutions for Azure — compare **ARM Templates**, **Bicep**, and **Terraform / OpenTofu** side by side.

----

## Why Infrastructure as Code?

- **Repeatability** — deploy identical environments across dev, staging, and production.
- **Version control** — track every infrastructure change alongside your application code.
- **Automation** — integrate deployments into CI/CD pipelines.
- **Documentation** — the config files *are* the living documentation.
- **Drift detection** — know when actual state diverges from desired state.

----

## The Three Options at a Glance

|                       | ARM Templates              | Bicep                        | Terraform / OpenTofu          |
|:----------------------|:---------------------------|:-----------------------------|:------------------------------|
| **Language**          | JSON                       | Bicep DSL                    | HCL                           |
| **Maintained by**     | Microsoft                  | Microsoft                    | HashiCorp / OpenTofu          |
| **Scope**             | Azure only                 | Azure only                   | Multi-cloud                   |
| **State file**        | No (Azure tracks state)    | No (Azure tracks state)      | Yes — local or remote `.tfstate` |
| **Day-0 coverage**    | Full                       | Full                         | Provider lag possible         |
| **Plan preview**      | `--what-if`                | `--what-if`                  | `terraform plan`              |
| **Learning curve**    | Steep                      | Moderate                     | Moderate                      |
| **IDE support**       | Good                       | Excellent                    | Excellent                     |

----

## Choosing the Right Tool

- **Azure-only shop, want the best native experience?** → [Bicep](./bicep)
- **Already using Terraform across multiple clouds?** → [Terraform / OpenTofu](./terraform)
- **Need raw API access or maintaining existing pipelines?** → [ARM Templates](./arm)
- **Migrating from ARM to something more readable?** → [Bicep](./bicep) is a natural step — Bicep compiles directly to ARM.

----

[ARM Templates](./arm){: .btn .btn-blue }
[Bicep](./bicep){: .btn .btn-blue }
[Terraform](./terraform){: .btn .btn-blue }
[Comparison](./comparison){: .btn .btn-outline }
  
