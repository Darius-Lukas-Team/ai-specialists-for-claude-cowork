#!/usr/bin/env node
/*
 * SessionStart hook for the AI Specialists For Claude plugin.
 *
 * On every session start it either:
 *   - first run / onboarding not finished -> tells Claude to run the /start-70
 *     First-Run Experience, or
 *   - onboarding complete -> injects the saved Business Profile so every specialist
 *     is personalised without re-asking.
 *
 * Mechanism: SessionStart adds the hook's stdout to Claude's context automatically,
 * so we just print plain text and exit 0. It must NEVER block or error the session,
 * so everything is wrapped in try/catch and any failure exits 0 silently.
 *
 * Note: plugin hooks run in Claude Code (CLI / VS Code). They do not currently fire
 * in the Claude desktop app ("Cowork"), where the /start-70 skill is reached via
 * its description or the router offer instead. This hook is therefore a no-op there
 * and never interferes.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

try {
  const profilePath = path.join(os.homedir(), '.claude', 'ai-specialists', 'business-profile.md');

  let contents = null;
  try {
    contents = fs.readFileSync(profilePath, 'utf8');
  } catch (e) {
    contents = null; // missing file or unreadable dir -> treat as first run
  }

  const isComplete = contents !== null && /^\s*status:\s*complete\b/im.test(contents);

  if (isComplete) {
    process.stdout.write(
      'USER BUSINESS PROFILE (use for all personalisation; never re-ask for this info):\n\n' +
      contents.trim() + '\n'
    );
  } else {
    process.stdout.write(
      'FIRST RUN: This user has not completed onboarding. Before doing anything else, run the ' +
      '/start-70 First-Run Experience — greet them, explain the value in one short paragraph, ' +
      'then ask the 5 onboarding questions one at a time. Do not skip this unless the user ' +
      'explicitly declines.\n'
    );
  }
} catch (e) {
  // Never break the session.
}

process.exit(0);
