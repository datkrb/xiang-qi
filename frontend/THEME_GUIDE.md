# Theme System Guide

## Overview

The application theme system provides runtime theme switching with persistence. Users can select between three pre-built themes: **Blue** (default), **Dark** (low-light), and **Light** (bright environments).

## Available Themes

### Blue Theme

- **Use Case**: Gaming, default theme
- **Color Scheme**: Deep slate backgrounds (#0f172a) with cyan/sky blue accents
- **Primary Colors**: Sky blue (#0ea5e9), Cyan (#06b6d4)
- **Text**: Bright white (#f8fafc) on dark backgrounds
- **Accessibility**: WCAG AA compliant contrast ratios

### Dark Theme

- **Use Case**: Low-light environments, reduced eye strain
- **Color Scheme**: Near-black backgrounds (#0a0e27) with softer muted accents
- **Primary Colors**: Softer sky blue (#38bdf8), Softer cyan (#22d3ee)
- **Text**: Off-white (#f1f5f9) with optimal contrast in darkness
- **Accessibility**: WCAG AA compliant for low-light viewing

### Light Theme

- **Use Case**: Bright environments, daytime use
- **Color Scheme**: Light slate backgrounds (#f8fafc) with deeper colored accents
- **Primary Colors**: Deep blue (#2563eb), Violet (#7c3aed)
- **Text**: Dark slate (#1e293b) for maximum readability in bright light
- **Accessibility**: WCAG AA compliant for bright environments

## Using Themes in Components

### Method 1: CSS Variables (Recommended)

CSS variables automatically update when the theme changes. No component state needed.

#### Basic Example

```tsx
// In your CSS/Tailwind classes
.my-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-main);
  transition: background-color 0.3s ease;
}

// In your component - just use the class!
export const MyPanel = () => (
  <div className="my-panel">
    <h2 className="text-primary">Title</h2>
    <p className="text-text-muted">Subtitle</p>
  </div>
);
```

#### Gradient Example

```css
.gradient-button {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-accent)
  );
  color: var(--color-primary-foreground);
  transition: box-shadow 0.3s ease;
}
```

#### Tailwind Classes Using Theme Colors

```tsx
// Colors are registered in tailwind.config.ts
<div className="bg-surface border border-border text-text-main">
  <button className="bg-primary hover:bg-primary-hover text-primary-foreground">
    Click me
  </button>
</div>
```

### Method 2: useTheme Hook

Use the hook only when you need to access the current theme name or conditionally render content.

```tsx
import { useTheme } from "../theme/ThemeProvider";

export const ThemeAwareIcon = () => {
  const { theme } = useTheme();

  return <>{theme === "light" ? <SunIcon /> : <MoonIcon />}</>;
};
```

### Method 3: Change Theme Programmatically

```tsx
import { useTheme } from "../theme/ThemeProvider";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme("dark")}>
      Current: {theme}. Switch to Dark
    </button>
  );
};
```

## CSS Variables Reference

All variables are defined at the `:root` level and override in theme classes (`.theme-blue`, `.theme-dark`, `.theme-light`).

### Colors

| Variable                     | Description                      | Example Value (Blue)       |
| ---------------------------- | -------------------------------- | -------------------------- |
| `--color-background`         | Main page background             | `#0f172a`                  |
| `--color-surface`            | Panel backgrounds (with opacity) | `rgba(30, 41, 59, 0.7)`    |
| `--color-surface-opaque`     | Solid panel backgrounds          | `#1e293b`                  |
| `--color-surface-hover`      | Hover state for panels           | `rgba(51, 65, 85, 0.8)`    |
| `--color-primary`            | Main action color                | `#0ea5e9`                  |
| `--color-primary-hover`      | Hover state for primary          | `#0284c7`                  |
| `--color-primary-foreground` | Text on primary                  | `#ffffff`                  |
| `--color-accent`             | Secondary accent color           | `#06b6d4`                  |
| `--color-accent-hover`       | Hover state for accent           | `#0891b2`                  |
| `--color-border`             | Border color                     | `rgba(255, 255, 255, 0.1)` |
| `--color-text-main`          | Primary text color               | `#f8fafc`                  |
| `--color-text-muted`         | Secondary text color             | `#94a3b8`                  |
| `--color-success`            | Success state                    | `#10b981`                  |
| `--color-danger`             | Error/danger state               | `#f43f5e`                  |
| `--bg-image`                 | Background image URL             | `url('/bg-blue.png')`      |

## Persistence

Theme preferences are automatically saved to `localStorage` with the key `app-theme`. The theme persists across:

- Page reloads
- Browser restarts
- Navigation between routes

**Data Size**: ~10 bytes per theme preference

## Transitions

All theme-aware properties include smooth transitions:

- **Duration**: 0.3s (configurable in CSS)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Properties**: Colors, backgrounds, borders, shadows

### Respecting User Preferences

The system respects `prefers-reduced-motion` media query for accessibility. If a user has reduced motion enabled, transitions are disabled.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

## Building New Components

### Checklist

- [ ] Use CSS variables for all colors, backgrounds, borders
- [ ] Add `transition` to themed properties
- [ ] Use semantic variable names (`--color-primary`, not `--accent-blue`)
- [ ] Test in all three themes
- [ ] Verify WCAG AA contrast compliance
- [ ] Consider dark and light mode readability

### Example: New Card Component

```tsx
// styles.css
.theme-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.theme-card:hover {
  background: var(--color-surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.theme-card h3 {
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
}

.theme-card p {
  color: var(--color-text-muted);
}

// Component
export const ThemeCard = ({ title, children }) => (
  <div className="theme-card">
    <h3>{title}</h3>
    <p>{children}</p>
  </div>
);
```

## Common Patterns

### Icon Colors

```tsx
<CheckIcon className="text-success" />
<AlertIcon className="text-danger" />
<InfoIcon className="text-primary" />
```

### Text Variants

```tsx
<p className="text-text-main">Primary text</p>
<p className="text-text-muted">Secondary text</p>
<span className="text-text-main font-semibold">Emphasis</span>
```

### Disabled States

```tsx
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

### Glass Morphism

All `.glass-panel` and `.glass-panel-interactive` classes automatically adapt to the theme.

```tsx
<div className="glass-panel rounded-xl p-6">
  <h2>Glass Panel</h2>
</div>
```

## Troubleshooting

### Theme Not Applying

1. Verify `ThemeProvider` wraps your app in `main.tsx`
2. Check localStorage isn't blocking theme storage
3. Ensure HTML element has the `.theme-*` class applied

### Colors Not Updating on Theme Change

1. Use CSS variables instead of hardcoded colors
2. Make sure transitions are not disabled with `transition: none`
3. Verify Tailwind colors use `var(--color-*)`

### localStorage Errors

The system gracefully handles quota exceeded errors. Theme will apply for the current session only, and an error will be logged.

## Related Files

- **ThemeProvider**: `src/theme/ThemeProvider.tsx` - Core theme state management
- **ThemeSwitcher**: `src/components/ThemeSwitcher.tsx` - UI component for theme selection
- **CSS Variables**: `src/index.css` - All theme color definitions
- **Tailwind Config**: `tailwind.config.ts` - Tailwind integration with theme variables
- **Settings**: `src/components/SettingsScreen.tsx` - Theme switcher integration
