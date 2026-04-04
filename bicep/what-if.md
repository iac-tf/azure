---
title: What If
layout: post
parent: Bicep
---

`what-if` is Bicep's (and ARM's) mechanism for **previewing changes** before a deployment is applied. It shows which resources will be created, modified, or deleted — similar in concept to `terraform plan`.

## Running What-If

```bash
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters @main.bicepparam
```

## Output Symbols

| Symbol | Meaning |
|--------|---------|
| `+` | Resource will be **created** |
| `~` | Resource will be **modified** |
| `-` | Resource will be **deleted** |
| `×` | Resource will be **replaced** (delete + create) |
| `=` | No change |
| `?` | Unsure / noisy diff |

## Example Output

```
Resource and property changes are indicated with these symbols:
  + Create
  ~ Modify
  - Delete

The deployment will update the following scope:

Scope: /subscriptions/xxx/resourceGroups/my-rg

  + Microsoft.Storage/storageAccounts/mystorageaccount123 [2023-01-01]

      apiVersion:  "2023-01-01"
      id:          "/subscriptions/xxx/resourceGroups/my-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount123"
      kind:        "StorageV2"
      location:    "westeurope"
      name:        "mystorageaccount123"
      sku.name:    "Standard_LRS"
```

## Limitations

What-If is useful but has known gaps:

- **Noisy diffs** — some properties show as modified even when they haven't changed (API defaults being written back).
- **Limited scope awareness** — nested deployments and linked templates can produce incomplete results.
- **No ordering** — unlike `terraform plan`, the output doesn't always reflect deployment order or dependency resolution.
- **No resource graph diff** — doesn't show cross-resource dependency impacts.

These limitations are why many teams consider `terraform plan` the stronger preview experience. Microsoft continues to improve What-If with each ARM API version.

## Confirming Before Apply

Add `--confirm-with-what-if` to get an interactive prompt after the preview:

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters @main.bicepparam \
  --confirm-with-what-if
```

## Links
[What-If Docs](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if){: .btn .btn-blue }

