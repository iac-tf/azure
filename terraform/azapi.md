---
title: azapi Provider
layout: post
parent: Terraform
nav_order: 2
---

The **`azapi` provider** is a thin Terraform provider maintained by Microsoft that calls the Azure Resource Manager REST API directly — giving it the same day-0 coverage as ARM Templates and Bicep.

## Why azapi?

The `azurerm` provider (by HashiCorp) wraps the Azure API behind its own HCL-friendly field names and abstractions. That abstraction is convenient but introduces a lag: a new Azure feature has to be implemented in the provider before you can use it in Terraform. `azapi` skips that layer entirely.

| | `azurerm` | `azapi` |
|---|---|---|
| **Maintained by** | HashiCorp | Microsoft |
| **Day-0 coverage** | No — provider lag possible | Yes — same API as ARM/Bicep |
| **Field names** | Custom HCL-friendly names | Mirror ARM/Bicep API names |
| **Abstraction level** | High — opinionated resource blocks | Low — `body` is raw JSON/YAML |
| **Maturity** | Very mature | Generally Available (GA) |
| **Best for** | Stable, well-supported resources | New/preview services, Azure-native teams |

## How It Works

`azapi` has three core resource types:

* **`azapi_resource`** — create, update, and delete any Azure resource via the ARM REST API.
* **`azapi_update_resource`** — patch properties of an existing resource (even one managed by `azurerm`).
* **`azapi_resource_action`** — invoke arbitrary ARM actions (e.g. `listKeys`, `restart`).

Because the body is passed as structured data (HCL object → JSON), it mirrors Bicep's `properties` block almost exactly, making Bicep docs directly applicable.

## Quick Example

Deploy the same Standard LRS StorageV2 storage account using `azapi`:

```hcl
terraform {
  required_providers {
    azapi = {
      source  = "azure/azapi"
      version = "~> 2.0"
    }
  }
}

provider "azapi" {}

resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    sku = { name = "Standard_LRS" }
    kind = "StorageV2"
    properties = {
      minimumTlsVersion    = "TLS1_2"
      allowBlobPublicAccess = false
      supportsHttpsTrafficOnly = true
    }
  }
}
```

Notice how the field names (`minimumTlsVersion`, `allowBlobPublicAccess`, `supportsHttpsTrafficOnly`) match the ARM/Bicep API exactly — the same names you'd use in a `.bicep` file.

## Using azapi Alongside azurerm

`azapi` and `azurerm` are designed to coexist. The recommended pattern is:

* Use **`azurerm`** for stable, well-supported resources where its abstractions save time.
* Use **`azapi`** for new/preview features not yet in `azurerm`, or when you need exact API control.
* Use **`azapi_update_resource`** to set properties on an `azurerm`-managed resource that the `azurerm` provider doesn't expose yet.

```hcl
# Core resource via azurerm
resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Patch a property azurerm doesn't expose yet
resource "azapi_update_resource" "dns_endpoint_type" {
  type        = "Microsoft.Storage/storageAccounts@2023-01-01"
  resource_id = azurerm_storage_account.main.id

  body = {
    properties = {
      dnsEndpointType = "AzureDnsZone"
    }
  }
}
```

## Bicep Alignment

Because `azapi` uses ARM API field names rather than custom HCL names, porting between Bicep and `azapi` is straightforward:

| Bicep | azapi `body` |
|---|---|
| `sku: { name: 'Standard_LRS' }` | `sku = { name = "Standard_LRS" }` |
| `properties: { minimumTlsVersion: 'TLS1_2' }` | `properties = { minimumTlsVersion = "TLS1_2" }` |
| `kind: 'StorageV2'` | `kind = "StorageV2"` |

The main difference is syntax (Bicep's `:` vs HCL's `=`) — the structure and names are identical.

## Cons

* **Verbosity for common resources** — `azurerm` provides much shorter, more readable blocks for well-supported resources.
* **No provider-level validations** — `azurerm` catches many mistakes at plan time; `azapi` passes the body straight to ARM, so errors surface at apply time.
* **Less community content** — fewer examples, blog posts, and Stack Overflow answers compared to `azurerm`.

## Links

[azapi Provider Docs](https://registry.terraform.io/providers/Azure/azapi/latest/docs){: .btn .btn-blue }
[azapi GitHub](https://github.com/Azure/terraform-provider-azapi){: .btn .btn-blue }
[Azure/azapi — Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/terraform/overview-azapi-provider){: .btn .btn-blue }
