# Fichron Monorepo Setup

This document describes the monorepo structure and setup for the Fichron project.

## Overview

Fichron is a pnpm monorepo containing a Svelte + TypeScript web application with shared packages for reusability across future platforms (like NativeScript mobile apps).

## Monorepo Structure

```
fichron/
├── apps/                           # Application packages
│   └── web/                        # Main web application (Svelte + Vite)
├── packages/                       # Shared packages
│   ├── types/                      # TypeScript type definitions
│   ├── core/                       # Core business logic (YAML parsing, filtering)
│   └── ui/                         # Reusable Svelte components
├── pnpm-workspace.yaml             # Workspace configuration
├── package.json                    # Root package with scripts
└── tsconfig.json                   # Root TypeScript config
```

## Packages

### `@fichron/types`

**Location**: `packages/types/`

Shared TypeScript type definitions used across all packages.

**Key Types**:
- `TimelineEntry` - Represents a single entry in a timeline
- `SagaTimeline` - Represents a complete saga/timeline file
- `FilterCriteria` - Filter configuration
- `FieldDiscovery` - Auto-discovered fields from YAML

**Exports**: All types via `src/index.ts`

### `@fichron/core`

**Location**: `packages/core/`

Core business logic for parsing YAML files and filtering timelines.

**Key Modules**:
- `parser.ts` - YAML parsing with js-yaml
- `filter.ts` - Timeline filtering and sorting engine
- `discovery.ts` - Auto-discovery of fields from YAML data

**Dependencies**:
- `js-yaml` - YAML parsing
- `@fichron/types` - Type definitions

**Exports**: All modules via `src/index.ts`

### `@fichron/ui`

**Location**: `packages/ui/`

Reusable Svelte 5 components designed for both web and mobile.

**Components**:
- `Button.svelte` - Styled button with variants
- `Card.svelte` - Container card component
- `TimelineItem.svelte` - Displays a single timeline entry
- `FilterPanel.svelte` - Complete filtering interface

**Dependencies**:
- `svelte` (peer dependency)
- `@fichron/types` - Type definitions

**Exports**: All components via `src/index.ts`

### `web` app

**Location**: `apps/web/`

Main Svelte web application built with Vite.

**Structure**:
- `src/App.svelte` - Main application component
- `src/main.ts` - Entry point
- `src/app.css` - Global styles
- `public/data/` - YAML timeline files (mcu/, dcu/)

**Dependencies**:
- All `@fichron/*` packages
- `svelte` - UI framework
- `vite` - Build tool
- `@sveltejs/vite-plugin-svelte` - Vite plugin

**Configuration**:
- `vite.config.ts` - Vite configuration with aliases
- `tsconfig.json` - TypeScript config with path mappings
- `svelte.config.js` - Svelte preprocessing

## Data Structure

YAML timeline files are located in `apps/web/public/data/` organized by universe:

```
public/data/
├── mcu/                            # Marvel Cinematic Universe
│   ├── 01-infinity_saga.yaml
│   ├── 02-multiverse_saga.yaml
│   ├── 03-spiderverse_saga.yaml
│   ├── 04-mutant_saga.yaml
│   ├── character/prime/            # Character timelines
│   ├── movie/                      # Individual movies
│   └── misc/                       # Miscellaneous
└── dcu/                            # DC Universe
    ├── 01-snyderverse.yaml
    ├── 02-arrowverse.yaml
    ├── 03-dcamu.yaml
    └── 04-gods-and-monsters.yaml
```

## Development Workflow

### Installation

```bash
pnpm install
```

This installs dependencies for all packages in the workspace.

### Running the Dev Server

```bash
pnpm dev
```

Starts the web app at http://localhost:3000

### Type Checking

```bash
pnpm typecheck
```

Runs TypeScript type checking across all packages.

### Building

```bash
pnpm build
```

Builds all packages for production.

## Adding a New Package

1. Create a new directory under `packages/` or `apps/`
2. Add a `package.json` with:
   - `name` starting with `@fichron/` for packages
   - Dependencies including workspace packages using `workspace:*`
3. Add to `pnpm-workspace.yaml` (already uses glob patterns)
4. Run `pnpm install` to link workspace dependencies

## Adding a New Component to `@fichron/ui`

1. Create `packages/ui/src/NewComponent.svelte`
2. Export from `packages/ui/src/index.ts`:
   ```typescript
   export { default as NewComponent } from './NewComponent.svelte';
   ```
3. Component is now available in all apps via:
   ```typescript
   import { NewComponent } from '@fichron/ui';
   ```

## Workspace Dependencies

Packages reference each other using `workspace:*` protocol:

```json
{
  "dependencies": {
    "@fichron/types": "workspace:*"
  }
}
```

This ensures packages always use the local workspace version.

## Path Aliases

The web app uses Vite path aliases to import from packages:

```typescript
import { Button } from '@fichron/ui';
import { YAMLParser } from '@fichron/core';
import type { TimelineEntry } from '@fichron/types';
```

Configured in:
- `apps/web/vite.config.ts` - Runtime resolution
- `apps/web/tsconfig.json` - TypeScript resolution

## Future: Mobile App

The structure is ready for a NativeScript mobile app:

1. Create `apps/mobile/`
2. Reuse `@fichron/ui` components
3. Reuse `@fichron/core` logic
4. Share types from `@fichron/types`

## TypeScript Configuration

- **Root**: `tsconfig.json` - Base config
- **Packages**: Each has own `tsconfig.json` extending root
- **No composite mode**: Using simple noEmit type checking

## Scripts Reference

**Root package.json**:
- `dev` - Start web app dev server
- `build` - Build all packages
- `preview` - Preview production build
- `typecheck` - Type check all packages
- `lint` - Lint all packages (to be implemented)

**Individual packages**: Each has `typecheck` script.

## Notes

- Using Svelte 5 with runes API ($state, $props, etc.)
- TypeScript strict mode enabled
- Responsive-first design for mobile and desktop
- Dark mode support via CSS `prefers-color-scheme`
- Client-side only - no backend required
