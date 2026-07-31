# Claude Skills: a practical guide

A guide to writing, improving, and running Claude Code skills — plus some skill ideas we actually use at Golden Analytics. 

**Follow along:** this repo has a few merged PRs and a deliberately out-of-date `CLAUDE.md`. The skill we build in Part 3 has real gaps to find in it, so you can run the whole exercise end to end in about ten minutes.

---

## Part 1 — What a skill is

**A skill is a markdown file that tells Claude how you want a particular job done.** It's a name, a description, and a procedure in plain language.

```markdown
---
name: whats-new-movie
description: Produce a narrated "What's New" demo video of recent production releases — storyboard from PR test plans, record real-app footage with Playwright, cut and narrate it. Human-driven; run when the user asks for a what's-new video / release movie / demo reel.
---

# whats-new-movie

...the procedure, in prose and numbered steps...
```

It's also a useful first example because of what it isn't: this is not a shortcut for a shell command. It's a multi-step job with judgment in it.

## Where it lives determines who gets it

| Location                           | Who has it                                                        |
| ---------------------------------- | ----------------------------------------------------------------- |
| `.claude/skills/<name>/SKILL.md`   | Checked into the repo — the whole team gets it on their next pull |
| `~/.claude/skills/<name>/SKILL.md` | Just you, across every project                                    |
| `.claude/commands/<name>.md`       | Checked in, invoked explicitly as `/<name>`                       |
| `~/.claude/commands/<name>.md`     | Just you, invoked explicitly                                      |

**One directory per skill.** A `SKILL.md` sitting at the top of `.claude/skills/` will be silently ignored.

## The description is the API

The `description` is the only part Claude reads when deciding whether to use skill.

So write it as **what it does, plus when to use it, plus the words a person would actually say:**

> Produce a narrated "What's New" demo video of recent production releases... **run when the user asks for a what's-new video / release movie / demo reel.**

Those trigger phrases are important--a skill described as generic "video helper" never fires, and you never find out why. Say the words your team would actually say.

## Skills vs. slash commands

**Claude can invoke a command on its own.** Commands carry a `description` too, so they're offered to the model the same way skills are.

|                                   | Command                      | Skill                                    |
| --------------------------------- | ---------------------------- | ---------------------------------------- |
| Lives in                          | `.claude/commands/<name>.md` | `.claude/skills/<name>/SKILL.md`         |
| Named by                          | its filename                 | a `name` in the frontmatter              |
| Shows up as `/<name>`             | yes                          | yes                                      |
| Claude can pick it itself         | yes                          | yes                                      |
| Can bundle extra files next to it | no, single file              | yes — scripts, templates, reference docs |

A skill is a _directory_, so you can add extra stuff beside it.

Either way, write the description as though Claude will be the one deciding.

---

## Part 2 — What CLAUDE.md is

**A skill is a procedure. CLAUDE.md is knowledge.** It's the standing context: things that are true about this codebase regardless of what you asked for.

