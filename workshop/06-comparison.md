---
title: "6 · Comparison"
layout: post
parent: Workshop
nav_order: 7
permalink: /workshop/comparison/
redirect_from:
  - /comparison/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

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
| **Loops**               | `copy` element             | `for` expression             | `for_each` / `count`          | `for_each` / `count`          |
| **Conditions**         | `condition` element        | `if` expression              | `count = cond ? 1 : 0`        | `count = cond ? 1 : 0`        |
| **Modules / reuse**    | Linked templates           | Modules + Registry           | Modules + Registry            | Modules + Registry            |
| **IDE support**        | Good                       | Excellent                    | Excellent                     | Good                          |
| **Learning curve**     | Steep                      | Moderate                     | Moderate                      | Low for Bicep users           |
| **Community**          | Large                      | Medium (growing)             | Very large                    | Small (growing)               |

## Plan vs What-If

Both `terraform plan` and `--what-if` preview changes before applying, but they work differently:

| | `terraform plan` | `az deployment ... --what-if` |
|---|---|---|
| **Diff source** | State file + live refresh | Azure Resource Manager |
| **Accuracy** | High | Moderate — known noisy diffs |
| **Saveable output** | Yes (`-out=tfplan`) | No |
| **Apply from saved plan** | Yes (`terraform apply tfplan`) | No |
| **Cross-resource impacts** | Shown via dependency graph | Not shown |

See also: [Bicep](../bicep/) · [Terraform](../terraform/)

## Same Resource, Four Ways

Deploy a Storage Account (Standard LRS, StorageV2) in each tool:

### ARM Template (~20 lines)

```json
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
```

### Bicep (~10 lines)

```bicep
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

### Terraform / azurerm (~9 lines)

```hcl
resource "azurerm_storage_account" "main" {
  name                             = var.storage_account_name
  resource_group_name              = var.resource_group_name
  location                         = var.location
  account_tier                     = "Standard"
  account_replication_type         = "LRS"
  account_kind                     = "StorageV2"
  min_tls_version                  = "TLS1_2"
  allow_nested_items_to_be_public  = false
  https_traffic_only_enabled       = true
}
```

### Terraform / azapi (~12 lines)

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

Field names mirror the Bicep/ARM API exactly in ARM, Bicep, and azapi — `minimumTlsVersion` instead of `min_tls_version`, `allowBlobPublicAccess` instead of `allow_nested_items_to_be_public`. Only `azurerm` renames fields to its own convention. See the [azapi module](../azapi/) for more.

## Support for New Resources vs Many Providers

**New resources:** new Azure features appear in ARM and Bicep on day 0 — the moment Microsoft ships a feature, the ARM API supports it. Terraform's `azurerm` provider typically follows within days to weeks, depending on maintainer availability. The `azapi` provider (maintained by Microsoft) closes this gap entirely by calling the ARM REST API directly.

**Many providers:** only Terraform / OpenTofu supports managing resources outside of Azure in the same workflow. Popular non-Azure providers include `aws`, `google`, `kubernetes`, `helm`, `vault`, `datadog`, and hundreds more.

</div>

---

There's no lab for this module — it's a synthesis of the previous five, not a new tool with its own syntax to practice. The quiz below pulls from the comparison table instead.

{% include quiz.html id="comparison-quiz" title="Comparison" questions='[{"q":"Which of these tools has NO state file at all — Azure itself tracks the deployed state?","choices":["Terraform (azurerm)","Terraform (azapi)","ARM Templates and Bicep","All four maintain a state file"],"correct":2,"explain":"ARM and Bicep both submit directly to Azure Resource Manager, which is the source of truth — no separate state file exists for either."},{"q":"Which is the only option in this workshop with true multi-cloud support?","choices":["ARM Templates","Bicep","Terraform / OpenTofu","azapi"],"correct":2,"explain":"Terraform and OpenTofu can manage AWS, GCP, Kubernetes, and hundreds of other providers in the same workflow; the rest are Azure-only."},{"q":"Which provider’s field names mirror the ARM/Bicep API rather than using custom HCL-friendly names?","choices":["azurerm","azapi","Both equally","Neither — both use fully custom names"],"correct":1,"explain":"azapi passes the body straight to the ARM API, so its field names match Bicep’s almost exactly; azurerm renames fields to its own convention."},{"q":"For day-0 coverage of a brand-new Azure feature, which of these options are safe bets?","choices":["Only azurerm","ARM, Bicep, and azapi","Only OpenTofu","None of the four options"],"correct":1,"explain":"ARM, Bicep, and azapi all talk to the same ARM API directly, so they get new features the moment Azure ships them; azurerm needs a provider update first."}]' %}

## Next Up

The [Capstone](../capstone/) puts all four side by side on one task, with a final mixed quiz.
