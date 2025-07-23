# GAMBIT Component System – General Styles & Color Palette

## General Styles

### Typography
- **Font Family:** Inherit from system (customize in Tailwind config if needed)
- **Font Sizes:** Responsive, using Tailwind's scale
- **Font Weights:** Normal, Medium, Bold
- **Headings:** Use semantic HTML (`h1`–`h6`), styled via Tailwind

### Spacing
- **Base Unit:** 4px (Tailwind scale)
- **Padding/Margin:** Use Tailwind utilities for consistent spacing
- **Border Radius:** `0.5rem` (8px) by default (`--radius`)

### Shadows
- **Card/Popover:** Subtle shadow for elevation
- **Dropdown:** Slightly stronger shadow

---

## Color Palette

### Gambit Theme (Default)
| Token              | Example                | Value         |
|--------------------|-----------------------|--------------|
| Background         | ![#fff](https://via.placeholder.com/20/fff/000?text=+) | #fff         |
| Foreground         | ![#0f172a](https://via.placeholder.com/20/0f172a/fff?text=+) | #0f172a      |
| Primary            | ![#1e293b](https://via.placeholder.com/20/1e293b/fff?text=+) | #1e293b      |
| Secondary          | ![#f1f5f9](https://via.placeholder.com/20/f1f5f9/000?text=+) | #f1f5f9      |
| Accent             | ![#f1f5f9](https://via.placeholder.com/20/f1f5f9/000?text=+) | #f1f5f9      |
| Muted              | ![#f1f5f9](https://via.placeholder.com/20/f1f5f9/000?text=+) | #f1f5f9      |
| Border             | ![#e2e8f0](https://via.placeholder.com/20/e2e8f0/000?text=+) | #e2e8f0      |
| Card               | ![#fff](https://via.placeholder.com/20/fff/000?text=+) | #fff         |
| Popover            | ![#fff](https://via.placeholder.com/20/fff/000?text=+) | #fff         |
| Sidenav Background | ![#fff](https://via.placeholder.com/20/fff/000?text=+) | #fff         |
| Breadcrumb BG      | ![#fff](https://via.placeholder.com/20/fff/000?text=+) | #fff         |

### Albert Heijn Theme
| Token              | Example                | Value         |
|--------------------|-----------------------|--------------|
| Background         | ![#0f172a](https://via.placeholder.com/20/0f172a/fff?text=+) | #0f172a      |
| Foreground         | ![#f1f5f9](https://via.placeholder.com/20/f1f5f9/000?text=+) | #f1f5f9      |
| Primary            | ![#f1f5f9](https://via.placeholder.com/20/f1f5f9/000?text=+) | #f1f5f9      |
| Secondary          | ![#232e3a](https://via.placeholder.com/20/232e3a/fff?text=+) | #232e3a      |
| Accent             | ![#232e3a](https://via.placeholder.com/20/232e3a/fff?text=+) | #232e3a      |
| Muted              | ![#232e3a](https://via.placeholder.com/20/232e3a/fff?text=+) | #232e3a      |
| Border             | ![#232e3a](https://via.placeholder.com/20/232e3a/fff?text=+) | #232e3a      |
| Card               | ![#0f172a](https://via.placeholder.com/20/0f172a/fff?text=+) | #0f172a      |
| Popover            | ![#0f172a](https://via.placeholder.com/20/0f172a/fff?text=+) | #0f172a      |
| Sidenav Background | ![#00ADE6](https://via.placeholder.com/20/00ADE6/fff?text=+) | #00ADE6      |
| Breadcrumb BG      | ![#00ADE6](https://via.placeholder.com/20/00ADE6/fff?text=+) | #00ADE6      |

---

## Logo Component

### Theme-Based Logo Switching
The Logo component automatically displays the appropriate logo based on the current theme:

- **Gambit Theme**: Displays `/gambit-logo.svg`
- **Albert Heijn Theme**: Displays `/ah-logo.svg`

### Theme Detection
The component detects themes in the following order:
1. **CSS Custom Property**: `--brand-theme: albert-heijn | gambit`
2. **Data Attributes**: `data-theme="albert-heijn"` on html or body
3. **CSS Classes**: `.albert-heijn` or `.ah-theme` on html or body
4. **Default**: Falls back to Gambit logo

### Usage Examples
```tsx
// Auto-detect theme (default)
<Logo />

// Explicit theme
<Logo theme="albert-heijn" />

// With click handler for navigation
<Logo onClick={() => router.push('/')} />
```

### Logo Specifications
- **Fixed Size**: All logos are consistently rendered at 40×40 pixels
- **Gambit Theme**: Original logo colors preserved
- **Albert Heijn Theme**: Logo displayed in white using CSS filters

### Integration Points
- **SideNavigation**: Automatically sized logo based on collapsed state
- **Login Page**: Theme-aware logo switching with manual override
- **Storybook**: Full documentation and interactive examples

---

## Usage
- Use Tailwind utility classes for all layout, spacing, and color.
- Use theme tokens (CSS variables) for custom styles and overrides.
- For custom themes, extend the `.theme-ah` class in `globals.css`.
- Use the Logo component for consistent branding across themes.

---

For more details, see the [COMPONENT-SYSTEM.md](../COMPONENT-SYSTEM.md). 