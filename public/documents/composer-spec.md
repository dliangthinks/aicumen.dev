# Aicumen — An MCP Server for Block-Based Course Authoring

**Status:** Draft v0.8, 2026-09-06. §9a: transitions are options the server offers, every theme has a default, guidance lives in the authoring guide. §9a rewritten: a transition is a seam owned by an edge, with intent-carrying presets and per-edge overrides. v0.7, after the owner reviewed the validation-client mock: per-block status and anchored notes are shelved (§7, §12); transitions and backdrops added (§9a). v0.6: §9 gained the theme token set, `scheme`, and the rule that the course paints its own theme; Rise import dropped. v0.5 incorporated the M0 transcript findings (`transcript-lesson-01.md` §4): slot ids on containers, path-addressed `update_block`, `reshape.fill`, narration as a field, `resolve_media.timings`, `create_feedback` on the tool surface, feedback context, derived-media side effects. v0.4 added the anchored validation loop, two-level swapping, media generation, and the dynamics roadmap.
**Companion:** `block-model.md` defines shapes, presentations, stance, layout, behaviors, and extension. This document defines everything around them: roles, server, tools, workflow, rendering, import, milestones.
**Origin:** Grew out of an attempt to automate Articulate Rise 360 through its web UI; that project is set aside and there is no Rise import or export.

---

## 1. What Aicumen is

Aicumen is an MCP server. It exposes tools. When an agent calls a tool such as `add_collection` with validated fields and a chosen presentation, the server stores that block in the lesson's layout tree and can render it as HTML styled by the course theme. It renders whole lessons, serves a live preview in which a human validates the result, and exports whole courses as static sites.

Aicumen is deterministic. It contains no language or image model and makes no content decisions. Every capability is a tool. Every human-facing surface is a client of the same tools.

### Non-goals (v1)

- A human authoring format. The lesson plan is the human's document; the server never sees it.
- WYSIWYG content editing. Content changes go through the agent.
- Importing from or writing to Rise 360 or any other authoring tool. Aicumen starts from the agent's tool calls.
- Hosting, accounts, LMS functions, SCORM/xAPI packaging (reserved, §12).
- Running any generative model inside the server.

---

## 2. Who does what

Three parties. The boundaries are the product.

| | Human | Agent | Aicumen |
|---|---|---|---|
| **Plan** | writes the brief and lesson plan, in whatever form they like | reads them | never sees them |
| **Structure** | — | breaks each lesson into shapes, writes every block's content, chooses presentations | validates against schemas, stores in the layout tree |
| **Media** | signs off the course's media style guide once | writes a brief for every needed asset, calls generation services, resolves the asset | tracks pending media, composes prompts from brief plus style guide, renders placeholders, stores provenance |
| **Render** | — | asks for renders and snapshots to self-review | renders, previews, snapshots, exports |
| **Validate** | reviews the preview: goes through every block, swaps presentations and applies structural reshapes where the form is wrong, approves the lesson | revises what the human flags in conversation | records swaps and reshapes as revisions, tracks lesson status |
| **Extend** | promotes agent-defined shapes and presentations to the shared library | defines new shapes and presentations when content fits none | registers them and updates the tool list |

The human role is deliberately concentrated at two points: **before**, in the lesson plan and the style guide, and **after**, in validation. Assembly in between is the agent's. The validation surface is designed so the most common human reaction, "not like that, show it differently," costs one click and no agent time (§6). Anchored notes to the agent were designed (see `transcript-lesson-01.md` §3) and are shelved for a later, better version (§12).

---

## 3. How the server works

An MCP server speaks JSON-RPC over stdio or HTTP. It advertises tools (name, description, JSON Schema input), resources (readable URIs), and prompts. The host puts the tool list in front of the model; the model chooses and fills arguments; the server validates, acts, and returns. The server keeps whatever state it needs.

