---
title: Bicep
layout: post
nav_order: 2
has_children: true
---

Bicep is the native IaC solution for Azure.  
The default used to be ARM templates but Bicep solved a couple of issues with ARM.
However in the end Bicep is compiled to ARM templates so every limitation of ARM still exists.

## What Is Bicep?

Bicep is a **domain-specific language (DSL)** developed and maintained by Microsoft. A Bicep file is transparently compiled ("transpiled") into an ARM Template before deployment — there is no Bicep runtime and no new concepts introduced in Azure itself. This means Bicep has **full, day-0 coverage** of every Azure resource type.

## Pros
* Natively supported by Azure — same API surface as ARM, available immediately when new features ship
* Much more concise than ARM JSON — a 150-line ARM template often becomes ~30 lines of Bicep
* Strong typing with excellent VS Code IntelliSense via the Bicep extension
* Based on HCL-inspired syntax — easier to read compared to raw JSON in ARM templates
* Provides a registry solution for centralised, reusable modules (local, ACR, or public registry)
* Native `for` loops and `if` conditions — no `copy` workarounds needed
* Decompile existing ARM JSON to Bicep with `az bicep decompile`

## Cons
* What-If is not that great — preview output can be verbose and occasionally inaccurate
* Limited by ARM template language — if ARM can't do it, Bicep can't either
* Azure only — not useful for managing AWS, GCP, or on-premises resources
* Newer ecosystem — fewer community modules compared to the Terraform Registry (growing fast)

## Quick Example

Deploy an Azure Storage Account:

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
