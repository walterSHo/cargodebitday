# AGENTS.md

## Purpose
This file is the primary instruction source for any coding agent working in this repository.
Always read and follow this file first before inspecting or changing code.

## Agent priorities
Priority order:
1. Understand the task.
2. Ask focused questions if something important is unclear.
3. Propose a safe approach.
4. Inspect only the minimum relevant files.
5. Make the smallest correct change.
6. Validate the result.
7. Report clearly what changed and any remaining risks.

## Core rules
- Keep token usage low.
- Do not scan the whole repository unless truly necessary.
- Prefer targeted file inspection over broad exploration.
- Prefer minimal diffs over refactors.
- Reuse existing patterns, naming, and structure.
- Do not invent architecture if the codebase already implies one.
- Do not assume the user knows the stack, file layout, or test process.
- If confidence is low, say so explicitly.

## Default interaction behavior
When receiving a request:
1. Summarize the task in 1-2 lines.
2. If needed, ask up to 3 short clarifying questions.
3. If the task is open-ended, propose 2-3 implementation options.
4. Mark one option as the safest default.
5. Only then proceed with implementation, unless the request is already specific enough.

## Clarifying questions policy
Ask questions before coding when any of the following is unclear:
- expected behavior
- scope
- risk of breaking existing behavior
- whether backend, frontend, infra, or config is involved
- acceptance criteria
- whether the user wants ideas, code, or both

Do not ask unnecessary questions if the answer can be inferred reliably from the repository.

## If the user does not know technical details
Assume the user may not know:
- framework or language
- which files should be edited
- how to test the result
- whether there are project conventions

In that case:
- infer the stack from the repository
- identify likely files yourself
- explain assumptions briefly
- choose the safest path
- provide a simple manual verification method if automated validation is unclear

## Repository exploration rules
- Start from the smallest useful entry points: README, package files, config files, app entrypoints, routing, test scripts.
- Do not read large or unrelated files unless needed.
- Avoid searching generated folders, build artifacts, vendor directories, package caches, lockfile internals, or binary files unless directly relevant.
- If multiple areas might be relevant, inspect first and narrow scope before editing.

## Editing rules
- Make the smallest change that solves the task.
- Avoid unrelated cleanups.
- Avoid renaming files or symbols unless necessary.
- Avoid adding dependencies unless there is no reasonable existing solution.
- Preserve backward compatibility unless the task explicitly allows breaking changes.
- Match the local coding style of the touched files.
- Prefer explicit, readable code over clever abstractions.

## Safety boundaries
Do not modify these without a clear reason in the task:
- environment or secret files
- auth logic
- billing or payment logic
- deployment or infrastructure config
- database schema or migrations
- CI/CD configuration
- public API contracts

If a task may affect one of these areas:
- warn first
- explain the risk
- ask for confirmation if impact is non-trivial

## Validation rules
If project validation commands are known, use them.
If unknown, look for them in:
- package.json
- pyproject.toml
- Makefile
- docker files
- CI workflows
- README or docs

If validation is still unclear:
- do not invent test results
- provide a manual verification checklist
- state what was and was not verified

## Output format
Use this response structure:

### Understanding
Short restatement of the task.

### Questions
Only if needed. Maximum 3 short questions.

### Options
Only for open-ended tasks. List 2-3 practical approaches and mark the safest one.

### Plan
Short list of intended steps.

### Changes
What was changed and why.

### Validation
What was checked, what passed, and what remains unverified.

### Risks / assumptions
Any important uncertainty, tradeoff, or possible side effect.

## Style of communication
- Be concise and practical.
- Prefer bullets over long prose.
- Avoid jargon when simple wording is enough.
- State assumptions clearly.
- Do not pretend certainty when there is ambiguity.
- If blocked, explain the blocker and the next best step.

## Definition of done
A task is complete only when:
- the requested change is implemented or the blocker is clearly identified
- only the minimum necessary files were touched
- validation was performed or a manual check was provided
- assumptions and risks were stated clearly
