# ADR 001 — Schemas for public interfaces live in `@dashi/schema`

**Date:** 2026-04-18

Any Zod schema (and its inferred TypeScript type) that describes a data shape crossing a package boundary belongs in `@dashi/schema`. Packages import from there; they do not define their own copies.

**Why:** Single source of truth for all data contracts. Avoids duplication and drift across packages.
