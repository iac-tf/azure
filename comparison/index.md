---
title: Comparison
layout: post
nav_order: 4
#has_children: true
---

## Feature Matrix

|                        | ARM Templates              | Bicep                        | Terraform (`azurerm`)         | Terraform (`azapi`)           |
|:-----------------------|:---------------------------|:-----------------------------|:------------------------------|:------------------------------|
| **Language**           | JSON                       | Bicep DSL                    | HCL                           | HCL                           |
| **Maintained by**      | Microsoft                  | Microsoft                    | HashiCorp / OpenTofu          | Microsoft                     |
| **License**            | Free                       | Free / MIT                   | BSL (Terraform) / MPL (OpenTofu) | MPL 2.0                    |
| **Azure-native**       | Yes                        | Yes                          | Yes (via `azurerm` provider)  | Yes (via `azapi` provider)    |
| **Multi-cloud**        | No                         | No                           | Yes                           | Azure only                    |
| **State file**         | No                         | No                           | Yes                           | Yes                           |
| **Day-0 coverage**     | Full                       | Full                         | Provider lag possible         | Full — mirrors ARM/Bicep API  |
| **Field names**        | ARM API names              | ARM API names                | Custom HCL-friendly names     | ARM API names (Bicep-aligned) |
| **Plan preview**       | `--what-if`                | `--what-if`                  | `terraform plan`              | `terraform plan`              |
| **Loops**              | `copy` element             | `for` expression             | `for_each` / `count`          | `for_each` / `count`          |
| **Conditions**         | `condition` element        | `if` expression              | `count = cond ? 1 : 0`        | `count = cond ? 1 : 0`        |
| **Modules / reuse**    | Linked templates           | Modules + Registry           | Modules + Registry            | Modules + Registry            |
| **IDE support**        | Good                       | Excellent                    | Excellent                     | Good                          |
| **Learning curve**     | Steep                      | Moderate                     | Moderate                      | Low for Bicep users           |
| **Community**          | Large                      | Medium (growing)             | Very large                    | Small (growing)               |

## Plans vs What-If

Both `terraform plan` and `--what-if` preview changes before applying, but they work differently:

| | `terraform plan` | `az deployment ... --what-if` |
|---|---|---|
| **Diff source** | State file + live refresh | Azure Resource Manager |
| **Accuracy** | High | Moderate — known noisy diffs |
| **Saveable output** | Yes (`-out=tfplan`) | No |
| **Apply from saved plan** | Yes (`terraform apply tfplan`) | No |
| **Cross-resource impacts** | Shown via dependency graph | Not shown |

See also: [Bicep What-If](../bicep/what-if) · [Terraform Plan](../terraform/plan)

## Same Resource, Three Languages

Deploy a Storage Account (Standard LRS, StorageV2) in each tool:

### ARM Template (~25 lines)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": { "type": "string" },
    "location": { "type": "string", "defaultValue": "[resourceGroup().location]" }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": { "name": "Standard_LRS" },
      "kind": "StorageV2",
      "properties": {
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": false,
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

```bash
az deployment group create --resource-group my-rg \
  --template-file storage.json --parameters storageAccountName=myaccount
```

### Bicep (~13 lines)

```bicep
param storageAccountName string
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}
```

```bash
az deployment group create --resource-group my-rg \
  --template-file storage.bicep --parameters storageAccountName=myaccount
```

### Terraform / azurerm (~17 lines)

```hcl
variable "storage_account_name" { type = string }
variable "resource_group_name"  { type = string }
variable "location"             { type = string; default = "westeurope" }

resource "azurerm_storage_account" "main" {
  name                            = var.storage_account_name
  resource_group_name             = var.resource_group_name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  account_kind                    = "StorageV2"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  https_traffic_only_enabled      = true
}
```

```bash
terraform init && terraform apply -var="storage_account_name=myaccount"
```

### Terraform / azapi (~18 lines)

```hcl
variable "storage_account_name" { type = string }
variable "resource_group_id"    { type = string }
variable "location"             { type = string; default = "westeurope" }

resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    sku        = { name = "Standard_LRS" }
    kind       = "StorageV2"
    properties = {
      minimumTlsVersion        = "TLS1_2"
      allowBlobPublicAccess    = false
      supportsHttpsTrafficOnly = true
    }
  }
}
```

```bash
terraform init && terraform apply -var="storage_account_name=myaccount"
```

Field names mirror the Bicep/ARM API exactly — `minimumTlsVersion` instead of `min_tls_version`, `allowBlobPublicAccess` instead of `allow_nested_items_to_be_public`. See the [azapi page](../terraform/azapi) for more details.

## Multiple files visibility
W.I.P.

## Supported resources/providers
### Support for new resources
New Azure features appear in ARM and Bicep on day 0 — the moment Microsoft ships the feature, the ARM API supports it. Terraform's `azurerm` provider typically follows within days to weeks, depending on provider maintainer availability. The **`azapi` provider** (maintained by Microsoft) closes this gap entirely by calling the ARM REST API directly, providing the same day-0 coverage as ARM and Bicep — at the cost of higher verbosity and less abstraction. See the [azapi page](../terraform/azapi).

### Support for many providers
Only Terraform / OpenTofu supports managing resources outside of Azure in the same workflow. Popular non-Azure providers include `aws`, `google`, `kubernetes`, `helm`, `vault`, `datadog`, and hundreds more.
