---
title: ARM Templates
layout: post
nav_order: 5
has_children: false
---

ARM (Azure Resource Manager) Templates are the **native JSON-based IaC format** for Azure. Every Bicep file, every Terraform `azurerm` resource, and every portal deployment ultimately compiles down to an ARM Template before Azure processes it.

## What Are ARM Templates?

ARM Templates are JSON files that declare the resources you want to deploy, their properties, and the dependencies between them. They are submitted directly to the Azure Resource Manager API — the same API the Azure portal uses.

Key characteristics:

- **Declarative** — describe *what* you want, not *how* to create it
- **Idempotent** — running the same template multiple times produces the same result
- **Azure-native** — full coverage of every Azure resource type and API version on day 0
- **No state file** — Azure tracks the state of your resources
- **Deployment modes** — `Incremental` (add/update only) or `Complete` (remove resources not in template)

## Pros
* Full Azure API coverage — every new Azure feature is available in ARM the day it launches
* No abstraction layer — what you write is what Azure receives; no transpilation surprises
* Built-in expression functions — `[concat()]`, `[resourceId()]`, `[reference()]`, etc.
* Linked/nested templates — compose large deployments from smaller, reusable templates
* What-if deployments — preview changes before applying
* Multiple deployment scopes — resource group, subscription, management group, or tenant

## Cons
* Verbose JSON — simple resources require many lines of boilerplate
* Steep learning curve — JSON expressions like `[parameters('name')]` are easy to mistype
* No clean loops — iteration requires the `copy` element rather than a natural loop syntax
* Limited modularity — linked templates require accessible URLs; no local module resolution
* Largely superseded by Bicep — for new Azure-only projects, Bicep is the recommended path

## File Structure

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": { },
  "variables": { },
  "resources": [ ],
  "outputs": { }
}
```

## Example: Deploy a Storage Account

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24,
      "metadata": { "description": "Globally unique name for the storage account." }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
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
        "accessTier": "Hot",
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": false,
        "supportsHttpsTrafficOnly": true
      }
    }
  ],
  "outputs": {
    "storageAccountId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    }
  }
}
```

```bash
# Deploy
az deployment group create \
  --resource-group my-rg \
  --template-file storage.json \
  --parameters storageAccountName=mystorageaccount123

# Preview changes first
az deployment group what-if \
  --resource-group my-rg \
  --template-file storage.json \
  --parameters storageAccountName=mystorageaccount123
```

## Migrating to Bicep

ARM is largely superseded by Bicep for human-authored templates. You can decompile any ARM JSON file to Bicep as a starting point:

```bash
az bicep decompile --file storage.json
# Produces: storage.bicep
```

## Links
[ARM Template Docs](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/){: .btn .btn-blue }
[ARM Template Functions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions){: .btn .btn-blue }
[Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates){: .btn .btn-outline }
