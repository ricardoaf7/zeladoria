# CMTU-LD Operations Dashboard

## Overview

This is a full-stack web application serving as an operational dashboard for CMTU-LD (municipal urban services management) in Londrina, Brazil. The application provides a map-centric interface for monitoring and managing urban service operations across 1125+ service areas, including mowing (roçagem), garden maintenance, and field team coordination. The primary user is the Mayor and city officials who need real-time visibility into service status, scheduling, and team deployment.

The application combines interactive mapping with service area management, automated scheduling algorithms, and team assignment capabilities. All user-facing content is in Brazilian Portuguese (pt-BR).

## Recent Changes (October 31, 2025)

### Sidebar Redesign
- Implemented dark-themed accordion-style sidebar with expandable sections for "LIMPEZA URBANA" (7 services) and "RESÍDUOS" (5 services)
- Added appropriate Lucide React icons for each service (Scissors for Roçagem, Flower2 for Jardins, etc.)
- Header displays "CMTU Dashboard / Operações em Tempo Real"
- Design matches IBM Carbon System principles with dark background and elevated containers

### Interactive Map Enhancements
- **Tooltips on Hover**: All map markers (areas and teams) display tooltips when hovering with mouse, showing relevant information (address, service type, scheduled date for areas; team ID, type, status, and lot for teams)
- **Draggable Markers**: Areas without polygons can be repositioned by dragging markers; position changes persist automatically via PATCH /api/areas/:id/position endpoint
- **Layer Ordering**: Area markers and polygons render above team markers to ensure clickability (implemented with bringToFront() with type guards)

### Area Information Card
- Replaced modal-based details with inline sidebar card (AreaInfoCard component)
- Card displays when clicking on area marker/polygon: Location, Neighborhood, Type, Area m², Lot, History
- Map automatically focuses on selected area with panTo and zoom
- **Inline Editing**: Click "Editar" to transform fields into editable inputs; changes save via PATCH /api/areas/:id with Zod validation
- **State Synchronization**: Implements onUpdate callback chain to ensure selectedArea state updates immediately after saving edits
- Type safety guards prevent runtime errors (typeof checks for status field before string operations)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using Vite as the build tool and development server.

**UI Component System**: Radix UI primitives with shadcn/ui component library configured in "new-york" style. The design follows IBM Carbon Design System principles for enterprise data-heavy applications, prioritizing information clarity, spatial efficiency, and status-first visual language.

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables. The theme supports both light and dark modes with a neutral base color palette. Custom spacing primitives (2, 4, 6, 8, 12, 16) and typography scale using IBM Plex Sans font family.

**Layout Pattern**: Full-screen split layout with a collapsible sidebar (320px desktop, full-width mobile) and a flex-fill map view occupying the remaining viewport. The sidebar contains layer filters, scheduling configuration, and data entry panels.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. No global state library; component-level state using React hooks.

**Routing**: Wouter for lightweight client-side routing (single main dashboard route).

**Map Integration**: Leaflet.js for interactive mapping with Leaflet.draw plugin for polygon drawing capabilities. Maps display service areas with color-coded status indicators and support layer toggling for different service types and team locations.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript in ESM module format.

**API Design**: RESTful API with resource-based endpoints following conventional HTTP methods:
- GET endpoints for fetching service areas by type (roçagem, jardins), teams, and configuration
- PATCH endpoints for updating area status, schedules, polygons, and configuration
- JSON request/response format with Zod schema validation

**Middleware Stack**: 
- JSON body parsing with raw body preservation for webhook support
- URL-encoded form data parsing
- Request/response logging middleware for API endpoints
- Vite development middleware in development mode

**Development Setup**: Hot Module Replacement (HMR) via Vite with custom error overlays and development banners in Replit environment.

### Data Storage

**Storage Pattern**: In-memory storage implementation via a storage abstraction layer (`IStorage` interface). The storage module maintains application state including service areas, teams, and configuration without external database dependencies in the base implementation.

**Data Models**:
- **ServiceArea**: Represents mowing or garden maintenance locations with geographic coordinates, polygon boundaries, service type, status (Pendente/Em Execução/Concluído), scheduling metadata, and history tracking
- **Team**: Field teams with service type, operational status, current assignment, and location
- **AppConfig**: System-wide configuration including production rates for scheduling calculations

**Scheduling Algorithm**: Business logic for calculating mowing schedules based on configurable production rates (m²/day) per lote (contract lot). Algorithm accounts for business days only, skipping weekends, and sequences areas by ordem (priority order).

**Database Integration Ready**: Drizzle ORM configured with PostgreSQL dialect pointing to Neon serverless database. Schema definitions in `shared/schema.ts` use Zod for runtime validation, ready for database migration when needed.

### External Dependencies

**Database Provider**: Neon serverless PostgreSQL (configured but not actively used in current in-memory implementation). Connection via `@neondatabase/serverless` driver.

**ORM**: Drizzle ORM v0.39+ with `drizzle-kit` for schema migrations. Migration files output to `./migrations` directory.

**Session Management**: `connect-pg-simple` for PostgreSQL-backed session storage (available for future authentication implementation).

**Map Services**: 
- Leaflet.js v1.9.4 for base mapping functionality
- Leaflet.draw v1.0.4 for polygon editing tools
- CDN delivery for Leaflet assets in production

**UI Component Libraries**:
- Radix UI primitives (accordion, dialog, dropdown, select, toast, etc.)
- shadcn/ui component collection
- lucide-react for iconography
- class-variance-authority for variant-based component styling

**Form Handling**: React Hook Form with Hookform Resolvers for Zod schema validation integration.

**Utility Libraries**:
- date-fns for date manipulation in scheduling calculations
- clsx and tailwind-merge for className composition
- cmdk for command palette functionality
- Zod for runtime type validation across client and server

**Build Tools**:
- Vite for frontend bundling and development server
- esbuild for server-side bundling in production builds
- TypeScript compiler for type checking
- PostCSS with Autoprefixer for CSS processing

**Development Tools** (Replit-specific):
- `@replit/vite-plugin-runtime-error-modal` for enhanced error reporting
- `@replit/vite-plugin-cartographer` for code navigation
- `@replit/vite-plugin-dev-banner` for development environment indicators