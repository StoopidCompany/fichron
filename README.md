# fichron

A flexible, client-side web application for filtering and exploring fictional universe timelines through loosely-structured YAML chronologies.

## Overview

Chronology Filter provides a universal tool for navigating complex fictional universes. Users can filter content by characters, story arcs, or any custom criteria defined in YAML files. The application works both as an embedded component and standalone site, with curated chronologies included and community contributions supported.

## Use Cases

- View only MCU content relevant to Spider-Man's storyline
- Filter Star Wars content by specific character arcs
- Explore DC animated universe continuity for specific characters
- Create custom viewing orders with in-canon chronology vs release date
- Define custom sorting criteria for any fictional universe

## Architecture

- **Frontend**: Svelte-based application (embeddable component + full site)
- **Data Layer**: Client-side YAML parsing with flexible schema
- **Distribution**: Ships with curated chronologies, accepts community contributions
- **Storage**: No backend - YAML files loaded directly

## YAML Schema Philosophy

The schema is **intentionally loose**. Only a few fields are recognized by the UI; most fields are optional or custom. The application discovers and filters on any fields present in the YAML.

### Minimal Example

```yaml
name: "Marvel Cinematic Universe"

entries:
  - title: "Iron Man"
    release_date: 2008
    characters:
      - Tony Stark
      - Pepper Potts
    
  - title: "Captain America: Civil War"
    release_date: 2016
    canon_year: 2016
    characters:
      - Tony Stark
      - Steve Rogers
      - Peter Parker
```

### Extended Example with Custom Fields

```yaml
name: "Marvel Cinematic Universe"
chronology_types:
  - release_date
  - canon_year
  - viewing_order

entries:
  - title: "Captain America: The First Avenger"
    release_date: 2011
    canon_year: 1943
    viewing_order: 5
    type: movie
    runtime: 124
    characters:
      - Steve Rogers
      - Peggy Carter
    arcs:
      - Infinity Saga
    custom_tags:
      - origin_story
      - world_war_ii
    
  - title: "Iron Man"
    release_date: 2008
    canon_year: 2010
    viewing_order: 1
    type: movie
    characters:
      - Tony Stark
    arcs:
      - Infinity Saga
      - Iron Man Arc

  - title: "Agents of S.H.I.E.L.D. S01E01"
    release_date: 2013-09-24
    canon_year: 2013
    type: tv_episode
    characters:
      - Phil Coulson
      - Melinda May
    arcs:
      - Coulson's Return
```

### Recognized Fields

The application looks for these common fields but **all are optional**:

- `name` - Chronology name
- `entries` - Array of content items
- `title` - Entry title (most important field)
- `characters` - Array of character names (enables character filtering)
- `arcs` - Array of story arc names (enables arc filtering)
- `chronology_types` - Hints for available sort orders

Any other field in an entry can be:
- Filtered on (if UI discovers multiple entries with same field)
- Sorted by (if field values are comparable)
- Displayed in UI

### Custom Fields

Custom fields enable domain-specific filtering:

```yaml
entries:
  - title: "The Hobbit"
    book_chapter: 1
    location: "The Shire"
    pov_character: "Bilbo"
    story_day: 1
```

The UI will automatically generate filters for `location`, `pov_character`, and allow sorting by `story_day`.

## Key Features

- **Schema Flexibility**: Most fields optional; custom fields fully supported
- **Multiple Chronologies**: Sort by release date, in-universe chronology, or custom orders
- **Client-Side**: No server required - runs entirely in browser
- **Dynamic Filtering**: UI auto-generates filters based on discovered fields
- **Embeddable**: Works as standalone site or embedded component
- **Community-Driven**: Curated chronologies included; community contributions hosted
- **Shareable URLs**: Filter and sort states encoded in URL parameters

## Project Structure

This is a pnpm monorepo with the following structure:

```
fichron/
├── apps/
│   └── web/                    # Main Svelte web application
│       ├── src/
│       │   ├── App.svelte      # Main app component
│       │   └── main.ts         # Entry point
│       ├── public/
│       │   └── data/           # YAML timeline files
│       │       ├── mcu/        # Marvel Cinematic Universe
│       │       └── dcu/        # DC Universe
│       └── vite.config.ts
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   └── src/
│   │       └── index.ts        # Timeline, filter, and discovery types
│   ├── core/                   # Core business logic
│   │   └── src/
│   │       ├── parser.ts       # YAML parsing with js-yaml
│   │       ├── filter.ts       # Timeline filtering engine
│   │       └── discovery.ts    # Field auto-discovery
│   └── ui/                     # Reusable Svelte components
│       └── src/
│           ├── Button.svelte
│           ├── Card.svelte
│           ├── TimelineItem.svelte
│           └── FilterPanel.svelte
├── pnpm-workspace.yaml
└── package.json
```

### Monorepo Benefits

- **Shared Components**: UI components in `@fichron/ui` can be reused across web and future mobile apps
- **Centralized Logic**: YAML parsing and filtering logic in `@fichron/core`
- **Type Safety**: Shared types in `@fichron/types` ensure consistency
- **Independent Development**: Each package can be developed and tested independently

## Technical Goals

- Minimal dependencies (YAML parser only)
- Fast client-side filtering for large datasets (1000+ entries)
- Auto-discovery of filterable fields from YAML structure
- Component can be embedded in other web projects
- Progressive enhancement for accessibility

## Distribution

- **Included Chronologies**: Curated by maintainers, shipped with application
- **Community Contributions**: Hosted chronologies via PR process
- **Self-Hosted**: Users can provide their own YAML URLs

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the web app in development mode
pnpm dev

# Build all packages
pnpm build

# Type-check all packages
pnpm typecheck
```

### Project Scripts

- `pnpm dev` - Start the web app development server (port 3000)
- `pnpm build` - Build all packages for production
- `pnpm preview` - Preview the production build
- `pnpm typecheck` - Run TypeScript type checking across all packages

## Development Status

Active development - monorepo structure complete, initial UI and data layer implemented.

## Contributing

Contributions welcome for:
- Core application development
- Curated chronology YAML files
- Community chronology submissions
- Documentation improvements

(Contribution guidelines to be established)

## License

MIT