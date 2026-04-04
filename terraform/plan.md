---
title: Plan
layout: post
parent: Terraform
---

`terraform plan` is one of Terraform's most valuable features — it shows you **exactly what will change** before anything is applied. This is the key workflow difference from Bicep/ARM's `--what-if`.

## How It Works

Terraform compares three sources to produce a plan:

1. **Configuration** — what your `.tf` files declare
2. **State file** — what Terraform last deployed (`.tfstate`)
3. **Live infrastructure** — the actual current state in Azure (via a refresh)

The diff between these produces the plan output.

## Running a Plan

```bash
# Basic plan (prints to console)
terraform plan

# Save the plan to a file for later apply
terraform plan -out=tfplan

# Apply the saved plan exactly (no re-prompting)
terraform apply tfplan

# Plan with variable overrides
terraform plan -var="location=westeurope" -var-file="prod.tfvars"
```

## Reading Plan Output

```
Terraform will perform the following actions:

  # azurerm_storage_account.main will be created
  + resource "azurerm_storage_account" "main" {
      + account_kind             = "StorageV2"
      + account_replication_type = "LRS"
      + account_tier             = "Standard"
      + location                 = "westeurope"
      + min_tls_version          = "TLS1_2"
      + name                     = "mystorageaccount123"
      + resource_group_name      = "my-rg"
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

| Symbol | Meaning |
|--------|---------|
| `+` | Resource will be **created** |
| `~` | Resource will be **modified in-place** |
| `-` | Resource will be **destroyed** |
| `-/+` | Resource will be **replaced** (destroy + create) |

## Plan vs What-If (Bicep/ARM)

| | `terraform plan` | `az deployment ... --what-if` |
|---|---|---|
| **Diff source** | State file + live refresh | Azure Resource Manager |
| **Accuracy** | High — based on provider knowledge | Moderate — known noisy diffs |
| **Ordering** | Shows dependency order | No ordering |
| **Saveable** | Yes (`-out=tfplan`) | No |
| **Apply from saved plan** | Yes (`terraform apply tfplan`) | No |
| **Cross-resource impacts** | Shown via dependencies | Not shown |

## Targeted Plans

Plan (or apply) only specific resources:

```bash
terraform plan -target=azurerm_storage_account.main
```

Useful for large configurations when you only want to change one resource.

## Links
[Terraform Plan Docs](https://developer.hashicorp.com/terraform/cli/commands/plan){: .btn .btn-blue }
  