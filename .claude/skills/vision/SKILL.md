---
name: vision
description: Define the vision for a product or feature. Use when starting a new product, scoping a new feature, or when the user wants to clarify direction, goals, or success criteria before writing code.
argument-hint: [product or feature name]
---

Help the user define a clear, actionable vision for a product or feature. The goal is to produce a concise vision document that aligns intent, sets scope, and guides future decisions.

## Steps

Work through these areas interactively — ask focused questions, one topic at a time. Don't dump all questions at once.

1. **Problem statement** — What problem does this solve? Who has this problem? How do they deal with it today?
2. **Target users** — Who specifically is this for? What do they care about? What are their constraints?
3. **Core outcome** — What does success look like for the user? What changes in their life/workflow?
4. **Scope** — What is explicitly in scope? What is out of scope (be specific)?
5. **Success metrics** — How will you know it's working? What are the key signals?
6. **Constraints** — Technical, time, resource, or organisational constraints that will shape the solution.

## Output

Once you have enough to work with, produce a vision document using this structure:

```
# Vision: [Name]

## Problem
[1-2 sentences. What's broken, for whom, and why it matters.]

## Target users
[Who specifically. Avoid "everyone". Include a concrete example persona if helpful.]

## Outcome
[What the user can do or feel after this exists that they couldn't before.]

## Scope
**In:** [bullet list]
**Out:** [bullet list]

## Success metrics
[2-4 measurable signals. Prefer leading indicators over lagging ones.]

## Constraints
[Any known constraints that will shape the solution.]
```

Keep the document short — a vision statement should fit on one page. If it's longer, it's probably trying to do too much.

## Tone

Be direct. Push back if the scope is too vague or too large. A vision document that says "we'll do everything" is useless. Help the user make hard calls about what's in and what's out.

If `$ARGUMENTS` is provided, use it as the starting name/context for the product or feature being defined.
