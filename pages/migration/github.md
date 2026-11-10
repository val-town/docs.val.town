---
title: "GitHub"
description: "Val Town migration guide: GitHub"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the repository

Reuse an existing repository where it already owns the app. Otherwise create a [GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

Keep public Val Town source public and private source private unless the user requests a change. If source visibility is unlisted or unclear, use a private repo until the user chooses otherwise. If combining apps with different visibility, keep private source separate or make the combined repo private. Repository visibility does not protect the running website; preserve its access controls too.

## Add the code

Export the app and the val files it imports, including dependencies loaded through `esm.town`. Replace those imports with local files so the deployed app does not depend on Val Town. Keep the framework’s normal structure and adapt that source directly for the destination runtime. Do not keep a second copy plus scripts that rewrite it during deployment.

Before committing, inspect the files and diff. Exclude env var values, local `.env` files, private database/blob exports, logs, and temporary migration files. Add appropriate `.gitignore` rules before the first commit; ignoring a file later does not remove it from history.

Add a short README: what the app does, live URL, where to edit, run/test/deploy commands, and required env var names. Generate and commit the destination package manager’s lockfile and deployment configuration.

Before pushing, check whether the repo already deploys automatically; use a non-production branch unless deployment is intended. Push the code and verify the remote commit and repository visibility. Configure the required env vars in the destination provider whether deployment is manual or automatic. Do not overwrite unrelated work or rewrite existing history as part of a routine migration.

## Optional: deploy on push

Ask whether the user wants pushes to deploy automatically. If yes, connect the repository to the chosen provider:

- [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Vercel Git integration](https://vercel.com/docs/git)
- [Netlify Git deployment](https://docs.netlify.com/build/configure-builds/overview/)
- [Render auto-deploys](https://render.com/docs/deploys)

Set the production branch, project folder, and build command. Configure env vars in the provider; keep production credentials and data out of untrusted preview builds.

Use a no-op commit or the next intended change to verify that the resulting deployment serves that commit. If automatic deployment is declined, document and test the manual deploy command.
