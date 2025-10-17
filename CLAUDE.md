# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production version 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing & Verification
Always run `npm run lint` after making changes to ensure code quality and TypeScript compliance.

## Project Architecture

### High-Level Structure
This is a **Next.js 15** application that generates test password vault data for multiple password managers (Bitwarden, LastPass, Keeper, Microsoft Edge, KeePassX, KeePass2, Password Depot).

### Core Architecture Components

#### API Layer (`/app/api/`)
- **`/api/vault/generate`** - Main generation endpoint with comprehensive validation and security middleware
- **`/api/vault/formats`** - Returns supported password manager formats and capabilities
- **`/api/config`** - Application configuration endpoint

#### Generator Layer (`/generators/`)
Each password manager has its own generator:
- `bitwarden-generator.ts` - Most complex, supports individual/org vaults, collections, nested hierarchies
- `lastpass-generator.ts`, `keeper-generator.ts`, etc. - Format-specific generators

#### Type System (`/types/`)
- `index.ts` - Central type definitions including `VaultGenerationOptions`
- Format-specific types for each password manager
- `VaultFormat` union type defines supported formats

#### Utility Layer (`/utils/`)
- **`security-middleware.ts`** - Rate limiting, request validation, security headers
- **`password-generators.ts`** - Password generation with weak password simulation
- **`collection-generators.ts`** - Business-realistic folder/collection hierarchies  
- **`data-formatters.ts`** - Convert between internal format and export formats (CSV, JSON, XML)
- **`locale-content.ts`** - Multi-language support (26 locales)

#### Component Layer (`/components/`)
- `password-vault-generator.tsx` - Main UI component (73KB - handles complex form state)
- `VaultConfigForm.tsx` - Configuration form with format-specific options
- `CollectionSettings.tsx` - Organization vault collection settings
- UI components using Radix UI + Tailwind CSS

### Key Technical Features

#### Multi-Format Support
The application supports 7 password managers with format-specific validation:
- **Bitwarden**: JSON format, supports both individual and organization vaults, nested collections
- **LastPass, Edge, KeePassX**: CSV formats with different schemas
- **KeePass2**: XML format with complex nested structure
- **Keeper**: JSON with folder hierarchies
- **Password Depot**: Semicolon-separated CSV with importance levels

#### Security & Performance
- **Rate limiting** via `utils/security-middleware.ts`
- **Request size validation** to prevent memory issues
- **Progress tracking** for large datasets (up to 10,000 items)
- **Security headers** including CSP, XSS protection
- **Password reuse simulation** for security testing

#### Internationalization
- **26 supported locales** via faker.js
- **Non-Latin scripts** (Chinese, Arabic, Russian, etc.)
- **Accent handling** for European languages
- Locale-specific business names and realistic data

### Development Patterns

#### Request Validation Flow
1. Security middleware validates rate limits and request size
2. Format-specific validation (e.g., collections only for Bitwarden org)
3. Parameter sanitization and defaults
4. Generation with progress tracking
5. Format conversion (JSON → CSV/XML as needed)

#### Generator Pattern
Each generator follows the same interface:
```typescript
// Generate items based on VaultGenerationOptions
// Return format-specific data structure
// Handle collections/folders if supported by format
```

#### Error Handling
- Comprehensive validation with specific error messages
- Security-focused error responses (no sensitive data leakage)
- Progress tracking for long operations

## Configuration

### Environment Variables
- `NEXT_PUBLIC_HOSTED_ON=civo` - Optional provider branding
- Standard Next.js environment configuration

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to root, `@components/*` to app/components
- ES2017 target for broad compatibility

### Security Headers
Configured in `next.config.ts` with CSP, XSS protection, and frame protection.

## Multi-Language Support

The application generates realistic test data in 26 languages with proper character encoding:
- European languages with accents (French, German, Spanish, Italian)  
- Non-Latin scripts (Chinese, Arabic, Russian, Japanese, Korean)
- Proper UTF-8 handling for password manager import/export testing