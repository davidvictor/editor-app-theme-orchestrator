name: "Blue Sky PRP Template v3 - No Legacy, Pure Innovation"
description: |

## Purpose

Template for greenfield development where we build the RIGHT solution from scratch. Legacy code is dead weight. We don't enhance - we BUILD CORRECTLY THE FIRST TIME.

## Core Principles

1. **NO LEGACY TOLERANCE**: Completely ignore existing implementations if they're suboptimal
2. **BREAKING CHANGES ARE FEATURES**: If old code breaks, that's its problem
3. **BUILD RIGHT OR DON'T BUILD**: No "enhanced" versions, no backwards compatibility
4. **CLEAN SLATE THINKING**: Design as if nothing exists, then implement fearlessly
5. **VALIDATION THROUGH EXCELLENCE**: Tests prove correctness, not compatibility

---

## Goal

[What needs to be built - FROM SCRATCH. Describe the ideal end state without any legacy constraints]

## Why

- [Business value of doing it RIGHT this time]
- [Technical debt we're ELIMINATING forever]
- [Future possibilities this ENABLES by not dragging legacy]

## What

[The CORRECT implementation - how it SHOULD work, not how to "fix" what exists]

### Success Criteria

- [ ] Old implementation is COMPLETELY REPLACED
- [ ] Zero legacy code paths remain
- [ ] New design follows first principles
- [ ] Breaking changes are celebrated, not mitigated
- [ ] [Other specific measurable outcomes]

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

### STEP 1: DELETE THE OLD SHIT

Before building anything new, identify and mark for deletion:

- Legacy implementations that will be replaced
- Outdated interfaces that constrain proper design
- Compatibility shims and workarounds
- "Enhanced" versions of anything

### Data models and structure

Design the CORRECT data models from scratch. Zero consideration for existing schemas.

```
Build these fresh:
 - Database schemas - what SHOULD the data look like?
 - TypeScript interfaces - what's the IDEAL shape?
 - Validation schemas - what are the TRUE constraints?
 - Domain models - what's the PROPER abstraction?

IGNORE:
 - How data "used to be" stored
 - Existing field names if they're wrong
 - Legacy validation rules
 - Previous architectural mistakes
```

### Tasks: Build Right or Don't Build

```yaml
Task 1: DELETE LEGACY CODE
  - IDENTIFY all code that will be obsoleted
  - DELETE without mercy or regret
  - DO NOT create deprecation warnings
  - DO NOT maintain old endpoints

Task 2: CREATE CORRECT IMPLEMENTATION
  - DESIGN from first principles
  - BUILD the ideal solution
  - IGNORE how it "used to work"
  - NAME things properly (not based on legacy)

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
  - migration: 'DROP TABLE IF EXISTS legacy_users; CREATE TABLE users AS IT SHOULD BE'
  - philosophy: 'If the schema is wrong, fix it. Migration = deletion + recreation'
  - indexes: 'Design for the queries we SHOULD have, not the ones we inherited'

CONFIG:
  - principle: 'New config keys only. Old keys die with their code'
  - pattern: 'PROPER_FEATURE_NAME=value' (not LEGACY_FEATURE_V2)

ROUTES:
  - approach: 'Create new routes with correct REST/GraphQL patterns'
  - legacy: 'Old routes return 410 Gone. No redirects, no compatibility'
  - naming: '/api/v1/proper-resource' not '/api/legacy/enhanced-thing'
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

### Level 2: Unit Tests (Jest) - Follow 80% coverage requirement

```typescript
// CREATE __tests__/newFeature.test.ts OR newFeature.test.ts with these test cases
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { newFeature } from './newFeature'
import { ZodError } from 'zod'
import { externalApi } from './externalApi'

jest.mock('./externalApi')

describe('newFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle happy path', async () => {
    ;(externalApi.call as jest.Mock).mockResolvedValue({ ok: true })
    const result = await newFeature('valid_input')
    expect(result.status).toBe('success')
  })

  it('should handle validation error', async () => {
    await expect(newFeature('')).rejects.toBeInstanceOf(ZodError)
  })

  it('should handle external api timeout', async () => {
    ;(externalApi.call as jest.Mock).mockRejectedValue(new Error('Timeout'))
    const result = await newFeature('valid')
    expect(result.status).toBe('error')
    expect(result.message).toMatch(/timeout/i)
  })
})

