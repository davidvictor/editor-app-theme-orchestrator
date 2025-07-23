# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monaco is a cyberpunk-themed tactical operations dashboard built with Next.js 15, React 19, and TypeScript. It simulates a command and control system with features for agent network management, operations tracking, intelligence analysis, and systems monitoring.

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

**Important**: The project uses pnpm 10.6.3 as the package manager. Always use pnpm instead of npm or yarn.

## Architecture & Key Patterns

### Application Structure
The app uses Next.js App Router with a single-page application pattern:
- Main layout in `app/layout.tsx` sets up global styling and metadata
- Navigation logic in `app/page.tsx` handles client-side routing between sections
- Each section (agent-network, operations, intelligence, systems) has its own page component

### Navigation Pattern
The application implements a custom navigation system:
- State-based routing without page refreshes
- Collapsible sidebar with mobile overlay support
- Active page tracking in `app/page.tsx:34-35`

### Component Organization
- **UI Components**: Located in `/components/ui/` using shadcn/ui library
- **Page Components**: Each route has a dedicated component returning the full page UI
- **Modal Pattern**: Detail views use Dialog components for expanded information

### Styling Approach
- Tailwind CSS with custom theme colors (primary orange: #f97316)
- Dark theme with monospace fonts for cyberpunk aesthetic
- Consistent status color coding across the app:
  - Green: Active/Online
  - Yellow: Warning/Standby
  - Red: Compromised/Offline
  - Blue: Training/Maintenance

### Data Management
Currently uses hardcoded mock data within components. When adding features:
- Follow existing data structure patterns (e.g., agent IDs like "G-078W")
- Maintain consistency with status types and classification levels
- Use TypeScript interfaces for data models when refactoring

## Build Configuration Notes

The project has specific build settings in `next.config.mjs`:
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Images unoptimized

These settings allow rapid prototyping but should be addressed before production deployment.

## Common Development Tasks

### Adding a New Section
1. Create new page component in `/app/[section-name]/page.tsx`
2. Add navigation entry in `app/page.tsx` navigation items array
3. Update the `renderPage()` function to include the new component
4. Follow existing page patterns for layout and styling

### Modifying UI Components
The project uses shadcn/ui components. When updating:
- Components are in `/components/ui/`
- Maintain dark theme compatibility
- Use existing color variables from CSS custom properties

### Working with the Monaco Editor
The project includes Monaco Editor integration. When implementing code editing features:
- Monaco configuration should match the cyberpunk theme
- Consider read-only mode for displaying code snippets
- Use appropriate language highlighting

## Deployment

The project is automatically deployed to Vercel and synced with v0.dev. Any commits to the main branch trigger automatic deployment.