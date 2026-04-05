---
name: figma-to-responsive-rhs
description: >
  RHS OS project-specific design system context for the global figma-to-responsive skill.
  Contains the exact tokens, components, and grid system for this portfolio project.
trigger: >
  Use alongside the global figma-to-responsive skill when working in this project.
---

# RHS OS — Project-Specific Design Context

This file supplements the global `figma-to-responsive` skill with project-specific tokens.

## Grid System
- 12-column grid, `max-w-[1400px] mx-auto`, `gap-x-5` (20px)
- Content scrolls inside main area (right of 160px NavRail)
- Main area has `pt-[50px] pl-[50px] pr-[50px]`

## Color Tokens (`:root` variables → Tailwind via `@theme inline`)

| Hex | Variable | Tailwind |
|-----|----------|---------|
| #F3F0ED | --background | `bg-background` |
| #1A1A1A | --foreground | `text-foreground` |
| #FFFFFF | --surface | `bg-surface` |
| #EDE9E3 | --surface-alt | `bg-surface-alt` |
| #D6D0C7 | --border-color | `border-border` |
| #8C8578 | --muted | `text-muted` |
| #B1BC94 | --accent | `bg-accent` |
| #C4A265 | --accent-warm | `bg-accent-warm` |

## Typography
- Font: Satoshi (variable, 300-900), loaded globally
- Body copy: `text-foreground/80` (80% opacity)
- Labels: `text-[11px] font-bold uppercase tracking-[0.15em]`
- Section headers: `text-[40px] md:text-[50px] lg:text-[60px] font-bold leading-[1.05] tracking-[-0.02em]`
- Paragraph indent: `indent-[4em]` for opening paragraphs

## Image Conventions
- Large images: `rounded-[clamp(30px,5vw,100px)]`
- Hero aspect: `aspect-[13/8]`
- Always: `overflow-hidden object-cover`

## Component System
- 23+ section types defined in `src/lib/types.ts`
- Components in `src/components/case-study/sections/`
- Rendered via `SectionRenderer.tsx` switch statement
- Data objects in `src/data/` drive section rendering
- Always check existing section types before creating new ones