- **Lifecycle.** `aicumen mcp --workspace <dir>` manages any number of courses in that workspace. State survives restarts.
- **Input.** Tool calls only. Rich-text fields accept a small inline formatting subset: paragraphs separated by blank lines, `**bold**`, `_italic_`, `[links](url)`, and `- ` / `1. ` list lines. Raw HTML in a field is rejected.
- **Output.** Mutating calls return the affected block's `id`, its place in the tree (`parent`, `index`), the lesson's new `revision`, any `warnings`, and any `side_effects` (for example, a narration re-queued because its script changed). Rendered HTML only on request.
- **Persistence.** One JSON document per course under `<workspace>/<course-id>/course.json` plus `assets/`. Each lesson holds a **layout tree** (containers and blocks, see `block-model.md` §5), not an array. Internal format, versioned, never an authoring surface.
- **Concurrency.** Mutating calls may pass `expected_revision`; mismatch fails with the current state. Human actions in the preview produce revisions like any other, so agent and human never silently overwrite each other.
- **Errors.** Validation failures return the failing field, the rule, and the relevant schema excerpt. Never an opaque failure for a fixable input.
- **Tool list changes.** When a shape is defined at runtime the server emits `tools/list_changed`; hosts that honor it show the new `add_<shape>` tool immediately.

---

## 4. Tool design

Decided in `block-model.md` §3 and §4: one creation tool per **shape**, presentation as a swappable choice on the block, generic structural tools that do not depend on shape. Nine tier-1 shapes, six tier-2, about thirty-five tools total, with a ceiling near forty before rarely used shapes move behind a generic fallback.

---

## 5. Tool surface

Ids are server-assigned opaque strings. `position` is `{ index } | { after: id } | { end: true }`. `parent` is a container id or, for `columns` and `split`, one of the slot ids the container returned when created; default the lesson root. Paths into a block's fields are JSON Pointers (`/items/1/body`), the same form feedback anchors use.

### Courses and lessons

| Tool | Notes |
|---|---|
| `create_course`, `list_courses`, `get_course`, `update_course`, `delete_course` | `get_course` returns metadata, lesson order, per-lesson block count, revision, status counts |
| `create_lesson`, `update_lesson`, `delete_lesson` | `update_lesson` also sets the lesson `background` and `header.transition` (§9a) |
| `get_lesson { lesson_id, detail: outline \| full }` | `outline`: the tree, indented, one line per node with id, shape, presentation, stance, status, first ~80 chars. `full`: every field. |

### Blocks

