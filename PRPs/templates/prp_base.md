name: "Base PRP Template v2 - Context-Rich with Validation Loops"
description: |

## Purpose

Template optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
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

- [ ] All unit tests pass: `pnpm test`
- [ ] Coverage meets 80% threshold: `pnpm test:coverage`
- [ ] All E2E tests pass: `pnpm test:e2e`
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
