# frank.olwenda.me

Personal site and blog for Frank Olwenda — built with [Hugo](https://gohugo.io),
deployed to [GitHub Pages](https://pages.github.com).

## 1. First-time setup on your machine

**Install Hugo (extended version):**

- macOS: `brew install hugo`
- Windows: `choco install hugo-extended` or `winget install Hugo.Hugo.Extended`
- Linux: `sudo apt install hugo` (or download the `_extended` binary from the
  [Hugo releases page](https://github.com/gohugoio/hugo/releases) — you need
  the *extended* version for the CSS/Sass pipeline to work if you add one later)

**Preview the site locally:**

```bash
hugo server -D
```

Open http://localhost:1313 — it live-reloads as you edit files.

## 2. Editing your content

| What you want to do            | Do this                                                        |
|---------------------------------|------------------------------------------------------------------|
| Edit your bio / skills          | `content/_index.md`                                              |
| Change name, tagline, socials   | `hugo.toml` under `[params]`                                     |
| Write a new blog post           | `hugo new content posts/my-post-title.md`, then edit the file    |
| Add a project                   | `hugo new content projects/my-project.md`, then edit the file    |

Every post/project is a plain Markdown file with a bit of metadata (front
matter) at the top:

```markdown
---
title: "My New Post"
date: 2026-08-01
tags: ["kubernetes", "terraform"]
summary: "One sentence that shows up in the preview card."
---

Your Markdown content goes here. **Bold**, `code`, lists, images, code
blocks with syntax highlighting — all supported out of the box.
```

Publishing is: write the file → commit → push. The GitHub Actions pipeline
(see below) takes it from there.

## 3. One-time GitHub Pages setup

1. Create a new **public** GitHub repository (e.g. `frank-olwenda-site`) and
   push this project to it.
2. In the repo: **Settings → Pages → Build and deployment → Source** → select
   **GitHub Actions**. That's it — no separate account, CLI, or service
   account needed. The workflow in `.github/workflows/deploy.yml` handles
   the rest automatically on every push to `main`.
3. The first push to `main` will trigger the workflow (check the **Actions**
   tab) and publish the site to a default URL like
   `https://yourusername.github.io/frank-olwenda-site/` — this gets replaced
   by your custom domain in the next step.

## 4. Connecting frank.olwenda.me

Since `olwenda.me` is an existing domain, `frank` is just a subdomain — you
don't need to buy anything new.

1. This repo already includes a `static/CNAME` file containing
   `frank.olwenda.me`, which Hugo copies into every build automatically —
   GitHub Pages reads this file to know which custom domain to serve.
2. Go to wherever `olwenda.me`'s DNS is managed (your domain registrar, or
   a DNS provider like Cloudflare) and add a **CNAME record**:
   - Host/name: `frank`
   - Value/target: `yourusername.github.io`
3. Back in the repo: **Settings → Pages → Custom domain** → enter
   `frank.olwenda.me` → Save. GitHub will verify DNS automatically.
4. Once verified, tick **Enforce HTTPS** — GitHub provisions free SSL via
   Let's Encrypt.
5. DNS can take anywhere from a few minutes to a few hours to propagate.

## 5. Deployment flow

- **Push to `main`** → GitHub Actions builds the Hugo site and deploys it
  straight to `frank.olwenda.me`. Check progress under the repo's **Actions**
  tab.
- No CLI, login, or manual deploy step required — it's entirely git-push-based.
- Want to trigger a rebuild without a code change (e.g. after editing a repo
  setting)? Use the **Run workflow** button on the Actions tab
  (`workflow_dispatch` is enabled for this).

## 6. Things to personalize before launch

- [ ] Replace placeholder bio text in `content/_index.md`
- [ ] Replace the 3 sample projects in `content/projects/` with real ones
      (or keep "This Website" — it's real)
- [ ] Update `email`, `github`, `linkedin` in `hugo.toml`
- [ ] Add a real `resume.pdf` to `static/` (referenced at `/resume.pdf`)
- [ ] Confirm `static/CNAME` contains the exact domain: `frank.olwenda.me`
- [ ] Delete this checklist once you're live 🙂
