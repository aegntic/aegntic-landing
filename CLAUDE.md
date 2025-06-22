# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server with Turbopack (exposed on all interfaces)
bun dev

# If dev server fails to load in browser, use background mode:
# 1. Kill any existing processes: pkill -f "next dev"
# 2. Start in background: bun dev > /dev/null 2>&1 &
# 3. Wait 3 seconds then test: curl -I http://localhost:3000
# 4. Should return HTTP/1.1 200 OK

# Build for production (static export to /out directory)
bun build

# Start production server
bun start

# Run linting and type checking
bun lint

# Format code with Biome
bun format
```

### Package Management
This project uses Bun as the package manager. Use `bun add` for dependencies and `bunx` for executing packages.

## Architecture

This is a Next.js 15.2.0 landing page with static export configuration, featuring:

### Tech Stack
- **Framework**: Next.js with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: Three.js + React Three Fiber ecosystem
- **Animation**: GSAP + Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Code Quality**: Biome (linting/formatting) + TypeScript

### Project Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── blog/        # Blog with dynamic routes using MDX
│   └── page.tsx     # Landing page entry
├── components/      # Reusable components
│   └── ui/         # shadcn/ui components
├── sections/        # Page sections (Hero, About, Portfolio, etc.)
└── lib/            # Utilities, contexts, and data
    ├── blog-data.ts # Blog content management
    └── theme-context.tsx # Dark mode support
```

### Key Patterns

#### 3D Components
- Use React Three Fiber for 3D scenes
- Leverage @react-three/drei for helpers
- Physics with @react-three/cannon

#### Component Development
- Place new UI components in `src/components/ui/`
- Use shadcn/ui patterns for consistency
- Import with `@/` alias (maps to `./src/`)

#### Styling
- Use Tailwind utility classes
- Custom primary color palette available (primary-50 to primary-950)
- Dark mode via `dark:` prefix
- CSS variables for theming

#### Forms
- Use React Hook Form for form state
- Validate with Zod schemas
- Handle errors with form.formState.errors

### Configuration Notes

#### Biome Settings
- Double quotes for strings
- 2-space indentation
- Automatic import organization
- Located in `biome.json`

#### TypeScript
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- Target: ES2017

#### Deployment
- Static export configured (`output: 'export'`)
- Outputs to `/out` directory
- Netlify deployment ready

### Development Tips

1. When creating new components, check existing patterns in `src/components/`
2. For 3D work, reference existing Three.js implementations
3. Use the blog system at `src/lib/blog-data.ts` for content
4. Leverage existing animations (GSAP, Framer Motion) for consistency
5. Follow the established dark mode pattern using theme-context
6. Form validation should use Zod schemas with React Hook Form

## Troubleshooting

### Development Server Not Loading
**Issue**: `bun dev` starts but browser shows "This site can't be reached" or loading indefinitely.

**Solution**:
1. Kill existing processes: `pkill -f "next dev"`
2. Start server in background: `bun dev > /dev/null 2>&1 &`
3. Wait 3 seconds: `sleep 3`
4. Test connectivity: `curl -I http://localhost:3000`
5. Should return `HTTP/1.1 200 OK`
6. Open browser to `http://localhost:3000`

**Root Cause**: Next.js development server sometimes fails to bind properly to localhost in certain environments. Running in background mode resolves this.

### Static Export Issues
**Issue**: Development server won't start due to `output: 'export'` in next.config.js.

**Solution**: The `output: 'export'` line should be commented out during development:
```javascript
// output: 'export', // Commented out for development
```

### 3D Text Animation Status
**Current Working Features**:
- ✅ "aegntic.ai" text with camera tracking rotation
- ✅ Front-facing constraint (±89 degrees) - never shows back
- ✅ Text positioned at Z: +4 to prevent vanishing
- ✅ Pure white text with silver wireframe overlay
- ✅ 9px depth with 70% opacity layers
- ✅ Smooth rotation without glitches
- ✅ Checkpoint backup: `AsciiIntro_CHECKPOINT.tsx`