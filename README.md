# toolbelt

Random but genuinely useful tools I build for myself — apps, scripts, Claude/Claude Code plugins, and whatever else earns its keep.

Nothing here is trying to be a polished product. It's the stuff I actually reach for.

## What's inside

| Tool | Description |
|---|---|
| [`plugins/seed`](./plugins/seed) | Generate ideas and test them on a simulated crowd; go/pivot/kill verdict, `IDEA-BRIEF.md` + visual `IDEA-BOARD.html`. |
| [`plugins/forge`](./plugins/forge) | Project lifecycle for Claude Code: router for vague requests, evidence-based gates, review agents, build loops, security baseline, anti-slop UI lane. |
| [`plugins/reel`](./plugins/reel) | Demo films from one command: story, playable board, 2× captures, AI voice, licensed music, QA, publish kit. |
| [`tools/md-reader`](./tools/md-reader) | Single-file HTML markdown reader & editor — open, edit, highlight, and export `.md` files with zero installs. Works offline, just open the file in a browser. |
| [`plugins/eli5`](./plugins/eli5) | ELI5 picture-explainer skill for Claude Code and Codex. |

## Start here (Claude Code plugins)

```
/plugin marketplace add muhammadtalhaishtiaq/toolbelt
/plugin install forge@toolbelt
/plugin install seed@toolbelt
/plugin install reel@toolbelt
```

| You want to… | Type |
|---|---|
| test an idea or get ideas | `/seed:run "<idea or theme>"` |
| start any project | `/forge:start` |
| know where you are and what's next | `/forge:where` (or just say "what now?") |
| make the demo film | `/reel:make <url>` |

The three plugins don't depend on each other; they only share optional files (`IDEA-BRIEF.md`, `STATUS.md`). Full guide: [`plugins/forge/playbooks/START-HERE.md`](./plugins/forge/playbooks/START-HERE.md).

## Structure

```
toolbelt/
├── tools/       # standalone apps/utilities (usually single-file, run locally)
├── .claude-plugin/marketplace.json   # makes this repo a Claude Code plugin marketplace
├── plugins/     # Claude / Claude Code plugins and skills
└── scripts/     # small one-off scripts
```

Folders get added as things get built — this isn't planned out in advance.

## License

MIT unless a subfolder says otherwise.
