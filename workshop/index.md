---
title: Workshop
layout: post
has_children: true
nav_order: 2
permalink: /workshop/
---

## The Azure IaC Workshop

A self-paced, interactive tour of the three ways to describe Azure infrastructure as code: **ARM Templates**, **Bicep**, and **Terraform / OpenTofu** (plus the `azapi` provider and a head-to-head comparison).

Every module mixes four things:

* **Slides** — click **▶ Present slides** at the top of any module to turn its content into a full-screen deck (arrow keys or the on-screen buttons to move, <kbd>Esc</kbd> to exit). Useful for following along in a live session, or just for skimming the highlights.
* **Docs** — the same content, as a normal scrolling reference page you can search and link to.
* **A lab** — a small in-browser code editor with a real (if narrow) task and instant feedback. Nothing you type is sent anywhere or executed against a real Azure subscription — checks run entirely in your browser against the text you wrote.
* **A quiz** — a handful of multiple-choice questions with an explanation on every answer.

There's no login and nothing is saved between visits — refreshing a page resets its lab and quiz, so feel free to retry as many times as you like. Modules are numbered in a suggested order, but every page stands on its own if you want to jump straight to one tool.

## Modules

<div class="workshop-module-grid">
  <a class="workshop-module-card" href="{{ '/workshop/why-iac/' | relative_url }}">
    <div class="workshop-module-card-num">Module 0</div>
    <div class="workshop-module-card-title">Why IaC</div>
    <div class="workshop-module-card-desc">Pros, cons, and the vocabulary (declarative, idempotent, drift) the rest of the workshop assumes.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/arm-templates/' | relative_url }}">
    <div class="workshop-module-card-num">Module 1</div>
    <div class="workshop-module-card-title">ARM Templates</div>
    <div class="workshop-module-card-desc">Azure's native JSON format — what everything else compiles down to.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/bicep/' | relative_url }}">
    <div class="workshop-module-card-num">Module 2</div>
    <div class="workshop-module-card-title">Bicep</div>
    <div class="workshop-module-card-desc">Microsoft's DSL for Azure, and the limits of its what-if previews.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/terraform/' | relative_url }}">
    <div class="workshop-module-card-num">Module 3</div>
    <div class="workshop-module-card-title">Terraform</div>
    <div class="workshop-module-card-desc">Multi-cloud, state files, and why <code>terraform plan</code> is so well regarded.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/opentofu/' | relative_url }}">
    <div class="workshop-module-card-num">Module 4</div>
    <div class="workshop-module-card-title">OpenTofu</div>
    <div class="workshop-module-card-desc">The MPL-licensed, Linux Foundation-governed fork of Terraform.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/azapi/' | relative_url }}">
    <div class="workshop-module-card-num">Module 5</div>
    <div class="workshop-module-card-title">azapi Provider</div>
    <div class="workshop-module-card-desc">Day-0 Azure coverage inside Terraform, straight from the ARM API.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/comparison/' | relative_url }}">
    <div class="workshop-module-card-num">Module 6</div>
    <div class="workshop-module-card-title">Comparison</div>
    <div class="workshop-module-card-desc">The full feature matrix and the same storage account, deployed four ways.</div>
  </a>
  <a class="workshop-module-card" href="{{ '/workshop/capstone/' | relative_url }}">
    <div class="workshop-module-card-num">Module 7</div>
    <div class="workshop-module-card-title">Capstone</div>
    <div class="workshop-module-card-desc">One resource, every tool, one mixed final quiz.</div>
  </a>
</div>
