---
title: "TIL: A Records vs CNAME Flattening on Cloudflare"
date: 2026-07-21
tags: ["til", "dns", "cloudflare"]
---

I've touched DNS records for years as a sysadmin without ever really sitting down and understanding why you can't just `CNAME` your root domain. Setting up Cloudflare for this site finally forced the issue.

Quick definitions if you're newer to this: an **A record (Address Record)** points a domain name straight to an IP address — it's the most direct kind of "this name means that server" mapping. A **CNAME (Canonical Name Record)** points a domain name at another domain name instead of an IP, so it's really just an alias — "this name is really that other name, go look there."

Here's the situation. GitHub Pages hands you a set of IPs to point your domain to - Simply, these are public IP addresses pointing to servers owned by GitHub. For `www.frankolwenda.com`, that's easy — CNAME it to `frankolwenda.github.io` and move on. But try that on the bare root domain (`frankolwenda.com`, no `www`) and DNS pushes back. A CNAME means "this name is just an alias for that other name," full stop, and the spec won't let an alias share space with anything else at that name — like an MX (Mail Exhanger) record for email.

So the root and the `www` get handled differently:

- Root domain gets **A records**, pointed straight at GitHub Pages' IPs. A-records just map a domain name to an IP address, no aliasing, so they play fine with whatever else lives at that name. Put simply `Root Domain --> Server IP`
- `www` gets the **CNAME**, pointed at `frankolwenda.github.io`. Put simply `Alias Domain --> Root Domain`

Cloudflare also has a feature called CNAME flattening, which fakes an alias at the root by resolving it to an IP under the hood. That's the move if your host only gives you a hostname and no static IPs. GitHub Pages gives static IPs, so I skipped it — plain A records did the job.

Small distinction, but it's one of those things that's completely obvious in hindsight and mildly baffling every time before you actually hit it.
