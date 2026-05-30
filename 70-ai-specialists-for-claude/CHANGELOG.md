# Changelog

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
