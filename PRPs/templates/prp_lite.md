name: "Lite PRP Template v2 - Context-Rich with Validation Loops"
description: |

## Purpose

Template optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance

---

## Goal

[What needs to be built - be specific about the end state and desires]

## Why

- [Business value and user impact]
- [Integration with existing features]
- [Problems this solves and for whom]

## What

[User-visible behavior and technical requirements]

### Success Criteria

- [ ] [Specific measurable outcomes]

## All Needed Context

### Documentation & References (list all context needed to implement the feature)

```yaml
# MUST READ - Include these in your context window
- url: [Official API docs URL]
  why: [Specific sections/methods you'll need]

- file: [path/to/example.ts]
  why: [Pattern to follow, gotchas to avoid]

- doc: [Library documentation URL]
  section: [Specific section about common pitfalls]
  critical: [Key insight that prevents common errors]

- docfile: [PRPs/ai_docs/file.md]
  why: [docs that the user has pasted in to the project]
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash

```

### Known Gotchas of our codebase & Library Quirks

```
// CRITICAL: Next.js API routes must export a default async function
// Example: This ORM (Drizzle) limits batch inserts to 10k records
// Example: We use zod v3 for validation and inference
```

## Implementation Blueprint

### Data models and structure

Create the core data models, we ensure type safety and consistency.

```
Examples:
 - Drizzle schema models
 - TypeScript interfaces
 - zod schemas
 - zod refinements

```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1:
MODIFY src/existingModule.ts:
  - FIND pattern: "class OldImplementation"
  - INJECT after line containing "constructor("
  - PRESERVE existing method signatures

CREATE src/newFeature.ts:
  - MIRROR pattern from: src/similarFeature.ts
  - MODIFY class name and core logic
  - KEEP error handling pattern identical

...(...)

Task N:
...

```

### Per task pseudocode as needed added to each task

```

// Task 1
// Pseudocode with CRITICAL details; do not write entire code
export const newFeature = async (param: string): Promise<Result> => {
  // PATTERN: Always validate input first (see src/validators.ts)
  const validated = validateInput.parse(param) // throws ZodError

  // GOTCHA: Library requires connection pooling
  return db.$transaction(async (tx) => {
    // PATTERN: Use existing retry util
    const result = await retry(
      async () => {
        // CRITICAL: API returns 429 if >10 req/sec
        await rateLimiter.acquire()
        return externalApi.call(validated)
      },
      { attempts: 3, backoff: exponential },
    )

    // PATTERN: Standardized response format
    return formatResponse(result) // see src/utils/responses.ts
  })
}
```

### Integration Points

```yaml
DATABASE:
  - migration: 'ALTER TABLE users ADD COLUMN featureEnabled BOOLEAN'
  - index: 'CREATE INDEX idx_feature_lookup ON users(featureId)'

CONFIG:
  - add to: .env
  - pattern: 'FEATURE_TIMEOUT=30'

ROUTES:
  - add to: src/pages/api/feature.ts
  - pattern: 'export default handler'
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
pnpm lint                         # Check linting (Prettier)
pnpm format                       # Auto-fix formatting
pnpm typecheck                    # Type checking

# Expected: No errors. If errors, READ the error and fix.
```

## Final validation Checklist

- [ ] No linting errors: `pnpm lint`
- [ ] No type errors: `pnpm typecheck`
- [ ] Error cases handled gracefully
- [ ] Logs are informative but not verbose
- [ ] Documentation updated if needed

---

## Anti-Patterns to Avoid

- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore failing tests - fix them
- ❌ Don't use sync functions in async context
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions - be specific