| Tool | Notes |
|---|---|
| `add_passage`, `add_collection`, `add_pairs`, `add_figure`, `add_gallery`, `add_annotated`, `add_categories`, `add_question`, `add_separator` | tier 1 |
| `add_scenario`, `add_dataset`, `add_matrix`, `add_prompt`, `add_model`, `add_custom` | tier 2 |
| all `add_*` take | `lesson_id`, `parent?`, `position?`, `presentation?` (default per shape), `options?`, `expected_revision?`, `return_html?`, plus the shape's fields |
| `get_block`, `delete_block`, `move_block` | |
| `update_block { block_id, fields?, set?, remove?, move?, replace_range?, expected_revision?, override? }` | `fields` sets top-level fields; `set: { pointer: value }`, `remove: [pointer]`, `move: [{ from, to }]` address items and sub-fields; `replace_range: { path, start, end, quote, text }` edits a text selection. Validated against the block's shape. Reports `side_effects` such as re-queued narration. |
| `duplicate_block { block_id, parent?, position?, presentation?, fields? }` | copy with an optional new presentation and field overrides, so "same data at practice stance" is one call |
| `set_presentation { block_id, presentation, options? }` | level-1 swap, §6 |
| `list_presentations { shape, item_count?, stance?, has_media? }` | fit-checked, ranked, with reasons |
| `reshape { block_id, to_shape, mapping?, fill? }` | level-2 deterministic swap, §6; `fill` supplies required target fields the source lacks (a `question`'s `prompt` and `feedback`); fails with the reason when no structural transform exists or a required field is missing |
| `replace_block { block_id, shape, fields, presentation }` | atomic replacement keeping position and lineage; the agent's tool for judgment-based reshaping |
| `add_container { lesson_id, kind, options, parent?, position? }` | `stack`, `columns`, `grid`, `split`, `section`. `columns` and `split` return `slots: [id…]`; children target a slot as their `parent`. `section.options.background` and `section.options.transition` per §9a |
| `update_container { container_id, options }` | change a container's options, including a section's `background`, `transition`, and per-edge `edges.top` / `edges.bottom` |

### Validation and status

| Tool | Notes |
|---|---|
| `validate { scope }` | schema errors, fit warnings, rhythm smells, accessibility, contrast, pending media, `anchors_on_pending_media` / `anchors_unverified` |
| `set_status { lesson_id, status }` | `draft`, `review`, `approved`. Lesson-level only; there is no per-block status. An `approved` lesson rejects mutating calls without `override: true` and returns to `review` when overridden |

Anchored feedback (`create_feedback`, `list_feedback`, `reply_feedback`, `resolve_feedback`) is specified in the M0 transcript and shelved to §12 by the owner's decision after reviewing the mock.

### Media

| Tool | Notes |
|---|---|
| `add_asset { course_id, path \| url, name?, provenance? }` | |
| `list_assets` | |
| `list_pending_media { course_id \| lesson_id }` | every media brief not yet resolved, each with a **composed prompt**, §8 |
| `resolve_media { media_id, asset_id, alt?, provenance, timings?, transcript? }` | swaps the placeholder for the asset; `timings` are provider word or mark times used to resolve `[cue:name]` markers and build captions; warns `anchors_unverified` when the block has anchors placed before the media existed |
| `regenerate_media { media_id, brief? }` | marks resolved media pending again, keeping history |
| `generate_media { media_id \| brief, provider? }` | v1.x, only when a provider adapter is configured, §8 |

### Theme and style

| Tool | Notes |
|---|---|
| `get_theme`, `set_theme { patch }`, `list_theme_presets` | tokens, per-shape defaults, and the **media style guide**, §9 |

### Rendering, preview, export

| Tool | Notes |
|---|---|
| `render_block`, `render_lesson` | HTML |
| `render_auditions { block_id, presentations? }` | the same block in several presentations, for a human or agent to compare |
| `start_preview`, `stop_preview` | URL of the validation client, §7 |
| `snapshot { lesson_id \| block_id, viewport? }` | PNG |
| `export_course { course_id, out_dir }` | static site |

### Extension and discovery

`list_shapes`, `describe_shape`, `define_presentation`, `define_shape`, `list_packs`. See `block-model.md` §7.

### Resources and prompts

Resources: `aicumen://guide` (the authoring guide), `aicumen://shapes/{shape}`, `aicumen://courses/{id}/outline`, `aicumen://courses/{id}/feedback`, `aicumen://courses/{id}/style`.
Prompts: `author_lesson` (lesson plan in, block sequence out), `review_lesson` (self-review against a snapshot), `reshape_block` (source fields and target schema in, new fields out), `brief_media` (block context in, media brief out), `address_feedback` (a human note in, a revision plan out).

---

## 6. Two levels of swapping

The structure in `block-model.md` makes "show this differently" a first-class operation, at two depths. Rise offers a "change block type" that works within a family and loses content across families, because Rise blocks have no shared structure. Aicumen's shapes give the operation a systematic basis.

### Level 1 — Re-presentation. Deterministic. No agent.

Same shape, different presentation. `set_presentation` on a `collection` turns an accordion into tabs, a process, a timeline, or a card grid, and the content is untouched. The server checks the target's fit constraints (tabs want 2–7 items; a timeline wants labels) and either applies or returns the reason. `render_auditions` renders one block in several presentations at once so a reviewer can compare.

This is exposed **directly to the human in the preview** (§7). Because it is deterministic, it costs nothing, needs no agent turn, and is the single most common validation action: the content is right, the form is wrong. In Rise this requires deleting and re-authoring the block.

### Level 2 — Re-shaping. Sometimes deterministic, sometimes judgment.

Shape A to shape B. Two cases, and the server knows which is which.

**Structural transforms** exist where the data of one shape maps mechanically onto another. The server implements them as `reshape`, publishes the table, and labels each as lossless or lossy with what is dropped:

| From | To | Mapping | Loss |
|---|---|---|---|
| `collection` | `pairs` | `title → a`, `body → b` | `media`, `label` |
| `pairs` | `collection` | `a → title`, `b → body` | roles |
| `collection` | `categories` | one group holding all items | none |
| `categories` | `collection` | groups flattened, group name as `label` | grouping |
| `collection` (ordered) | `question` (kind `tile_sequence`) | items become the correct order | bodies |
| `pairs` | `question` (kind matching, via `pairs` assessment presentation) | none needed; it is a presentation | none |
| `passage` | `collection` | paragraphs become items | heading structure |
| `annotated` | `collection` | annotations become items, anchors dropped | position |
| `annotated` | `figure` | annotations dropped | annotations |
| `gallery` | `figure` ×N or `collection` | one item per medium | none |
| `figure` ×N | `gallery` | merge siblings | body text |
| `matrix` | `collection` | rows become items, cells joined | column structure |
| `dataset` | `matrix` | series × x | none |
| `scenario` | `collection` | nodes in traversal order | branching |

**Judgment transforms** need content to be written, not moved: `passage → pairs` (extract terms and definitions), `passage → question` (write distractors and feedback), `collection → scenario` (invent situations and consequences), `collection → model` (identify variables and relationships). The server refuses these in `reshape` with a message naming the `reshape_block` prompt. The agent fetches the block, composes the new fields, and calls `replace_block`, which keeps the position and records the lineage so the history shows one block changing shape rather than a delete and an add.

The distinction is what makes the feature trustworthy. A human in the preview sees which alternative presentations are one click and which reshapes are one agent turn, and never sees a lossy transform applied silently.

---

## 7. The human validation loop

The preview is not a page. It is the **validation client**: a thin web UI served by `start_preview`, talking to the same server through the same tools. It is the one human-facing surface in v1 and it is deliberately narrow.

### The review pass

The reviewer reads the lesson top to bottom as a learner would and fixes form as they go. Selecting a block shows a toolbar on the block with the fit-checked list of presentations; choosing one re-renders the block in place. The inspector beside the lesson offers the same list, a side-by-side comparison of up to three presentations, and the structural reshapes that exist for the block's shape, each labelled lossless or with what it drops. Every action is a revision the agent sees before it writes again.

There is no per-block approval. The reviewer's job is to go through all the blocks and revise the ones that are not working; when the pass is done, the lesson is approved as a whole with `set_status`. Anything the reviewer cannot fix by swapping or reshaping is content, and content goes back to the agent in conversation.

### Mechanics

Human actions in the client are the same tool calls the agent makes (`set_presentation`, `reshape`, `update_container`, `set_status`), so the revision counter and `expected_revision` protect both parties. An approved lesson rejects mutating calls without `override: true`, which returns it to `review`.

Later (§12): anchored notes, multiple reviewers, a "why this presentation" explainer showing the guidance rule the agent followed.

---

## 8. Media generation as the default path

Today a course image costs a human decision about style, a prompt, a generation, a review, a crop, and alt text. Aicumen makes generated media the expected path and moves every decision that can be made once to a place where it is made once.

### Media briefs

Any `media` field accepts a **brief** in place of a source. `passage` also has `narration?: auto | media | brief`, where `auto` means the body is the script:

```
media: { brief: "A support lead on a phone call, calm, at a desk with two monitors", kind: image, aspect: "16:9", purpose: illustration }
```

The server stores it as **pending media**, renders a styled placeholder showing the brief in the preview, and validates the lesson with a warning rather than an error. Drafts render on the first pass with every image, clip, and track accounted for and none yet produced. The agent can author a whole course before a single asset exists, and a human can validate structure and form before spending anything on generation.

Kinds: `image` (illustration, photograph, diagram, icon), `video` (short clip, motion background, avatar narration), `narration` (text to speech from the `narration` field; `[cue:name]` markers in the script are stripped from the rendered text and resolved to times from `timings` at `resolve_media`; a body change re-queues the narration and is reported as a `side_effect`), `soundtrack` (ambient or musical bed for a lesson or section), `sfx` (interaction sounds, off by default). Diagrams for `dataset`, `matrix`, `tree`, and `annotated` are drawn deterministically by the renderer and never need generation.

### The media style guide

The theme (§9) carries a **media style guide**: illustration style and references, palette usage, photography versus illustration, mood, composition rules, negative constraints, narration voice and pace, music mood and instrumentation, video motion character. The human and agent set it once per course, with a few audition renders to agree on it. From then on every brief is composed with the style guide automatically. This is what makes generation almost automatic: no per-image style decisions, and every asset in the course looks and sounds like it belongs to the same course. Reference assets (a character sheet, a set of seed images, a voice sample) live in `assets/` and are cited by the style guide.

### Fulfillment

`list_pending_media` returns each brief with a **composed prompt**: brief plus style guide plus technical constraints (aspect, resolution, duration, safe margins for text overlay) plus a draft alt text derived from the brief. Composition is templating, not judgment, so it belongs in the server.

Anchors placed on pending media (`annotated` hotspots, `gallery` juxtaposition) are guesses until the medium exists. The server warns at add time and at resolve time; the agent's remedy is `snapshot` then `update_block` on the anchor path.

Two fulfillment paths:

- **v1 — the agent orchestrates.** The agent takes the composed prompt to whatever generation service its host has: an image, video, speech, or music MCP server, or an API. It uploads the result with `add_asset` and calls `resolve_media` with provenance. This works today with no provider code in Aicumen and with any generator the user prefers.
- **v1.x — provider adapters.** The workspace owner configures providers and keys; `generate_media` fulfills a brief in one call. Adapters are thin, pluggable, and optional. The server still makes no content decision: the agent wrote the brief, the human set the style, the adapter transports the prompt.

### Provenance, regeneration, rights

Every generated asset records brief, composed prompt, provider, model, parameters, timestamp, and the license terms the provider grants. `regenerate_media` keeps the brief and history and marks the slot pending again; a human's "regenerate, less corporate" note in the preview becomes a brief amendment. Exports include an assets manifest so a course can be audited for rights.

### Human decisions that remain

Sign off the style guide. Judge whether a given asset serves the block, in the preview, and say so. Approve the lesson. Nothing else.

---

## 9. Theme

One theme per course: tokens, per-shape presentation defaults, and the media style guide. Tokens compile to CSS custom properties; renderers consume only tokens. No raw CSS in v1; the surface is tokens plus whitelisted per-shape keys, which is what makes "retheme the course" a bounded call. `set_theme` runs WCAG AA contrast checks on text and background pairs.

**The course paints its own theme.** A theme declares `scheme: light | dark` and exactly one palette. The renderer never consults `prefers-color-scheme` for course content and exported courses do not switch palettes with the learner's OS: a learner sees one course, not two, and the author signed off on one. Only the validation client's chrome follows the viewer's OS setting. Presets that duplicate Rise 360's `rise`, `apex`, and `horizon` were measured from published Rise exports at M0 (`handoff.md` §4) and ship in `presets/`.

Tokens (M0 set; the mock in `spikes/03-validation-client-mock` exercises all of them):

| Group | Keys |
|---|---|
| `color` | `bg`, `surface`, `ink`, `muted`, `line`, `accent`, `accent_ink`, `accent_soft`, `pending`, `pending_soft` |
| `font` | `body`, `heading`, `ui`, `heading_weight`, `heading_scale`, `base_size`, `line_height` |
| `button` | `case`, `letter_spacing`, `weight`, `radius`, `size`, `nav: full \| floating` |
| `header` | `style: gray \| dark \| light`, `size: small \| medium \| large` (the lesson header) |
| `transition` | `preset: none \| wave \| layered \| curve \| slant \| arrow \| zigzag`, `amplitude`, `frequency` (the default seam wherever surfaces differ, §9a) |
| other | `radius`, `block_gap`, `density`, `content_width`, `card_top`, `angular`, `flourish`, `scheme` |

```json
{
  "preset": "default",
  "scheme": "light",
  "tokens": { "color": {…}, "font": { "body": "…", "heading": "…", "ui": "…", … }, "button": {…}, "header": {…}, "radius": "8px", "density": "comfortable", "content_width": "720px" },
  "shapes": { "passage": { "default_presentation": "paragraph" }, "collection": { "default_presentation": "accordion" } },
  "media_style": {
    "visual": { "mode": "illustration", "style": "flat vector, limited palette, soft shadows", "palette": "theme", "mood": "calm, competent", "avoid": "stock-photo smiles, clip art", "references": ["asset_id"] },
    "narration": { "voice": "provider voice id", "pace": "measured", "tone": "warm, plain" },
    "music": { "mood": "unobtrusive, optimistic", "instrumentation": "piano, light percussion", "when": "section openers only" },
    "video": { "motion": "slow, minimal", "text_overlay_safe_area": true }
  }
}
```

---

## 9a. Backdrops and transitions

Rise stacks every block on one white page. Two additions make grouping visible, and both are theme-driven so the agent rarely has to place anything by hand.

**Backdrops.** A lesson has a `background` and every `section` may have one: `none` (the lesson's), a token (`surface`, `accent_soft`, `accent`, `ink`), or an asset with an optional `tint`. A section with a background paints full-bleed behind all its blocks, and the renderer flips the text tokens inside dark sections (`accent`, `ink`, dark images) so contrast holds without per-block work. Because sections already carry the lesson's grouping, a section background is what makes that grouping visible.

**Transitions.** A transition is the **seam** between two surfaces of different color: the shaped edge where one ends and the next begins. It is never a shape on its own. Every colored surface has two edges, top and bottom, and the lesson header is a surface too. Where two neighbouring surfaces share a color there is no seam to draw.

Ownership: a boundary between a colored section and anything else belongs to the colored section (its `top` or `bottom` edge); a boundary between two colored sections belongs to the lower one's `top` edge; the header's bottom edge belongs to the header unless the first section is colored. The two colors are always **inherited** from the surfaces on either side; nobody sets them. When one side is an image, the seam masks it. This is what Mighty added to Rise as a manual Transition Block; in Aicumen it is automated at two levels and editable at a third:

- **Theme default.** `theme.transition: { preset, amplitude, frequency }` draws the seam at every boundary where colors differ. Every theme has one; `none` means hard edges everywhere.
- **Per section.** `section.options.transition` sets both of that section's edges.
- **Per edge.** `section.options.edges.top | .bottom` and `lesson.header.transition` override one seam: `{ preset, amplitude, frequency, flip }`, or `preset: none` for a hard edge. In the validation client every seam is selectable, hard edges included.

Presets: `wave`, `layered`, `curve`, `slant`, `arrow`, `zigzag`, `none`. The server offers these and validates their parameters; **which to use, and why, is the agent's decision**, like every other presentation choice. The authoring guide carries the guidance.

`amplitude` is the seam's half-height in pixels, `frequency` the number of crests across the width (waves and zigzag only). An explicit `add_separator { presentation: "transition" }` between two blocks covers the case Mighty covers: a seam between two image blocks with no section boundary.

---

## 10. Rendering, preview, export

- **Renderer is a pure function** `(course, theme) → { path: content }`. No I/O inside. `render_block`, `render_lesson`, and `render_auditions` return strings; `export_course` writes the map.
- **Export layout:** `index.html`, `lessons/<id>.html`, `assets/` (hashed, with manifest), `aicumen.css`, `aicumen.js` (only the behaviors the course uses, `block-model.md` §6).
- **Layout tree** renders through the five containers with their responsive rules. Pending media render as placeholders in preview and fail export unless `allow_pending: true`.
- **Accessibility baseline:** landmarks, heading order, required alt text, keyboard-operable behaviors, contrast checked at theme time.
- **Learner state:** `localStorage` only.
- **Preview** is the validation client (§7), live-reloading on every revision from either party.
- **Snapshot:** Playwright, optional install. The agent's eyes.

---

## 11. Import

None. Rise import was in earlier drafts and was dropped at M0 by the owner's decision. The block model's mapping tables from Rise and H5P remain as coverage arguments, not as import specifications.

---

## 12. Later

- SCORM 1.2 / 2004 wrapper and xAPI, attached at the `score` behavior.
- `compose_lesson` batch creation.
- Provider adapters for `generate_media`; a job queue for long generations.
- **Anchored notes to the agent**: select a block or part of one and talk to the agent about exactly that. Designed in `transcript-lesson-01.md` §3 (anchors with JSON-Pointer paths and quoted ranges, `create_feedback`, `list_feedback` with context, `reply_feedback`, `resolve_feedback`). Shelved after the mock review; the owner wants a more interesting version. Then threaded comments, multiple reviewers, reviewer roles.
- Dynamics: course variables, declarative triggers, entrance and item animations, narration cue points, and the `scene` shape for Storyline-style layered slides (`block-model.md` §6a and Appendix A). Variables, triggers, and animation are v1.x; `scene` follows.
- HTTP transport, multi-client workspaces.
- Localization as per-language lesson variants, with narration regenerated per language from the same briefs.

---

## 13. Repository

Node 22+, TypeScript, pnpm workspaces, ESM.

```
aicumen/
  packages/
    core/          course model, layout tree, store, revisions, validation (ajv), shape registry, transforms, feedback
    shapes/        one module per shape: schema, guidance, fit rules, presentations (template + behaviors)
    render/        theme compiler, media style composer, page templates, runtime behaviors, export, snapshot
    mcp/           MCP server: tool registration, resources, prompts, tools/list_changed
    preview/       the validation client (thin web UI over the MCP tools)
  presets/         theme presets including media style guides
  docs/            this spec, block-model.md, authoring guide (served as aicumen://guide)
```

Carried from the predecessor: the revision idea and the fail-closed tool discipline. Everything else is new.

---

## 14. Milestones

- **M0 — Design closure.** License (MIT, done). Platform research spikes 1 and 2 from `research-agenda.md` (done; results in that file). One lesson as a **transcript of tool calls** including media briefs and a validation round (`transcript-lesson-01.md`, done). Authoring guide drafted from it (`authoring-guide.md`, done). A **visual mock of the validation client** rendering the transcript lesson, for the owner to inspect and validate the block model and the review gestures (`spikes/03-validation-client-mock`, done). Repo scaffolded. Package-name claim deferred; not needed until release.
- **M1 — Core.** Layout tree, store, revisions, validation, the nine tier-1 shapes with schemas and presentations, structural transforms, golden-HTML tests.
- **M2 — Server.** Full §5 surface over stdio, resources, prompts, pending media and feedback queues. Exit: from a host with no filesystem access, build a three-lesson course with briefs, read it back, swap, reshape, resolve media, export.
- **M3 — Render and validate.** Theme compiler with media style, backdrops and transitions, export, the validation client with the block toolbar, swap, compare, reshape, lesson approval, and placeholders. Snapshot. Exit: a human reviews a lesson end to end without touching the agent for anything that is a matter of form.
- **M4 — Dogfood and release.** Author one real course from a lesson plan using only the tools and one generation service, run one validation round with a real reviewer, fix what hurt, release v0.1.

---

## 15. Decisions log

| Decision | Choice | Why |
|---|---|---|
| Interface | MCP tools only | the agent plans; Aicumen executes |
| Human surface | one validation client: a review pass with swap, compare, reshape, then lesson approval; no content editing, no per-block status | keeps one author of record; the reviewer fixes form and reports content |
| Anchored notes | shelved to §12 | the owner wants a better design before it ships |
| Backdrops and transitions | section and lesson backgrounds; transitions as a theme default with inherited colors | makes grouping visible; automates what Mighty added to Rise by hand |
| Level-1 swap | deterministic, in the server, exposed to humans directly | the most common review action should cost nothing |
| Level-2 swap | structural transforms in the server, judgment transforms via agent + `replace_block` | never apply a lossy or invented change silently |
| Media | briefs as first-class field values, pending queue, style guide in theme, prompt composition in server, generation outside it | course renders before assets exist; style decided once; server stays deterministic |
| Approved lesson | protected from silent change | a revision cannot quietly undo sign-off |
| Persistence | internal JSON, layout tree | state across calls; never an authoring surface |
| Rich text | inline subset, no HTML | agents write it reliably; renderer stays safe |
| Output | static site | no infrastructure; SCORM later |
| Rise 360 | no import, no export | dropped at M0; the tool calls are the only input |
| Stack | Node 22, TypeScript, pnpm | continuity; strongest MCP SDK |
| License | MIT | adoption; decided at M0 |

## 16. Open items

1. ~~License~~ Decided: MIT (M0).
2. Whether `narration: auto` on passages is on by default per course or opt-in per block.
3. Which generation kinds the dogfood in M4 must exercise. Recommendation: image and narration; video and soundtrack optional.
4. The `block-model.md` open questions remain open by choice.
