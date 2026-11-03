---
title: Custom domains
description: Point your own domains to any HTTP val
updated: 2026-09-08
---

Custom domains allow you to serve HTTP vals from your own domain name(s).
Instead of deploying your website on `acme.val.run`, for example, you can serve
it from `acme.dev`.

<iframe width="100%" height="376" style="border-radius: 4px; border: 2px solid var(--beige);" src="https://www.youtube.com/embed/K8WSofmXrSA?si=vy-uMObWyQFzb4aT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> Custom domains are available for
> [Pro & Business](https://www.val.town/pricing) subscribers, but
> [custom subdomains](/vals/http/custom-subdomains) are available on Free
> accounts.

## Buy a domain

The custom domains feature works with domains that you already own, and connects
them to your val, which serves all traffic to the domain. You'll need to
configure DNS settings with your domain registrar to make this work.

You can buy your domain at any registrar, for example:

- [Cloudflare](https://www.cloudflare.com/products/registrar/) (make sure to
  [set up the proxy correctly](https://docs.val.town/vals/http/cdns/#cloudflare-cdn))
- [Porkbun](https://porkbun.com/)
- [Vercel](https://vercel.com/domains)
- [Namecheap](https://www.namecheap.com/)
- _Wherever you get your domains_

## Add your domain to Val Town

Once you have a domain, navigate to Val Town's
[custom domain settings](https://val.town/settings/domains) and add the domain
that you want to redirect to one of your vals.

Then choose a val to handle requests to that domain.

## Configure the DNS

Lastly, you'll need to configure the DNS settings in your domain registrar so
that requests are routed to your val. We provide a summary of the information
below on the domain page for your convenience.

The DNS configuration will depend on the type of domain, apex domains
(`example.com`) or subdomains (`something.example.com`). These settings will
depend on the platform you use to manage your domains.

> **Note:** DNS changes can take up to an hour to take effect.

### Subdomains

Create a CNAME record to `domains.val.run.`:

| CNAME record             | value              |
| ------------------------ | ------------------ |
| `something.example.com.` | `domains.val.run.` |

Replace `something.example.com.` with your domain. In some domain platforms, you
should only use the subdomain, which would be `something` in the example above.

### Apex domains

Create the following two A records:

| A record       | value           |
| -------------- | --------------- |
| `example.com.` | `75.2.96.173`   |
| `example.com.` | `99.83.186.151` |

Replace `example.com.` with your domain. In some domain platforms, you should
replace `example.com.` with `@`.

> Some registrars, such as
> [Cloudflare](https://developers.cloudflare.com/dns/cname-flattening/), support
> CNAME records for apex domains as well.

## Debugging

Unfortunately, custom domains can take minutes or hours to propagate, which is
quite frustrating because you don't know if you just need to wait or if your
settings are incorrect. Even worse, the domain settings can be cached in
multiple places, including some outside of your control, including your local
network. So if you check your custom domain too early, then you'll continue to
not see it working, even when it's properly working on systems that don't have
it cached. (If we had a dollar every time a user sent us a message asking for
help getting their custom domain working, and when we checked it was already
working, we'd have almost ten dollars.)

In other words, use our
[DNS Debugger](https://stevekrouse-dns_record_debugger.web.val.run/) to see if
your custom domain is correctly set up.

_Val Town custom domains are powered by
[SaaS Custom Domains](https://saascustomdomains.com)._