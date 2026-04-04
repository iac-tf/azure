---
title: Terraform
layout: post
nav_order: 3
has_children: true
---

Terraform is one of the most popular IaC tools.
The main power comes from the multi-provider support — one workflow for Azure, AWS, GCP, Kubernetes, and hundreds more providers.

## What Is Terraform?

Terraform (by HashiCorp) uses **HashiCorp Configuration Language (HCL)** to provision infrastructure declaratively. Unlike ARM and Bicep, Terraform maintains a **state file** that records what it has deployed, enabling it to calculate a precise diff and show you exactly what will change before applying.

**OpenTofu** is a community-driven, fully open-source fork of Terraform created in 2023 after HashiCorp relicensed Terraform from MPL to BSL. See the [OpenTofu page](./opentofu) for details.

## Pros
* Multiple providers — manage Azure, AWS, GCP, and on-premises in one tool
* Great planning functionality — `terraform plan` shows an exact diff before any change is made
* HCL is one of the better notation methods without using a full programming language
* Module support — reusable modules from the Terraform Registry or your own registry
* Large ecosystem — thousands of community modules and providers
* Drift detection — `terraform plan` compares state vs live resources

## Cons
* State store — requires a shared remote backend (e.g. Azure Blob Storage) for team use; state locking is critical
* Importing when in brown-field — `terraform import` works but mapping existing resources to HCL is tedious
* Azure day-0 lag — new Azure features may take days or weeks to appear in the `azurerm` provider
* BSL license (Terraform ≥ 1.6) — HashiCorp's license restricts use in competing products (reason OpenTofu was forked)

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

## Links
[Terraform Registry](https://registry.terraform.io){: .btn .btn-blue }  
[Terraform Docs](https://developer.hashicorp.com/terraform/docs){: .btn .btn-blue }
[Azure Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs){: .btn .btn-blue }