// For React components:
describe('FeatureComponent', () => {
  it('should render and handle user interaction', async () => {
    const user = userEvent.setup()
    render(<FeatureComponent />)

    const button = screen.getByRole('button', { name: /submit/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

```bash
# Run and iterate until passing:
pnpm test newFeature.test.ts         # Run specific test file
pnpm test:watch                      # Run in watch mode for TDD
pnpm test:coverage                   # Check coverage (must be 80%+)

# If failing: Read error, understand root cause, fix code, re‑run
```

### Level 3: E2E Tests (Playwright)

```typescript
// CREATE e2e/feature.spec.ts for end-to-end testing
import { test, expect } from '@playwright/test'

test.describe('Feature E2E Tests', () => {
  test('should complete user journey', async ({ page }) => {
    await page.goto('/')

    // Navigate to feature
    await page.getByRole('link', { name: /feature/i }).click()

    // Fill form
    await page.getByLabel('Input field').fill('test value')
    await page.getByRole('button', { name: /submit/i }).click()

    // Verify success
    await expect(page.getByText(/success/i)).toBeVisible()
    await expect(page.getByTestId('result')).toContainText('expected result')
  })

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/feature')

    // Submit invalid data
    await page.getByRole('button', { name: /submit/i }).click()

    // Verify error handling
    await expect(page.getByRole('alert')).toContainText(/required field/i)
  })
})
```

```bash
# Run E2E tests (auto-starts dev server):
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:ui                 # Run with Playwright UI
pnpm test:e2e:headed             # Run with visible browser

# Debug specific test:
pnpm playwright test feature.spec.ts --debug
```

## Final validation Checklist

- [ ] All NEW tests pass (old tests are deleted): `pnpm test`
- [ ] Coverage meets 80% threshold: `pnpm test:coverage`
- [ ] All E2E tests reflect NEW behavior: `pnpm test:e2e`
- [ ] No linting errors: `pnpm lint`
- [ ] No type errors: `pnpm typecheck`
- [ ] ZERO legacy compatibility code remains
- [ ] No "enhanced" or "v2" naming anywhere
- [ ] Old implementations are DELETED, not deprecated
- [ ] Breaking changes are documented as FEATURES
- [ ] API responses use CORRECT structure (not legacy-compatible)

---

## CRITICAL: Blue Sky Development Rules

### ABSOLUTELY FORBIDDEN:

- ❌ **NEVER use "enhance" or "enhanced" in naming** - Build it right the first time
- ❌ **NEVER check legacy compatibility** - If old code breaks, delete it
- ❌ **NEVER preserve old interfaces** - Design the correct API from scratch
- ❌ **NEVER worry about migration paths** - Users adapt or stay behind
- ❌ **NEVER compromise design for backwards compatibility**
- ❌ **NEVER create wrapper functions for old behavior**

### MANDATORY PRACTICES:

- ✅ **DELETE AND REPLACE** - Don't refactor, rewrite
- ✅ **BREAK EVERYTHING NECESSARY** - Correctness over compatibility
- ✅ **DESIGN FROM FIRST PRINCIPLES** - Ignore how it "used to work"
- ✅ **ASSUME ZERO LEGACY USERS** - Build for the future only
- ✅ **CREATE IDEAL INTERFACES** - What SHOULD it be, not what it was

## Anti-Patterns to Avoid

- ❌ Don't create compatibility layers
- ❌ Don't preserve old naming conventions if they're wrong
- ❌ Don't keep deprecated features "just in case"
- ❌ Don't document migration paths - there are none
- ❌ Don't apologize for breaking changes
- ❌ Don't use sync functions in async context
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions - be specific
