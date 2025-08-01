# Theme System Guide

## Overview
Your Hakim AI application now has a comprehensive dark/light mode theme system with smooth transitions and beautiful UI components.

## Features
- ✅ **Light Mode**: Clean white background with blue accents
- ✅ **Dark Mode**: Dark background with cyan/blue accents  
- ✅ **Smooth Transitions**: All color changes are animated
- ✅ **System Preference**: Automatically detects user's system theme preference
- ✅ **Persistent**: Remembers user's theme choice
- ✅ **Accessible**: Proper contrast ratios and ARIA labels

## How to Use

### 1. Theme Toggle Component
Add the theme toggle to any page:

```tsx
import { ThemeToggle } from "@/components/ThemeToggle"

// Simple icon toggle
<ThemeToggle />

// With text
<ThemeToggleWithText />

// Custom styling
<ThemeToggle variant="outline" size="lg" className="my-custom-class" />
```

### 2. Using Theme Context
Access theme state in any component:

```tsx
import { useTheme } from "@/contexts/ThemeContext"

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  )
}
```

### 3. CSS Classes for Theming
Use these Tailwind classes for consistent theming:

#### Background Colors
- `bg-background` - Main background
- `bg-card` - Card backgrounds
- `bg-muted` - Subtle backgrounds
- `bg-primary` - Primary action backgrounds

#### Text Colors
- `text-foreground` - Main text
- `text-muted-foreground` - Secondary text
- `text-primary` - Primary text/links
- `text-primary-foreground` - Text on primary backgrounds

#### Border Colors
- `border-border` - Standard borders
- `border-primary` - Primary borders

#### Examples
```tsx
// Card component
<div className="bg-card border border-border text-foreground rounded-lg p-4">
  <h3 className="text-foreground font-bold">Title</h3>
  <p className="text-muted-foreground">Description</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
    Action
  </button>
</div>

// Navigation
<nav className="bg-background border-b border-border">
  <a className="text-foreground hover:text-primary">Link</a>
</nav>
```

## Color Palette

### Light Mode
- **Background**: Pure White (#FFFFFF)
- **Foreground**: Blue (#1E3A8A)
- **Primary**: Blue (#3B82F6)
- **Card**: White (#FFFFFF)
- **Secondary**: Light Blue (#EFF6FF)
- **Muted**: Light Gray (#F8FAFC)
- **Border**: Light Blue (#DBEAFE)

### Dark Mode
- **Background**: Dark (#0D0D0D)
- **Foreground**: Light gray (#E5E5E5)
- **Primary**: Cyan (#38BDF8)
- **Card**: Dark gray (#171717)
- **Muted**: Dark gray (#262626)
- **Border**: Dark gray (#262626)

## Best Practices

### 1. Always Use Semantic Colors
❌ Don't use hardcoded colors:
```tsx
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
```

✅ Use theme-aware colors:
```tsx
<div className="bg-background text-foreground">
```

### 2. Use CSS Variables for Custom Colors
If you need custom colors, define them in `globals.css`:

```css
:root {
  --custom-color: 59 130 246; /* Blue */
}

.dark {
  --custom-color: 56 189 248; /* Cyan */
}

.custom-element {
  background-color: hsl(var(--custom-color));
}
```

### 3. Test Both Themes
Always test your components in both light and dark modes to ensure good contrast and readability.

### 4. Use Transitions
The theme system includes smooth transitions. Don't override them unless necessary.

## Integration Examples

### Header with Theme Toggle
```tsx
<header className="bg-background border-b border-border px-6 py-4">
  <div className="flex items-center justify-between">
    <h1 className="text-foreground font-bold">Hakim AI</h1>
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <LanguageSelector />
    </div>
  </div>
</header>
```

### Form Components
```tsx
<form className="bg-card border border-border rounded-lg p-6">
  <input 
    className="bg-background border border-border text-foreground rounded px-3 py-2"
    placeholder="Enter text..."
  />
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
    Submit
  </button>
</form>
```

### Data Tables
```tsx
<table className="w-full">
  <thead className="bg-muted">
    <tr>
      <th className="text-foreground font-medium p-3 text-left">Name</th>
      <th className="text-foreground font-medium p-3 text-left">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border">
      <td className="text-foreground p-3">John Doe</td>
      <td className="text-muted-foreground p-3">Active</td>
    </tr>
  </tbody>
</table>
```

## Troubleshooting

### Theme Not Switching
1. Check if `ThemeProvider` wraps your app in `layout.tsx`
2. Verify the theme toggle is using `useTheme()` hook
3. Check browser console for errors

### Colors Not Updating
1. Make sure you're using semantic color classes (bg-background, text-foreground, etc.)
2. Check if custom CSS is overriding theme colors
3. Verify Tailwind config includes the color definitions

### Performance Issues
1. Avoid using `theme === "dark"` conditionals in render
2. Use CSS classes instead of inline styles
3. Leverage Tailwind's built-in dark mode utilities

## Migration Guide

To update existing components:

1. **Replace hardcoded colors**:
   ```tsx
   // Before
   className="bg-white dark:bg-gray-900 text-black dark:text-white"
   
   // After
   className="bg-background text-foreground"
   ```

2. **Update conditional styling**:
   ```tsx
   // Before
   className={theme === "dark" ? "bg-gray-900" : "bg-white"}
   
   // After
   className="bg-background"
   ```

3. **Use semantic components**:
   ```tsx
   // Before
   <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
   
   // After
   <Card className="p-4">
   ```

This theme system provides a consistent, accessible, and beautiful experience across your entire application! 