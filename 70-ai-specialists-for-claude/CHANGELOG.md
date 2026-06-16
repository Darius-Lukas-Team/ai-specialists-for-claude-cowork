# Changelog

## 2.1.3

### Added — Business Profile persists across sessions
- The Business Profile is now saved to and read from **multiple locations**, fixing the Claude desktop app (Cowork) issue where a profile saved in one session was invisible in the next (each Cowork session is sandboxed and cannot reach `~/.claude`). Locations, in priority order on a tie: the connected project folder (`./ai-specialists/business-profile.md`, primary), the plugin's `userConfig.businessProfile`, a sentinel-wrapped block in Claude **Project** knowledge / context, and the legacy `~/.claude/...` path.
- **Conflict resolution:** when complete profiles exist in more than one place and differ, the one with the **newest `updated:` date wins**; the gate then re-syncs it back to the other writable locations so they converge. Edit a profile by hand → bump `updated:`.
- All five entry skills (`/start-70`, `/ai-helper`, `/ai-helpers`, `/ai-specialist`, `/ai-specialists`) now run this gather → resolve → re-sync gate on every invocation. `/start-70` saves to every writable location and prints a paste-into-Project block.
- New `userConfig.businessProfile` field and sentinel markers (`<<<AI-SPECIALISTS BUSINESS PROFILE>>>`) around the profile template.

### Changed — response formatting
- **Every skill now breaks prose into short, scannable paragraphs** — a blank line after each long sentence or every two short sentences — instead of replying with walls of text. Applies to prose only (not tables, code, or list items).

## 2.1.2

### Removed
- **`SessionStart` hook** (`hooks/hooks.json` + `hooks/session_start.js`) and the `hooks` key in `plugin.json`. Plugin hooks do not fire in the Claude desktop app (Cowork) — the suite's only environment — so the hook was dead weight and a source of confusion. The First-Run Experience and profile personalisation now work entirely inside the skills.

### Changed
- **All five entry skills now behave identically** (`/start-70`, `/ai-helper`, `/ai-helpers`, `/ai-specialist`, `/ai-specialists`). Each one reads the Business Profile from `~/.claude/ai-specialists/business-profile.md` at invocation: if setup is missing or `status: in-progress`, it runs the full First-Run Experience; if `status: complete`, it routes straight to the right specialist(s) and delivers the work.
- `/start-70` now **routes to a specialist when the profile is already complete**, instead of only confirming the profile and offering an update.
- `shared/skill-guidelines.md` now instructs every specialist to **read the profile from disk** (rather than expecting it injected into context at session start), so directly-invoked specialists also personalise from a saved profile.

## 2.1.1

### Added
- **`/ai-helpers` and `/ai-specialists` routers** — plural-named aliases of the existing `/ai-helper` and `/ai-specialist` smart routers, so the suite responds whichever spelling a user types. Both are registered in the marketplace listing.

### Changed
- Version bumped to `2.1.1` in both the plugin manifest and marketplace listing.

## 2.1.0

### Added — First-Run Experience (FRE)
- **`/start-70` skill** — a guided first-run flow: a short welcome, five onboarding questions (one at a time), then three outputs in order — one finished, ready-to-use deliverable, a one-page 14-day roadmap naming which specialists to use and in what order, and a saved, reusable Business Profile.
- **Business Profile** — saved locally to `~/.claude/ai-specialists/business-profile.md` (created on first run, never committed, never uploaded). Every specialist reads it to personalise output without re-asking. Template lives at `shared/business-profile-template.md`.
- **`SessionStart` hook** (`hooks/hooks.json` + `hooks/session_start.js`, dependency-free Node) — on first run with no profile it prompts Claude to launch `/start-70`; on later runs it injects the saved profile into context. Fails open: it never blocks or errors a session.
- **`## Business Profile`** section added to `shared/skill-guidelines.md`, plus a one-line reinforcement appended to every specialist's `## Rules` block, so all 73 skills honour the profile.

### Changed
- `ai-helper` and `ai-specialist` now offer `/start-70` first when no profile exists and the request is substantial — never forced.
- Version bumped to `2.1.0` in both the plugin manifest and marketplace listing.

### Known limitation
- **Plugin hooks run in Claude Code / VS Code, not in the Claude desktop app (Cowork).** The `SessionStart` auto-launch therefore fires during development in VS Code but not for customers who install via ZIP upload. For those customers the FRE is reached via the `/start-70` skill description (and the router offer) rather than auto-launch — type `/start-70` or ask "how do I start". The Business Profile, roadmap, and reinforcement all work in both environments.
