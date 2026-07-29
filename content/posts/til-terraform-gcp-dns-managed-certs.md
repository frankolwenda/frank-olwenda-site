---
title: "TIL: Automating A Records and Managed Certificates on GCP with Terraform"
date: 2026-07-29
tags: ["til", "terraform", "gcp", "dns"]
---

Automating certificate creation on GCP with Terraform was the easy part. What actually slowed me down was the DNS record logic underneath it — specifically, how Terraform wants to manage a DNS record set versus how I was thinking about it.

One quick prerequisite worth flagging for anyone newer to this: `google_dns_record_set` is a Cloud DNS resource, which means the domain's DNS has to already be managed in Cloud DNS via a `google_dns_managed_zone` before Terraform can create records inside it. Terraform doesn't create DNS out of thin air — it's just calling the Cloud DNS API on your behalf, so the zone needs to exist first.

The mental model I walked in with was "add a record." Terraform's `google_dns_record_set` doesn't work that way — a record set resource represents the *entire* set of values for a given name and type, not a single entry you're appending to. If a record already exists outside of Terraform's state and you define a new `google_dns_record_set` for the same name and type, you're not adding to it — you're colliding with it, and Terraform will complain or, worse, silently clobber it on apply if state gets out of sync with reality.

That distinction matters a lot once you're generating records dynamically instead of hardcoding them one by one. The clean way to do it is to build the record set as a list going in, rather than trying to create or update records incrementally:

```hcl
resource "google_dns_record_set" "a_record" {
  name         = "app.example.com."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.zone.name
  rrdatas      = [google_compute_global_address.app_ip.address]
}
```

If you're generating multiple records from a map or list of services, `for_each` handles it well — just make sure each record's `name` is unique per resource, since Terraform needs that to track them as separate resources rather than fighting over the same one. (Worth a quick note: this can live in `main.tf` or a separate file like `dns.tf` — Terraform loads every `.tf` file in a directory as one combined config, so the filename is just a convention for readability, not a requirement.)

The other piece that trips people up is ordering: a Google-managed SSL certificate (`google_compute_managed_ssl_certificate`) won't actually finish provisioning until the DNS record it depends on is live and resolving. Terraform doesn't automatically know to wait for DNS propagation — it considers the record "created" as soon as the API call succeeds, not once it's actually resolvable. In practice this means the cert resource can sit in a pending state for a while after `terraform apply` finishes, which looks like something's broken when really it's just DNS catching up. Using an explicit `depends_on` between the cert and the DNS record at least gets the ordering right within Terraform's own graph, even though it can't force DNS propagation itself.

Small lesson, but a useful one: with DNS in Terraform, think in terms of "what is the complete, correct state of this record" rather than "what am I adding to it." Once that clicked, the rest of the automation came together fast.
