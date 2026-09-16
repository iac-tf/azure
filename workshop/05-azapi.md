---
title: "5 · azapi Provider"
layout: post
parent: Workshop
nav_order: 6
permalink: /workshop/azapi/
redirect_from:
  - /terraform/azapi/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## Why azapi?

The **`azapi` provider** is a thin Terraform provider maintained by Microsoft that calls the Azure Resource Manager REST API directly — giving it the same day-0 coverage as ARM Templates and Bicep.

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

```hcl
resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    sku  = { name = "Standard_LRS" }
    kind = "StorageV2"
    properties = {
      minimumTlsVersion        = "TLS1_2"
      allowBlobPublicAccess    = false
      supportsHttpsTrafficOnly = true
    }
  }
}
```

Notice how the field names (`minimumTlsVersion`, `allowBlobPublicAccess`, `supportsHttpsTrafficOnly`) match the ARM/Bicep API exactly — the same names you'd use in a `.bicep` file.

## Using azapi Alongside azurerm

The recommended pattern:

* Use **`azurerm`** for stable, well-supported resources where its abstractions save time.
* Use **`azapi`** for new/preview features not yet in `azurerm`, or when you need exact API control.
* Use **`azapi_update_resource`** to set properties on an `azurerm`-managed resource that `azurerm` doesn't expose yet.

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

</div>

---

{% capture azapi_lab_task %}
Translate this Bicep block into the azapi `body` below — same field names, HCL syntax (`=` instead of `:`, double-quoted strings):

```bicep
sku: { name: 'Standard_GRS' }
kind: 'StorageV2'
properties: {
  minimumTlsVersion: 'TLS1_2'
  allowBlobPublicAccess: false
}
```
{% endcapture %}

{% capture azapi_lab_starter %}resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    # TODO: translate the Bicep block from the task into this body
  }
}{% endcapture %}

{% capture azapi_lab_solution %}resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    sku  = { name = "Standard_GRS" }
    kind = "StorageV2"
    properties = {
      minimumTlsVersion     = "TLS1_2"
      allowBlobPublicAccess = false
    }
  }
}{% endcapture %}

{% include lab.html id="azapi-lab" title="Bicep to azapi" lang="hcl" task=azapi_lab_task starter=azapi_lab_starter solution=azapi_lab_solution checks='[{"test":"Standard_GRS","type":"contains","message":"sku name is Standard_GRS"},{"test":"StorageV2","type":"contains","message":"kind is StorageV2"},{"test":"minimumTlsVersion","type":"contains","message":"properties includes minimumTlsVersion"},{"test":"allowBlobPublicAccess","type":"contains","message":"properties includes allowBlobPublicAccess"}]' %}

{% include quiz.html id="azapi-quiz" title="azapi Provider" questions='[{"q":"Who maintains the azapi Terraform provider?","choices":["HashiCorp","Microsoft","The OpenTofu project","An unaffiliated community group"],"correct":1,"explain":"Microsoft maintains azapi specifically to give Terraform users the same day-0 coverage as ARM and Bicep."},{"q":"Why does azapi have the same day-0 coverage as ARM and Bicep?","choices":["It does not — it lags just like azurerm","It calls the Azure Resource Manager REST API directly instead of wrapping it in custom abstractions","It only supports preview/beta features","It requires a separate Azure subscription tier"],"correct":1,"explain":"azapi passes your body straight to the ARM REST API, skipping the abstraction layer that causes azurerm’s lag."},{"q":"How do azapi’s body field names compare to Bicep’s property names?","choices":["Completely different, unrelated naming schemes","They mirror each other almost exactly (e.g. minimumTlsVersion in both)","azapi renames everything to snake_case","azapi has no named fields, only positional arguments"],"correct":1,"explain":"Because both pass data straight through to the same ARM API, the field names line up almost one-to-one."},{"q":"What is the recommended pattern for using azapi and azurerm together?","choices":["Never mix them in the same project","Use azurerm for stable resources, azapi for new/preview features or exact API control, and azapi_update_resource to patch fields azurerm does not expose yet","Only ever use azapi — azurerm is deprecated","Only ever use azurerm — azapi is unsafe for production"],"correct":1,"explain":"They are designed to coexist: azurerm for convenience on mature resources, azapi to fill the gaps."}]' %}

## Next Up

[Module 6](../comparison/) puts ARM, Bicep, and both Terraform providers side by side.
