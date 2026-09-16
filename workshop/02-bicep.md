---
title: "2 · Bicep"
layout: post
parent: Workshop
nav_order: 3
permalink: /workshop/bicep/
redirect_from:
  - /bicep/
  - /bicep/what-if/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## What Is Bicep?

Bicep is the native IaC solution for Azure. The default used to be ARM Templates, but Bicep solved a lot of their usability problems. It's a **domain-specific language (DSL)** developed and maintained by Microsoft. A Bicep file is transparently compiled ("transpiled") into an ARM Template before deployment — there is no Bicep runtime and no new concepts introduced in Azure itself. This means Bicep has **full, day-0 coverage** of every Azure resource type, and every limitation of ARM still applies underneath.

## Pros

* Natively supported by Azure — same API surface as ARM, available immediately when new features ship
* Much more concise than ARM JSON — a 150-line ARM template often becomes ~30 lines of Bicep
* Strong typing with excellent VS Code IntelliSense via the Bicep extension
* Easier to read than raw JSON, with an HCL-adjacent syntax
* Provides a registry solution for centralised, reusable modules (local, ACR, or public registry)
* Native `for` loops and `if` conditions — no `copy` workarounds needed
* Decompile existing ARM JSON to Bicep with `az bicep decompile`

## Cons

* What-If is not that great — preview output can be verbose and occasionally inaccurate
* Limited by ARM template language — if ARM can't do it, Bicep can't either
* Azure only — not useful for managing AWS, GCP, or on-premises resources
* Newer ecosystem — fewer community modules compared to the Terraform Registry (growing fast)

## Quick Example

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

output primaryBlobEndpoint string = storageAccount.properties.primaryEndpoints.blob
```

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file storage.bicep \
  --parameters storageAccountName=mystorageaccount123
```

## What-If: Previewing Changes

`what-if` is Bicep's (and ARM's) mechanism for previewing changes before a deployment is applied — similar in concept to `terraform plan`.

```bash
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters @main.bicepparam
```

## What-If: Reading the Output

| Symbol | Meaning |
|--------|---------|
| `+` | Resource will be **created** |
| `~` | Resource will be **modified** |
| `-` | Resource will be **deleted** |
| `×` | Resource will be **replaced** (delete + create) |
| `=` | No change |
| `?` | Unsure / noisy diff |

## What-If: Known Gaps

Noisy diffs (properties shown as modified when they haven't changed, due to API defaults being written back), limited awareness of nested/linked deployments, and no guaranteed ordering in the output. This is why many teams consider `terraform plan` the stronger preview experience — Microsoft keeps improving What-If with each ARM API version.

## Installing the Bicep CLI

```bash
# Via Azure CLI (recommended)
az bicep install && az bicep upgrade

# macOS
brew install bicep

# Windows
winget install -e --id Microsoft.Bicep
```

## Links

[Bicep Docs](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/){: .btn .btn-blue }
[Bicep on GitHub](https://github.com/Azure/bicep){: .btn .btn-blue }
[Bicep Public Registry](https://github.com/Azure/bicep-registry-modules){: .btn .btn-blue }
[Bicep Playground](https://aka.ms/bicepdemo){: .btn .btn-outline }

</div>

---

{% capture bicep_lab_task %}
Here's the ARM JSON resource block from the previous module:

```json
{
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2023-01-01",
  "name": "[parameters('storageAccountName')]",
  "sku": { "name": "Standard_LRS" },
  "kind": "StorageV2",
  "properties": {
    "minimumTlsVersion": "TLS1_2",
    "allowBlobPublicAccess": false,
    "supportsHttpsTrafficOnly": true
  }
}
```

Finish converting it to the Bicep `resource` block below — fill in `kind` and the three `properties`.
{% endcapture %}

{% capture bicep_lab_starter %}param storageAccountName string
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  // TODO: add kind, and a properties block with
  // minimumTlsVersion, allowBlobPublicAccess, supportsHttpsTrafficOnly
}{% endcapture %}

{% capture bicep_lab_solution %}param storageAccountName string
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
}{% endcapture %}

{% include lab.html id="bicep-lab" title="ARM to Bicep" lang="bicep" task=bicep_lab_task starter=bicep_lab_starter solution=bicep_lab_solution checks='[{"test":"StorageV2","type":"contains","message":"kind is set to StorageV2"},{"test":"minimumTlsVersion","type":"contains","message":"properties includes minimumTlsVersion"},{"test":"allowBlobPublicAccess","type":"contains","message":"properties includes allowBlobPublicAccess"},{"test":"supportsHttpsTrafficOnly","type":"contains","message":"properties includes supportsHttpsTrafficOnly"}]' %}

{% include quiz.html id="bicep-quiz" title="Bicep" questions='[{"q":"A .bicep file is deployed by...","choices":["A separate Bicep runtime built into Azure","Transpiling to an ARM template first, then submitting that to Azure Resource Manager","Uploading the raw .bicep file directly to Azure","Converting it to Terraform HCL first"],"correct":1,"explain":"There is no Bicep runtime in Azure — the CLI compiles .bicep to ARM JSON and Resource Manager only ever sees ARM."},{"q":"Which of these is a real limitation of Bicep’s what-if preview covered in this module?","choices":["It cannot preview deletions at all","It can show noisy diffs where properties appear modified even though nothing changed","It only works with a Terraform state file","It requires a paid Azure subscription tier"],"correct":1,"explain":"Noisy diffs (API defaults being echoed back as changes) are a known what-if gap — one reason many teams prefer terraform plan."},{"q":"How do you share a reusable Bicep module across teams?","choices":["Bicep has no concept of modules","Via the Bicep registry (local, ACR, or the public registry)","Only by copy-pasting the file into every project","By compiling it into a Terraform provider"],"correct":1,"explain":"Bicep modules can be published to and consumed from a registry, similar in spirit to the Terraform Registry."},{"q":"What fundamentally limits what Bicep can express?","choices":["Its own custom API, separate from ARM","Whatever the underlying ARM template language can express","The Terraform Registry’s module catalog","The azurerm provider’s release cadence"],"correct":1,"explain":"Bicep compiles straight to ARM JSON, so anything ARM cannot do, Bicep cannot do either."}]' %}

## Next Up

[Terraform](../terraform/) trades Bicep's Azure-native simplicity for multi-cloud reach and a real state file.
