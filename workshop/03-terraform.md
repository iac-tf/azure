---
title: "3 · Terraform"
layout: post
parent: Workshop
nav_order: 4
permalink: /workshop/terraform/
redirect_from:
  - /terraform/
  - /terraform/plan/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## What Is Terraform?

Terraform (by HashiCorp) uses **HashiCorp Configuration Language (HCL)** to provision infrastructure declaratively. Its main power comes from multi-provider support — one workflow for Azure, AWS, GCP, Kubernetes, and hundreds more providers. Unlike ARM and Bicep, Terraform maintains a **state file** that records what it has deployed, enabling it to calculate a precise diff and show you exactly what will change before applying.

**OpenTofu** is a community-driven, fully open-source fork of Terraform created in 2023 after HashiCorp relicensed Terraform from MPL to BSL — covered in the [next module](../opentofu/).

## Pros

* Multiple providers — manage Azure, AWS, GCP, and on-premises in one tool
* Great planning functionality — `terraform plan` shows an exact diff before any change is made
* HCL is one of the better notation methods without using a full programming language
* Module support — reusable modules from the Terraform Registry or your own registry
* Large ecosystem — thousands of community modules and providers
* Drift detection — `terraform plan` compares state vs live resources

## Cons

* State store — requires a shared remote backend (e.g. Azure Blob Storage) for team use; state locking is critical
* Importing in brown-field environments — `terraform import` works but mapping existing resources to HCL is tedious
* Azure day-0 lag — new Azure features may take days or weeks to appear in the `azurerm` provider; mitigated by the [`azapi` provider](../azapi/) (maintained by Microsoft, day-0 coverage)
* BSL license (Terraform ≥ 1.6) — HashiCorp's license restricts use in competing products (the reason OpenTofu was forked)

## Quick Example

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"
}
```

```bash
terraform init
terraform plan
terraform apply
```

## `terraform plan` in Depth

`terraform plan` compares three sources to produce its diff:

1. **Configuration** — what your `.tf` files declare
2. **State file** — what Terraform last deployed (`.tfstate`)
3. **Live infrastructure** — the actual current state in Azure (via a refresh)

## `terraform plan` Commands

```bash
terraform plan                       # print to console
terraform plan -out=tfplan           # save for later apply
terraform apply tfplan               # apply the saved plan exactly, no re-prompt
terraform plan -target=azurerm_storage_account.main   # scope to one resource
```

## Plan vs What-If

| | `terraform plan` | `az deployment ... --what-if` |
|---|---|---|
| **Diff source** | State file + live refresh | Azure Resource Manager |
| **Accuracy** | High — based on provider knowledge | Moderate — known noisy diffs |
| **Ordering** | Shows dependency order | No ordering |
| **Saveable** | Yes (`-out=tfplan`) | No |
| **Apply from saved plan** | Yes (`terraform apply tfplan`) | No |

## Azure Providers

There are two Terraform providers for Azure:

| Provider | Maintained by | Day-0 | Field names |
|---|---|---|---|
| `azurerm` | HashiCorp | No — lag possible | Custom HCL-friendly names |
| `azapi` | Microsoft | Yes — same API as ARM/Bicep | Mirror ARM/Bicep API names |

See the [azapi module](../azapi/) for details on using both together.

## Links

[Terraform Registry](https://registry.terraform.io){: .btn .btn-blue }
[Terraform Docs](https://developer.hashicorp.com/terraform/docs){: .btn .btn-blue }
[Azure Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs){: .btn .btn-blue }

</div>

---

{% capture tf_lab_task %}
Your team needs one storage account **per environment** instead of a single hardcoded one. Convert the resource block below to loop over `var.environments` with `for_each`, name each account `st${each.key}`, and use `each.value` as its location.
{% endcapture %}

{% capture tf_lab_starter %}variable "environments" {
  type = map(string)
  default = {
    dev     = "westeurope"
    staging = "westeurope"
    prod    = "northeurope"
  }
}

resource "azurerm_storage_account" "main" {
  name                     = "stmyapp"
  resource_group_name      = var.resource_group_name
  location                 = "westeurope"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}{% endcapture %}

{% capture tf_lab_solution %}variable "environments" {
  type = map(string)
  default = {
    dev     = "westeurope"
    staging = "westeurope"
    prod    = "northeurope"
  }
}

resource "azurerm_storage_account" "main" {
  for_each                 = var.environments
  name                     = "st${each.key}"
  resource_group_name      = var.resource_group_name
  location                 = each.value
  account_tier             = "Standard"
  account_replication_type = "LRS"
}{% endcapture %}

{% include lab.html id="tf-lab" title="One Resource, Many Environments" lang="hcl" task=tf_lab_task starter=tf_lab_starter solution=tf_lab_solution checks='[{"test":"for_each","type":"contains","message":"the resource has a for_each argument"},{"test":"each.key","type":"contains","message":"the name uses each.key"},{"test":"each.value","type":"contains","message":"the location uses each.value"},{"test":"\"stmyapp\"","type":"not_contains","message":"the old hardcoded name is gone"}]' %}

{% include quiz.html id="tf-quiz" title="Terraform" questions='[{"q":"What three sources does terraform plan compare to produce its diff?","choices":["Only the .tf files","Configuration, the state file, and a live refresh of the actual infrastructure","Just the state file","Configuration and a manually maintained changelog"],"correct":1,"explain":"Terraform reconciles what you declared, what it last deployed, and what actually exists right now."},{"q":"Why does a Terraform team typically need a remote state backend, like Azure Blob Storage?","choices":["Terraform cannot run without internet access at all","So multiple team members and CI runs can safely share and lock the same state","Local state files are against HashiCorp’s license","Azure requires it for billing purposes"],"correct":1,"explain":"A shared, locked remote backend prevents two people (or two pipeline runs) from applying against stale state at the same time."},{"q":"Compared to what-if, why is terraform plan often considered more accurate?","choices":["It is not — they behave identically","It combines state, a live refresh, and provider-level knowledge of resource dependencies","It skips validation entirely, so it never reports errors","It only ever previews resource additions, never deletions"],"correct":1,"explain":"Terraform’s plan has more context (state + dependency graph) to work with than a stateless ARM what-if call."},{"q":"What is the main reason Terraform can lag behind brand-new Azure features?","choices":["Terraform fundamentally cannot support new resource types","The azurerm provider needs to be updated by its maintainers before new fields are exposed","Azure actively blocks Terraform from calling new APIs","HCL syntax cannot express new resource types"],"correct":1,"explain":"azurerm is a community/HashiCorp-maintained abstraction over the ARM API — someone has to add support for each new feature, which is exactly the gap azapi closes."}]' %}

## Next Up

[OpenTofu](../opentofu/) is the open-source fork born from Terraform's 2023 license change.
