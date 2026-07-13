---
title: "Why I Built This Site (And Why It's Just Markdown Files)"
date: 2026-07-04
tags: ["career", "meta"]
summary: "A short note on why this blog runs on plain Markdown files instead of a CMS — and what that says about how I like to work."
---

Every post on this blog, including this one, is a Markdown file sitting in
a Git repository. There's no database, no admin login, no CMS to patch and
maintain. To publish, I write a `.md` file, commit it, and push.

## Why this matters for how I work

A few reasons this setup fits how I think about infrastructure generally:

1. **Version control is the source of truth.** Every edit to this post is a
   diff I can review, roll back, or blame (in the Git sense).
2. **No moving parts to operate.** A static site has no server-side code to
   patch, no database to back up, and a much smaller attack surface.
3. **The pipeline does the work.** Pushing to `main` triggers a build and a
   deploy — the same shape of automation I'd want for any production
   service, just scaled down.

```bash
# publishing a new post, start to finish
hugo new content posts/my-new-post.md
$EDITOR content/posts/my-new-post.md
git add content/posts/my-new-post.md
git commit -m "post: my new post"
git push origin main
# GitHub Actions takes it from here
```

## What's next

I'll be using this space to write about the infrastructure and platform
work I'm doing — real notes from real systems, not polished marketing copy.
If you're reading this and would like to discuss more on DevOps and infrastructure,
the contact details are on the [about page](/).
