# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks (always run after changes)

## Project Architecture

**Next.js 15** application generating test password vault data for 7 password managers: Bitwarden, LastPass, Keeper, Microsoft Edge, KeePassX, KeePass2, Password Depot.

### Data Flow

```
API Request → Security Middleware → Validation → Generator → Formatter → Response
                    ↓                   ↓            ↓           ↓
              Rate Limiter      Format-specific   Type-specific  CSV/JSON/XML
              Size Validation   Business Rules    Generation     Conversion
```

### Core Layers

**API Layer** (`app/api/vault/`)
- `generate/route.ts` - Main endpoint: validates request → builds `VaultGenerationOptions` → calls format-specific generator → returns formatted output
- `formats/route.ts` - Returns supported formats and their capabilities

**Generators** (`generators/`)
Each generator receives standardized options and returns format-specific data:
- `bitwarden-generator.ts` - Most complex: individual/org vaults, collections, all 4 item types (login, secureNote, creditCard, identity)
- Others (lastpass, keeper, edge, keepassx, keepass2, password-depot) - Login items only

**Type System** (`types/`)
- `index.ts` - Core types: `VaultGenerationOptions`, `VaultFormat`, `VaultType`
- Format-specific files define export structures (e.g., `BitwardenVault`, `LastPassItem`)

**Utilities** (`utils/`)
- `security-middleware.ts` - Rate limiting (10 req/min for generate, 60 for info), request size validation (1MB max), security headers
- `password-generators.ts` - Password generation with weak password pool and reuse simulation
- `collection-generators.ts` - Hierarchical folder/collection names
- `data-formatters.ts` - Convert internal objects to CSV/JSON/XML strings
- `locale-faker.ts` + `locale-content.ts` - faker.js locale initialization and accented character content

### Key Constraints

**Format-specific features** (enforced in `app/api/vault/generate/route.ts`):
- Only Bitwarden supports: secureNotes, creditCards, identities
- Only Bitwarden org vaults support: collections, nested collections
- Limits: 10,000 items per type, 15,000 total, 100 collections max, 10 nesting depth

**Output formats**:
- Bitwarden → JSON (`BitwardenVault` | `BitwardenOrgVault`)
- KeePass2 → XML
- All others → CSV (different schemas per format)

### Adding a New Password Manager

1. Create type definitions in `types/new-format.ts`, export from `types/index.ts`
2. Add generator in `generators/new-format-generator.ts`
3. Add formatter function in `utils/data-formatters.ts` if CSV
4. Update `VaultFormat` union type in `types/index.ts`
5. Add case in `generateVault()` switch in `app/api/vault/generate/route.ts`
6. Update UI component `components/password-vault-generator.tsx`

### Documentation Requirements

When adding new features, API endpoints, or changing existing API functionality:
1. Update the docs page at `app/docs/page.tsx` to reflect the changes
2. Document any new parameters, endpoints, or constraints
3. Update API examples if the request/response format changes
4. If adding a new password manager format, add it to the format capabilities table in the docs

### Plan Requirements

All implementation plans must include a **Required Permissions** section listing every tool and Bash command that will be needed during implementation, so the user can pre-approve them before execution begins.

### Configuration

**Environment**: `NEXT_PUBLIC_HOSTED_ON=civo` for provider branding

**TypeScript paths**: `@/*` → root, `@components/*` → `app/components/*`

**Security headers**: Configured in `next.config.ts` (CSP, XSS protection, frame denial)