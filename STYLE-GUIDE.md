# Style Guide & Theme Pack

A comprehensive design system documentation for maintaining consistency across projects. This guide extracts the styling patterns from the Password Vault Generator project.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Dependencies](#dependencies)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Sizing](#spacing--sizing)
6. [Border Radius](#border-radius)
7. [Component Patterns](#component-patterns)
8. [Animation & Transitions](#animation--transitions)
9. [Layout Patterns](#layout-patterns)
10. [Configuration Files](#configuration-files)

---

## Quick Start

### Install Dependencies

```bash
npm install tailwindcss tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-slider
npm install lucide-react
```

### Copy Core Files

1. Copy `tailwind.config.ts` to your project root
2. Copy `app/globals.css` to your styles directory
3. Copy `lib/utils.ts` to your lib directory
4. Copy `components.json` if using shadcn/ui CLI

---

## Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-slider": "1.2.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.456.0",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8"
  }
}
```

---

## Color System

### Design Philosophy

The color system uses **HSL values stored in CSS variables**, allowing for easy theme switching and consistent color relationships. The primary palette is based on **slate/navy blues** for a professional, trustworthy appearance.

### CSS Variables (Light Mode - Default)

```css
:root {
  /* Core Colors */
  --background: 0 0% 100%;           /* #FFFFFF - White */
  --foreground: 222.2 84% 4.9%;      /* #030712 - Near Black (Dark Navy) */

  /* Surface Colors */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Brand Colors */
  --primary: 222.2 47.4% 11.2%;      /* #0f172a - Dark Navy */
  --primary-foreground: 210 40% 98%; /* #f8fafc - Near White */

  /* Supporting Colors */
  --secondary: 210 40% 96.1%;        /* #f1f5f9 - Light Gray-Blue */
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%; /* #64748b - Slate Gray */

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Semantic Colors */
  --destructive: 0 84.2% 60.2%;      /* #ef4444 - Red */
  --destructive-foreground: 210 40% 98%;

  /* UI Element Colors */
  --border: 214.3 31.8% 91.4%;       /* #e2e8f0 - Light Border */
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;            /* Focus Ring - matches foreground */

  /* Base Radius */
  --radius: 0.5rem;

  /* Chart/Data Visualization (Light) */
  --chart-1: 12 76% 61%;    /* Warm Orange */
  --chart-2: 173 58% 39%;   /* Teal */
  --chart-3: 197 37% 24%;   /* Dark Blue */
  --chart-4: 43 74% 66%;    /* Gold */
  --chart-5: 27 87% 67%;    /* Coral */
}
```

### CSS Variables (Dark Mode)

```css
.dark {
  --background: 222.2 84% 4.9%;      /* #030712 - Near Black */
  --foreground: 210 40% 98%;         /* #f8fafc - Near White */

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 210 40% 98%;            /* Inverted - Light text */
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;    /* #1e293b - Dark Slate */
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%; /* #94a3b8 - Light Slate */

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;      /* Darker Red */
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;

  /* Chart/Data Visualization (Dark) */
  --chart-1: 220 70% 50%;   /* Blue */
  --chart-2: 160 60% 45%;   /* Cyan-Green */
  --chart-3: 30 80% 55%;    /* Orange */
  --chart-4: 280 65% 60%;   /* Purple */
  --chart-5: 340 75% 55%;   /* Pink */
}
```

### Color Usage Reference

| Semantic Name | Tailwind Class | Use Case |
|--------------|----------------|----------|
| Background | `bg-background` | Page/app background |
| Foreground | `text-foreground` | Primary text |
| Primary | `bg-primary`, `text-primary` | Buttons, links, emphasis |
| Secondary | `bg-secondary` | Secondary buttons, backgrounds |
| Muted | `bg-muted`, `text-muted-foreground` | Disabled states, helper text |
| Accent | `bg-accent` | Hover states, highlights |
| Destructive | `bg-destructive` | Delete buttons, errors |
| Border | `border-border` | All borders |
| Input | `border-input` | Form input borders |
| Ring | `ring-ring` | Focus rings |

---

## Typography

### Font Stack

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

### Font Sizes (Tailwind Classes)

| Class | Size | Use Case |
|-------|------|----------|
| `text-2xl` | 1.5rem | Page titles, hero headings |
| `text-xl` | 1.25rem | Section headings |
| `text-lg` | 1.125rem | Modal titles, card headers |
| `text-base` | 1rem | Body text |
| `text-sm` | 0.875rem | Labels, descriptions, helper text |
| `text-xs` | 0.75rem | Fine print, copyright |

### Font Weights

| Class | Weight | Use Case |
|-------|--------|----------|
| `font-bold` | 700 | Primary headings, strong emphasis |
| `font-semibold` | 600 | Secondary headings, labels |
| `font-medium` | 500 | Buttons, form labels |
| `font-normal` | 400 | Body text |

### Text Color Classes

```html
<!-- Primary text -->
<p class="text-foreground">Main content</p>

<!-- Secondary/muted text -->
<p class="text-muted-foreground">Helper text, descriptions</p>

<!-- Error text -->
<p class="text-destructive">Error message</p>

<!-- On primary background -->
<p class="text-primary-foreground">Text on buttons</p>
```

---

## Spacing & Sizing

### Spacing Scale

The project uses Tailwind's default spacing scale consistently:

| Tailwind Class | Value | Common Use |
|----------------|-------|------------|
| `space-y-2` / `gap-2` | 0.5rem (8px) | Tight grouping (checkboxes, inline) |
| `space-y-4` / `gap-4` | 1rem (16px) | Standard section spacing |
| `space-y-6` / `gap-6` | 1.5rem (24px) | Major section dividers |
| `space-y-8` / `gap-8` | 2rem (32px) | Large gaps |

### Padding Patterns

| Pattern | Classes | Use Case |
|---------|---------|----------|
| Page padding | `p-4` or `px-4` | Container horizontal padding |
| Card padding | `p-4` or `p-6` | Card/section content |
| Button padding | `px-4 py-2` | Standard buttons |
| Input padding | `px-3 py-2` | Form inputs |

### Component Heights

| Element | Height | Tailwind Class |
|---------|--------|----------------|
| Input | 40px | `h-10` |
| Button (default) | 40px | `h-10` |
| Button (small) | 36px | `h-9` |
| Button (large) | 44px | `h-11` |
| Checkbox | 16px | `h-4 w-4` |
| Slider Thumb | 20px | `h-5 w-5` |

---

## Border Radius

### Radius Scale

```css
--radius: 0.5rem; /* Base value */
```

| Tailwind Class | Value | Calculation |
|----------------|-------|-------------|
| `rounded-lg` | 0.5rem (8px) | `var(--radius)` |
| `rounded-md` | 0.375rem (6px) | `calc(var(--radius) - 2px)` |
| `rounded-sm` | 0.25rem (4px) | `calc(var(--radius) - 4px)` |
| `rounded-full` | 9999px | Circular elements |

### Usage Guidelines

- **Cards/Containers**: `rounded-lg` or `rounded-md`
- **Buttons**: `rounded-md`
- **Inputs**: `rounded-md`
- **Checkboxes**: `rounded-sm`
- **Avatars/Badges**: `rounded-full`

---

## Component Patterns

### Utility Function (Required)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Button Component

```tsx
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Input Component

```tsx
// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### Label Component

```tsx
// components/ui/label.tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

### Form Field Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="fieldId">Field Label</Label>
  <Input id="fieldId" placeholder="Enter value..." />
  <p className="text-sm text-muted-foreground">
    Optional helper text describing the field
  </p>
</div>
```

### Checkbox + Label Pattern

```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="checkId" checked={value} onCheckedChange={onChange} />
  <Label htmlFor="checkId">Checkbox label text</Label>
</div>
```

### Card/Section Pattern

```tsx
<div className="space-y-4 border p-4 rounded-md">
  <h3 className="font-semibold">Section Title</h3>
  {/* Section content */}
</div>
```

### Error Display Pattern

```tsx
<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
  <h3 className="font-semibold text-red-800">Error Title</h3>
  <p className="text-red-600">{errorMessage}</p>
</div>
```

### Modal/Overlay Pattern

```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
    <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
    {/* Modal content */}
  </div>
</div>
```

---

## Animation & Transitions

### Plugin Setup

The project uses `tailwindcss-animate` for advanced animations:

```bash
npm install tailwindcss-animate
```

Add to `tailwind.config.ts`:

```typescript
plugins: [require("tailwindcss-animate")]
```

### Common Transition Classes

```css
/* Color transitions (buttons, links) */
transition-colors

/* All properties (general use) */
transition-all duration-200

/* Specific duration */
transition-all duration-300 ease-out
```

### Hover Effects

```css
/* Opacity reduction */
hover:opacity-80

/* Background color shift */
hover:bg-primary/90
hover:bg-accent

/* Color change */
hover:text-accent-foreground
```

### Focus States

```css
/* Standard focus ring */
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### Radix UI Animations (Select, Dialog, etc.)

```css
/* Open/Close animations */
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95

/* Directional slides */
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

---

## Layout Patterns

### Page Container

```tsx
<div className="container mx-auto px-4">
  {/* Page content */}
</div>
```

### Vertical Stack (Common)

```tsx
<div className="space-y-4">
  {/* Stacked elements with consistent spacing */}
</div>
```

### Horizontal Group

```tsx
<div className="flex items-center gap-4">
  {/* Horizontally aligned elements */}
</div>
```

### Button Group

```tsx
<div className="space-x-4">
  <Button>Primary Action</Button>
  <Button variant="outline">Secondary Action</Button>
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Responsive grid */}
</div>
```

### Footer Pattern

```tsx
<footer className="mt-12 py-8 border-t border-gray-200">
  <div className="container mx-auto px-4">
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-wrap justify-center items-center gap-6">
        {/* Footer links */}
      </div>
      <p className="text-xs text-gray-500">
        Copyright notice
      </p>
    </div>
  </div>
</footer>
```

---

## Configuration Files

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### components.json (shadcn/ui)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### postcss.config.mjs

```javascript
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

---

## Checklist for New Projects

- [ ] Install all dependencies from the [Dependencies](#dependencies) section
- [ ] Copy `tailwind.config.ts` to project root
- [ ] Copy CSS variables to your global stylesheet
- [ ] Create `lib/utils.ts` with the `cn` function
- [ ] Copy UI components to `components/ui/`
- [ ] Set up PostCSS configuration
- [ ] Add `components.json` if using shadcn/ui CLI
- [ ] Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [shadcn/ui](https://ui.shadcn.com/)
- [Class Variance Authority](https://cva.style/docs)
- [Lucide Icons](https://lucide.dev/icons/)
