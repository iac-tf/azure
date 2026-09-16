---
title: "7 · Capstone"
layout: post
parent: Workshop
nav_order: 8
permalink: /workshop/capstone/
---

{% include present_toggle.html %}

<div class="workshop-slides" markdown="1">

## One Resource, Four Tools

You've now seen the same storage account deployed with ARM, Bicep, Terraform's `azurerm`, and Terraform's `azapi`. This capstone ties it together with one small, realistic change — **add a `tags` block** (`environment = "production"`) — applied to all four. It's a deliberately small task: the point isn't the tags, it's noticing how the same one-line intent is expressed four different ways.

Work through the four labs below in any order, then finish with the mixed quiz pulling one question from every module in this workshop.

</div>

---

{% capture cap_arm_task %}
**Tool 1 of 4 — ARM.** Add a top-level `"tags"` property to this resource, with an `"environment"` key set to `"production"`.
{% endcapture %}
{% capture cap_arm_starter %}{
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2023-01-01",
  "name": "[parameters('storageAccountName')]",
  "location": "[parameters('location')]",
  "sku": { "name": "Standard_LRS" },
  "kind": "StorageV2"
}{% endcapture %}
{% capture cap_arm_solution %}{
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2023-01-01",
  "name": "[parameters('storageAccountName')]",
  "location": "[parameters('location')]",
  "sku": { "name": "Standard_LRS" },
  "kind": "StorageV2",
  "tags": {
    "environment": "production"
  }
}{% endcapture %}
{% include lab.html id="cap-arm-lab" title="Tag it — ARM" lang="json" task=cap_arm_task starter=cap_arm_starter solution=cap_arm_solution checks='[{"test":"\"tags\"","type":"contains","message":"a top-level tags property exists"},{"test":"environment","type":"contains","message":"tags includes an environment key"},{"test":"production","type":"contains","message":"environment is set to production"}]' %}

{% capture cap_bicep_task %}
**Tool 2 of 4 — Bicep.** Add a `tags` property with `environment: 'production'`.
{% endcapture %}
{% capture cap_bicep_starter %}resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}{% endcapture %}
{% capture cap_bicep_solution %}resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  tags: {
    environment: 'production'
  }
}{% endcapture %}
{% include lab.html id="cap-bicep-lab" title="Tag it — Bicep" lang="bicep" task=cap_bicep_task starter=cap_bicep_starter solution=cap_bicep_solution checks='[{"test":"tags","type":"contains","message":"a tags property exists"},{"test":"environment","type":"contains","message":"tags includes an environment key"},{"test":"production","type":"contains","message":"environment is set to production"}]' %}

{% capture cap_tf_task %}
**Tool 3 of 4 — Terraform (azurerm).** Add a `tags` argument with `environment = "production"`.
{% endcapture %}
{% capture cap_tf_starter %}resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}{% endcapture %}
{% capture cap_tf_solution %}resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "production"
  }
}{% endcapture %}
{% include lab.html id="cap-tf-lab" title="Tag it — Terraform azurerm" lang="hcl" task=cap_tf_task starter=cap_tf_starter solution=cap_tf_solution checks='[{"test":"tags","type":"contains","message":"a tags argument exists"},{"test":"environment","type":"contains","message":"tags includes an environment key"},{"test":"production","type":"contains","message":"environment is set to production"}]' %}

{% capture cap_azapi_task %}
**Tool 4 of 4 — Terraform (azapi).** In azapi, `tags` is a resource-level argument (a sibling of `type`/`name`/`body`), not something inside `body`. Add it.
{% endcapture %}
{% capture cap_azapi_starter %}resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  body = {
    sku  = { name = "Standard_LRS" }
    kind = "StorageV2"
  }
}{% endcapture %}
{% capture cap_azapi_solution %}resource "azapi_resource" "storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  name      = var.storage_account_name
  location  = var.location
  parent_id = var.resource_group_id

  tags = {
    environment = "production"
  }

  body = {
    sku  = { name = "Standard_LRS" }
    kind = "StorageV2"
  }
}{% endcapture %}
{% include lab.html id="cap-azapi-lab" title="Tag it — Terraform azapi" lang="hcl" task=cap_azapi_task starter=cap_azapi_starter solution=cap_azapi_solution checks='[{"test":"tags","type":"contains","message":"a tags argument exists"},{"test":"environment","type":"contains","message":"tags includes an environment key"},{"test":"production","type":"contains","message":"environment is set to production"}]' %}

## Final Quiz

{% include quiz.html id="capstone-quiz" title="Everything, mixed" questions='[{"q":"Running the same deployment twice with nothing changed should be a safe no-op. What property is this?","choices":["Idempotency","Recursion","Drift","Polymorphism"],"correct":0,"explain":"From module 0 — idempotency is what makes it safe to re-run a deployment."},{"q":"Deploying an ARM template in which mode deletes resources that exist in Azure but are NOT listed in the template?","choices":["Incremental","Complete","Preview","Safe"],"correct":1,"explain":"From module 1 — Complete mode treats the template as the entire desired state for the scope."},{"q":"Bicep’s what-if preview is sometimes noisy because...","choices":["It ignores all changes","API defaults can get echoed back as if they were modifications","It only checks syntax, never real resources","It always reports every resource as deleted"],"correct":1,"explain":"From module 2 — this is why some teams lean on terraform plan for a cleaner diff."},{"q":"OpenTofu exists today mainly because...","choices":["Terraform reached end-of-life","HashiCorp moved Terraform from the MPL to the more restrictive BSL license","Microsoft acquired HashiCorp","Terraform dropped HCL in favor of JSON"],"correct":1,"explain":"From module 4 — the 2023 relicensing is the direct reason the community forked Terraform 1.5.7."},{"q":"You are using azurerm for a storage account but need to set a property azurerm does not expose yet. What helps, without abandoning azurerm entirely?","choices":["Delete and recreate the whole resource in azapi","azapi_update_resource, to patch just that one property","Manually edit the .tfstate file by hand","Switch the entire project to ARM Templates"],"correct":1,"explain":"From module 5 — azapi_update_resource is built exactly for patching properties on a resource still owned by azurerm."}]' %}

## You've Finished the Workshop

Nice work — you've now seen the same Azure resource declared four ways, previewed with both `what-if` and `terraform plan`, and practiced the syntax quirks that trip people up when switching between tools. Head back to the [workshop overview](../) to revisit any module, or jump straight back to a specific tool whenever you need a refresher.
