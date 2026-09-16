---
title: "1 · ARM Templates"
layout: post
parent: Workshop
nav_order: 2
permalink: /workshop/arm-templates/
redirect_from:
  - /arm/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## What Are ARM Templates?

ARM (Azure Resource Manager) Templates are the **native JSON-based IaC format** for Azure. Every Bicep file, every Terraform `azurerm` resource, and every portal deployment ultimately compiles down to an ARM Template before Azure processes it.

ARM Templates are JSON files that declare the resources you want to deploy, their properties, and the dependencies between them. They are submitted directly to the Azure Resource Manager API — the same API the Azure portal uses.

Key characteristics:

* **Declarative** — describe *what* you want, not *how* to create it
* **Idempotent** — running the same template multiple times produces the same result
* **Azure-native** — full coverage of every Azure resource type and API version on day 0
* **No state file** — Azure tracks the state of your resources
* **Deployment modes** — `Incremental` (add/update only) or `Complete` (remove resources not in template)

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
      "maxLength": 24
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
  ]
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

</div>

---

{% capture arm_lab_task %}
This ARM resource block is missing two of the hardening properties shown in the example above. Add a `"kind"` of `StorageV2`, and set `minimumTlsVersion` to `TLS1_2` inside `properties`.
{% endcapture %}

{% capture arm_lab_starter %}{
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2023-01-01",
  "name": "[parameters('storageAccountName')]",
  "location": "[parameters('location')]",
  "sku": { "name": "Standard_LRS" },
  "properties": {
    "accessTier": "Hot"
  }
}{% endcapture %}

{% capture arm_lab_solution %}{
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2023-01-01",
  "name": "[parameters('storageAccountName')]",
  "location": "[parameters('location')]",
  "sku": { "name": "Standard_LRS" },
  "kind": "StorageV2",
  "properties": {
    "accessTier": "Hot",
    "minimumTlsVersion": "TLS1_2"
  }
}{% endcapture %}

{% include lab.html id="arm-lab" title="Complete the Storage Account" lang="json" task=arm_lab_task starter=arm_lab_starter solution=arm_lab_solution checks='[{"test":"\"kind\"","type":"contains","message":"a top-level \"kind\" property is present"},{"test":"StorageV2","type":"contains","message":"kind is set to StorageV2"},{"test":"minimumTlsVersion","type":"contains","message":"properties includes minimumTlsVersion"},{"test":"TLS1_2","type":"contains","message":"minimumTlsVersion is set to TLS1_2"}]' %}

{% include quiz.html id="arm-quiz" title="ARM Templates" questions='[{"q":"What happens to resources that exist in Azure but are NOT listed in your ARM template when you deploy in Complete mode?","choices":["Nothing changes","They get deleted","They get paused","The deployment is refused"],"correct":1,"explain":"Complete mode treats the template as the full desired state for the scope — anything not listed is removed. Incremental mode (the default) only adds/updates."},{"q":"ARM JSON has no native for-loop syntax. How do you iterate to create multiple similar resources?","choices":["A copy element on a resource or property","A for_each block","List comprehension inside the JSON","You cannot iterate in ARM"],"correct":0,"explain":"The copy element is ARM’s (verbose) answer to loops — one of the reasons Bicep’s native for expression is popular."},{"q":"Which statement about ARM and state is correct?","choices":["ARM keeps a local .tfstate-style file you must manage","Azure Resource Manager itself tracks state — no separate state file exists","State is stored inside the resource group being deployed to","ARM deployments are stateless in every sense"],"correct":1,"explain":"Unlike Terraform, neither ARM nor Bicep maintain their own state file — Azure Resource Manager is the source of truth."},{"q":"You have an existing ARM JSON template and want a Bicep starting point. What command helps?","choices":["az bicep decompile","az bicep compile","terraform import","bicep convert"],"correct":0,"explain":"az bicep decompile --file storage.json turns existing ARM JSON into a first-draft .bicep file."}]' %}

## Next Up

[Bicep](../bicep/) fixes ARM's biggest usability complaints while staying on exactly the same underlying API.
