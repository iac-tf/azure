---
title: Bicep
layout: post
nav_order: 2
has_children: true
---

Bicep is the native IaC solution for Azure.  
The default used to be ARM templates but Bicep solved a couple of issues with ARM.
However in the end Bicep is compiled to ARM templates so every limitation of ARM still exists

## Pros
* Natively supported by Azure
* Based on hashicorp HCL & easier compared to JSON in ARM templates
* Provides a registry solution for centralized templates

## Cons
* What-If is not that great
* Limited by ARM template language


## Links
[Bicep Docs](https://learn.microsoft.com/en-us/azure/templates/#bicep){: .btn .btn-blue }