# Create NO-LEGACY PRP

## Feature: $ARGUMENTS

Generate a BLUE SKY PRP for building features RIGHT THE FIRST TIME. No legacy tolerance. No backwards compatibility. Just the CORRECT implementation from scratch.

The AI agent gets your PRP context and has codebase access. Include research that helps build the IDEAL solution, not patches for old shit. The Agent has Websearch - give it docs for the RIGHT way to build.

## Research Process

1. **Legacy Identification**

   - Find ALL code that will be DELETED
   - Identify outdated patterns to AVOID
   - Mark interfaces that need COMPLETE REPLACEMENT
   - NO consideration for migration paths

2. **First Principles Research**

   - How SHOULD this feature work ideally?
   - Latest best practices (ignore legacy constraints)
   - Modern library approaches (not workarounds)
   - The RIGHT architecture (not the patched one)

3. **User Clarification** (if needed)
   - What legacy code can we DELETE?
   - Are you ready for BREAKING CHANGES?
   - Confirm: BUILD RIGHT OR DON'T BUILD

## PRP Generation

Using PRPs/templates/prp_base_no_legacy.md as template:

### Critical Context to Include and pass to the AI agent as part of the PRP

- **Delete List**: Exact files/functions to REMOVE
- **Correct Approach**: How it SHOULD work (not how it does)
- **Modern Docs**: Latest patterns, ignore legacy
- **Breaking Changes**: List them as IMPROVEMENTS

### Implementation Blueprint

- Task 1: DELETE all legacy implementations
- Task 2: Design the CORRECT architecture from scratch
- Task 3: Build without ANY backwards compatibility
- Task 4: Break everything that depends on old behavior
- NO enhanced versions, NO migration helpers

### Validation Gates (Must be Executable)

```bash
# TypeScript/Linting
pnpm typecheck && pnpm lint

# Unit Tests
pnpm test

```

**_ CRITICAL AFTER YOU ARE DONE RESEARCHING AND EXPLORING THE CODEBASE BEFORE YOU START WRITING THE PRP _**

**_ ULTRATHINK ABOUT THE PRP AND PLAN YOUR APPROACH THEN START WRITING THE PRP _**

## Output

Save as: `PRPs/{feature-name}.md`

## Quality Checklist

- [ ] Legacy code marked for DELETION
- [ ] ZERO backwards compatibility included
- [ ] NO "enhanced" or "v2" naming
- [ ] Breaking changes documented as FEATURES
- [ ] Build from FIRST PRINCIPLES only
- [ ] Tests validate CORRECTNESS not compatibility

Score: 1-10 (How CLEAN is this break from legacy?)

Remember: BUILD IT RIGHT OR DON'T BUILD IT AT ALL.
