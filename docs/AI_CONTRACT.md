# AI CONTRACT — BARBER AGENDA PROJECT

## Purpose
This document defines how AI assistants (Copilot, Codex, etc.)
must behave when working on this codebase.

The AI is an IMPLEMENTER, not an architect.

---

## Roles
- AI: Implementer
- Human: Architect and final approver

---

## Non-Negotiable Rules
- Do NOT expand scope.
- Edit ONLY files explicitly listed per step.
- Do NOT add new libraries unless approved.
- Do NOT refactor unless explicitly requested.
- Use descriptive variable and function names (no abbreviations).
- All user-facing UI text must be in English.

---

## Workflow
- One objective per step.
- Stop after completing a step.
- Wait for approval before continuing.
- If something is unclear, ask before changing code.

---

## Quality Gate
- Build/run must pass after each step.
- No behavior change unless explicitly stated.

---

## Confirmation Protocol
When this contract is referenced, the AI must acknowledge it
before performing any action.
