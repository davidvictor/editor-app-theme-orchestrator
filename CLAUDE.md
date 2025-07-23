# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monaco is a cyberpunk-themed tactical operations dashboard built with Next.js 15.2.4 and React 19. It's a v0.dev-generated project that simulates a command and control system. The project auto-syncs with v0.dev and deploys to Vercel.

## Development Commands

```bash
# Install dependencies (requires pnpm 10.6.3)
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

## Architecture & Key Patterns

### Navigation System

The app uses a custom single-page navigation pattern implemented in `app/page.tsx`:

- State-based routing without page refreshes (`currentPage` state at line 34)
- Sidebar navigation with collapsible functionality
- Mobile-responsive with overlay support
- Pages: command-center, agent-network, operations, intelligence, systems

### Component Architecture

- **Page Components**: Each section has its own page component in `/app/[section]/page.tsx`
- **UI Library**: Extensive use of shadcn/ui components (located in `/components/ui/`)
- **Client Components**: All interactive pages use "use client" directive
- **Modal Pattern**: Detail views use Dialog components for agent/operation details

### Data Management

Currently uses hardcoded mock data within components:

- Agent IDs follow pattern: "G-XXXW" (e.g., "G-078W")
- Operation IDs: "OP-[NAME]-XXX" (e.g., "OP-OMEGA-001")
- Status types: active, standby, compromised, training (agents); active, planning, completed, compromised (operations)

### Styling System

- Tailwind CSS with cyberpunk theme
- Color scheme: Dark backgrounds with orange accent (#f97316)
- Status color coding:
  - Green (#10b981): Active/Online
  - Yellow (#eab308): Warning/Standby
  - Red (#ef4444): Compromised/Offline
  - Blue (#3b82f6): Training/Maintenance
- Monospace font for data display
- Custom animations: pulse effects, transitions

### Build Configuration

Important settings in `next.config.mjs`:

- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Images unoptimized

## Key Implementation Details

### Adding New Dashboard Sections

1. Create page component in `/app/[section-name]/page.tsx`
2. Add navigation item to `navigationItems` array in `app/page.tsx:59`
3. Update `renderPage()` function in `app/page.tsx:257` to include new component
4. Follow existing patterns for layout and card-based design

### Working with Components

- All shadcn/ui components are pre-configured in `/components/ui/`
- Use existing color variables and maintain dark theme compatibility
- Follow the card-based layout pattern seen in existing pages

### Monaco Editor Integration

The project includes Monaco Editor for potential code editing features. When implementing:

- Package: @monaco-editor/react (4.7.0-rc.0)
- Ensure theme matches cyberpunk aesthetic
- Consider read-only mode for code display

## Project-Specific Patterns

### Mock Data Structure

When adding new features, maintain consistency with existing data patterns:

- Timestamps: ISO format (e.g., "2024-01-15T09:23:00")
- Classification levels: TOP SECRET, SECRET, CONFIDENTIAL, UNCLASSIFIED
- Agent specializations: Infiltration, Cyber Warfare, Extraction, Surveillance, Combat
- System types: MAINFRAME, FIREWALL, DATABASE, COMMS, AI_CORE

### Component State Management

- Local state with useState hooks
- No global state management library
- Search/filter functionality implemented locally in each page
- Modal state management using boolean flags

## Deployment

The project automatically syncs with v0.dev and deploys to Vercel. Changes made in v0.dev are pushed to this repository automatically.
