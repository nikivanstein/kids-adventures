# Adding new adventures

All content lives under `content/worlds/`, as plain Markdown + YAML files. You can
edit everything directly on GitHub (open the file, click the pencil ✏️ icon) — no
need to install anything locally, though you can also clone the repo and edit with
any text editor.

The site rebuilds and redeploys automatically a minute or two after you commit to
`main` (see `.github/workflows/deploy.yml`).

## The structure

```
World        e.g. "Playmobil FunPark" — a setting/theme
  Campaign   e.g. "The Lost Candy Pot" — a story arc within that world
    Session  e.g. "The Missing Candy" — one playable adventure (~20-30 min)
```

```
content/worlds/<world-slug>/
  world.yaml         facts about the world (color, cover image, order)
  world.nl.md         Dutch title + description
  world.en.md         English title + description
  campaigns/<campaign-slug>/
    campaign.yaml       facts about the campaign
    campaign.nl.md      Dutch title + description
    campaign.en.md      English title + description
    sessions/<NN-session-slug>/
      session.yaml        facts: duration, ages, players, materials, tags
      nl.md               the full Dutch adventure text
      en.md               the full English adventure text
```

A `slug` is the URL-friendly folder name (lowercase, hyphens, no spaces/accents),
e.g. `playmobil-funpark`, `de-verdwenen-snoeppot`, `01-het-verdwenen-snoepje`. It
must be identical in the folder name and inside the `.yaml`/frontmatter fields
that reference it.

**Number session folders** (`01-...`, `02-...`) so they sort correctly on disk;
the actual play order on the site comes from `order` in `session.yaml`.

## Adding a new session to an existing campaign

1. Copy `content/_templates/session/` into the campaign's `sessions/` folder,
   rename it to the next `NN-your-session-slug`.
2. Fill in `session.yaml`: `slug`/`world`/`campaign` must match the folder path,
   set `order`, `durationMinutes`, `minAge`/`maxAge`, `players`, `materials`, and
   `tags` (tags must come from the vocabulary in `src/i18n/tags.ts` — add a new
   key there first if you need a new tag).
3. Write the adventure in `nl.md` and/or `en.md`. You don't need both right away
   — a session with only one language still publishes fine, showing a
   "not yet translated" banner and the other language's text until you add the
   missing file.
4. Commit (directly, or via a pull request). The site rebuilds automatically.

## Starting a new campaign in an existing world

Same idea: copy `content/_templates/campaign/` into `content/worlds/<world-slug>/campaigns/`,
rename it, fill in `campaign.yaml` + `campaign.nl.md`/`campaign.en.md`, then add
sessions inside it as above.

## Starting a brand-new world

Copy `content/_templates/world/` into `content/worlds/`, rename it, fill in
`world.yaml` + `world.nl.md`/`world.en.md`, then add a campaign and sessions
inside it as above.

## Adding cover images

Put image files under `public/images/...` (e.g.
`public/images/worlds/playmobil-funpark/cover.jpg`) and reference the site-root
path from the `cover` field in `world.yaml` / `campaign.yaml` / `session.yaml`,
e.g. `cover: /images/worlds/playmobil-funpark/cover.jpg`. Covers are optional and
fall back to a plain color block when missing.

## Writing style for the adventure text

Look at `content/worlds/playmobil-funpark/campaigns/de-verdwenen-snoeppot/sessions/01-het-verdwenen-snoepje/`
as the reference example. A few conventions that work well for reading aloud to
4-8 year-olds:

- `## Location Name` headings for each stop in the adventure.
- `> "Read this out loud..."` blockquotes for narration/dialogue.
- **Bold** for choice moments, with the intended answer noted in the text (never
  a real "game over" — always gently redirect a wrong guess).
- Keep it short: the whole session should play in about 20-30 minutes.
- End with an "Extra tips" section for the parent/game-master running it.