[CLAUDE.md files](https://code.claude.com/docs/en/overview) cascade by directory — root, then app, then package, then the specific folder Claude is working in.

## What belongs in it

The good entries are all scar tissue. They read like this:

> The `pnpm.overrides` for `uuid` is split on purpose — do not collapse it. Removing the scoped line re-breaks all serverless xlsx parsing.

> React #185 blames whichever setState lands on the 51st nested update — usually an innocent bystander, NOT the loop's driver.

Neither is derivable from reading the code. **That's the test:** if someone could figure it out by reading the file they're already in, it doesn't belong here.

What doesn't belong: anything the code already says, and anything specific to one feature. CLAUDE.md is for conventions that span features.

## And here's the problem

**These files rot.** We swapped Prettier for oxfmt. We moved from ESLint to oxlint. We extracted four shared packages. Every one of those was a chance for Claude to confidently do the wrong thing, because our CLAUDE.md files were out of date.

---

## Part 3 — Building a skill, without writing any code

You are not programming. You are briefing someone competent.

## The four things you tell Claude

1. **The job, in one sentence.** What it's for and when to use it.
2. **The steps, in plain language.** In the order you'd do them yourself.
3. **The guardrails.** What it must not do without asking.
4. **What "done" looks like.** What you want to be holding at the end.

Then: _"Write that up as a skill."_

## Example: keep CLAUDE.md up to date

Give claude the steps, exactly as you'd say them out loud:

1. Gather the PRs that merged in the past week
2. Read all of our CLAUDE.md files
3. Identify gaps between our CLAUDE.md files and the code
4. Be sure those gaps aren't already documented
5. Propose the changes to me

The guardrails: **don't edit anything.** Propose, then wait. Getting approval to make the edits is not approval to push them.

## What to actually type

```
Write me a skill called `claude-on-claude`. Its job: every week, compare what actually merged against what our CLAUDE.md files say, and propose edits where the docs no longer match reality.
Steps: 
1. Gather the PRs that merged in the past week
2. Read all of our CLAUDE.md files
3. Identify gaps between our CLAUDE.md files and the code
4. Be sure those gaps aren't already documented
5. Propose the changes to me

It must not edit, commit, or push anything without my approval. Ask me for anything you need before writing it.
```

That's it. That's the skill-creation step.

Claude will fill in the mechanics: which git commands, how to grep the docs, etc. Those are the parts you'd have gotten wrong anyway, and the parts you'd rather not maintain.

---

## Part 4 — Iterating on a skill after it runs

**The loop:**

- **Run it**
- **Watch where it goes wrong**
- **Write that back into the skill**

## The phrase to use

After a run, say:

> **What did this run teach you that isn't written down in the skill yet? Propose edits.**

That wording does two things on purpose: it points at the **gap** rather than asking for generic improvement, and it asks for **proposals** rather than letting Claude rewrite the file out from under you. Claude's list of things that went wrong will often surprise you.

When something specific went wrong, be specific instead:

> **You got the format check wrong in the worktree. Fix the skill so the next run doesn't hit that.**

Then read the diff and edit it yourself if you disagree. It's just a markdown file.

---

## Part 5 — Running it on a schedule

Two mechanisms:

- **`/schedule`** — a cron-triggered run that happens whether or not you're at your desk. Like the weekly docs audit, or a daily backlog sweep.
- **`/loop`** — a recurring run inside a live session, on an interval or self-paced. Right for watching something in flight: a deploy, a CI run, a PR.

**Choosing:** is there a human in the room? If yes, `/loop`. If it should happen anyway, `/schedule`.

The [Anthropic docs provide a number of solutions for running things on a schedule](https://code.claude.com/docs/en/scheduled-tasks).

---

## Part 6 — Nine skills we actually use

"Steal these."

Each entry lists what you say, what goes in, what comes out, and the steps it runs — so the step list doubles as the outline you can hand Claude to build your own version for your codebase.

## `preflight`

**Input:** your working tree. 

**Outputs:** a green suite, or minimal fixes applied and a report of what it took.

**Steps:**

1. Run the full pre-checkin suite once: build, lint, types, tests
2. Fix minimally and re-run until everything passes. Fix the formatting first, then lint, types, tests
3. Stop and ask before doing any fix bigger than a few lines
4. Report back to me

## `i-just-pulled`

**Input:** a freshly pulled or rebased branch. 

**Output:** dependencies, environment, database, and servers all consistent with the code you just pulled.

**Steps:**

1. Link and sync the environment: follow our README.md steps for what to do after a sync.
2. Bring the local database up to the new migrations
3. Check for stale dev servers still running the old code
4. Tell me if I need to kill or restart anything

## `rebase-main`

**Input:** your feature branch

**Output:** your feature branch rebased onto main

**Steps:**

1. Make sure the branch is ready to rebase
2. Capture the pre-rebase state
3. Rebase onto origin/main
4. Resolve any conflicts
5. **Verify the diff is preserved** — compare against what you captured in step 2
6. Run `/i-just-pulled`
7. Run `/preflight`

## `babysit-pr`

**Input:** a live PR

**Output:** CI green, review bot concerns addressed, testers added

**Steps:**

1. Given a github PR URL, find my local worktree for it
2. If a robot comments on the PR, make any fixes needed, unless they're complex or involve product decisions.
3. Check to see if the PR is green
4. Add the human approvers that I specify
5. Optionally keep watching for new comments
6. Final summary

## `claim-my-issues`

**Inputs:** your bug tracking system MCP, your commit history, and your stated preferences

**Output:** a ranked, tiered shortlist of bugs with links

**Steps:**

1. From my PRs, build a profile of what I've actually shipped
2. Pull the entire unassigned backlog
3. Ask me what I like to work on
4. Score every candidate bug against my profile and my preferences
5. Show me a tiered shortlist of bugs, with links

## `dual-thermo-review`

**Inputs:** your current branch, access to claude + codex

**Outputs:** merged findings from two independent reviewers, triaged, with the worthwhile ones fixed.

**Steps:**

1. Have separate instances of claude and codex both review my code in parallel — one background Claude, one headless Codex.
2. Merge, triage, and verify the findings in your main session
3. Fix the obvious issues, and ask me what to do about the complex ones.

**Pro Tip:** The Cursor team released their [Thermo-Nuclear Code Quality Review](https://github.com/cursor/plugins/blob/main/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md); consider merging its ideas with your own code review prompt.

## `replay-audit`

**Input:** your event tracker [MCP](https://code.claude.com/docs/en/mcp-quickstart), your bug tracking MCP, your server logs MCP, your internal info MCP

**Output:** a written report: per-user session journeys, per-incident write-ups, links to the evidence, and cross-references to existing tickets.

**Steps:**

1. Pre-flight: check every data source is reachable before starting
2. Discover user sessions, events, and log anomalies
3. Group the data into users and incidents
4. Write up each incident with its evidence, to our internal info
5. Cross-reference issues against existing bugs
6. Propose additional bugs to file, along with comments to add to existing bugs

Consider asking "What was the user trying to do, and could they accomplish it?"

## `fix-bug`

**Input:** your bug tracking MCP, claude-in-chrome, github access

**Output:** a first pass at a bug fix

**Steps:**

1. Read the provided bug number in our bug tracker
2. Ask me if I have any additional context
3. Check out origin/main in a new worktree + branch
4. Fix the bug, or implement the feature
5. Start a server, and use chrome to test the bug/feature
6. Create tests for the bug/feature
7. Generate some concise PR notes
8. Push to origin and create a PR

## `whats-new-movie`

**Input:** your code history, Playwright, Remotion, ElevenLabs

**Output:** a narrated video of your app, highlighting the week's changes

**Steps:**

1. Check prerequisites
2. Gather the PRs from the past week
3. Ask me to confirm which features should make the list
4. Create the script, using the user testing steps from each PR
5. Record a separate movie for each feature by driving the real app
6. Generate narration via Eleven Labs
7. Stitch together the movie using Remotion

This skill will take the most iterating, and likely won't be 100% on the first try. But it's a start!

---

## Appendix — a template to start from

Copy this, fill it in, hand it to Claude:

```
Write me a skill called <name>.

Its job: <one sentence — what it does and when I'd want it>

Steps:
1. <first thing you'd do>
2. <next thing>
3. ...

It must not <the thing you'd hate> without asking me first.

When it's done I should have: <what you're holding at the end>
```

**Then:** run it on something real, watch where it goes wrong, and say _"what did this run teach you that isn't written down in the skill yet? Propose edits."_
