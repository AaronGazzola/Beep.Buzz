# Theme configuration

Select and customize your theme! These styles will be applied to every component in your generated web app.

```css

/**
 * FONT INSTALLATION INSTRUCTIONS:
 * 
 * Add the following imports to your app/layout.tsx:
 * 
 * import { Dm_Sans, Space_Mono } from 'next/font/google'
 * 
 * const fontDm_Sans = Dm_Sans({
 *   subsets: ['latin'],
 *   variable: '--font-dm-sans',
 * })
 * 
 * const fontSpace_Mono = Space_Mono({
 *   subsets: ['latin'],
 *   variable: '--font-space-mono',
 * })
 * 
 * Then add to your html element:
 * <html className={`${fontDm_Sans.variable} ${fontSpace_Mono.variable}`}>
 */

@import "tailwindcss";
@import "tw-animate-css";

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0 0 0);
  --primary: oklch(0.6489 0.237 26.9728);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.968 0.211 109.7692);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.9551 0 0);
  --muted-foreground: oklch(0.3211 0 0);
  --accent: oklch(0.5635 0.2408 260.8178);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0 0 0);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0 0 0);
  --input: oklch(0 0 0);
  --ring: oklch(0.6489 0.237 26.9728);
  --chart-1: oklch(0.6489 0.237 26.9728);
  --chart-2: oklch(0.968 0.211 109.7692);
  --chart-3: oklch(0.5635 0.2408 260.8178);
  --chart-4: oklch(0.7323 0.2492 142.4953);
  --chart-5: oklch(0.5931 0.2726 328.3634);
  --sidebar: oklch(0.9551 0 0);
  --sidebar-foreground: oklch(0 0 0);
  --sidebar-primary: oklch(0.6489 0.237 26.9728);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.5635 0.2408 260.8178);
  --sidebar-accent-foreground: oklch(1 0 0);
  --sidebar-border: oklch(0 0 0);
  --sidebar-ring: oklch(0.6489 0.237 26.9728);

  --font-sans: var(--font-dm-sans), sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-mono: var(--font-space-mono), monospace;
  --letter-spacing: 0px;

  --radius: 0rem;
  --spacing: 0.25rem;
  --shadow: 4px 4px 0px 0px oklch(0.0000 0.0000 0.0000);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(1 0 0);
  --card: oklch(0.3211 0 0);
  --card-foreground: oklch(1 0 0);
  --popover: oklch(0.3211 0 0);
  --popover-foreground: oklch(1 0 0);
  --primary: oklch(0.7044 0.1872 23.1858);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.9691 0.2005 109.6228);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.2178 0 0);
  --muted-foreground: oklch(0.8452 0 0);
  --accent: oklch(0.6755 0.1765 252.2592);
  --accent-foreground: oklch(0 0 0);
  --destructive: oklch(1 0 0);
  --destructive-foreground: oklch(0 0 0);
  --border: oklch(1 0 0);
  --input: oklch(1 0 0);
  --ring: oklch(0.7044 0.1872 23.1858);
  --chart-1: oklch(0.7044 0.1872 23.1858);
  --chart-2: oklch(0.9691 0.2005 109.6228);
  --chart-3: oklch(0.6755 0.1765 252.2592);
  --chart-4: oklch(0.7395 0.2268 142.8504);
  --chart-5: oklch(0.6131 0.2458 328.0714);
  --sidebar: oklch(0 0 0);
  --sidebar-foreground: oklch(1 0 0);
  --sidebar-primary: oklch(0.7044 0.1872 23.1858);
  --sidebar-primary-foreground: oklch(0 0 0);
  --sidebar-accent: oklch(0.6755 0.1765 252.2592);
  --sidebar-accent-foreground: oklch(0 0 0);
  --sidebar-border: oklch(1 0 0);
  --sidebar-ring: oklch(0.7044 0.1872 23.1858);

  --font-sans: var(--font-dm-sans), sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-mono: var(--font-space-mono), monospace;
  --letter-spacing: 0px;

  --radius: 0rem;
  --spacing: 0.25rem;
  --shadow: 4px 4px 0px 0px oklch(0.0000 0.0000 0.0000);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    letter-spacing: var(--letter-spacing);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

.radius {
  border-radius: var(--radius);
}

.shadow {
  box-shadow: var(--shadow);
}

.tracking {
  letter-spacing: var(--letter-spacing);
}

.font-sans {
  font-family: var(--font-sans);
}

.font-serif {
  font-family: var(--font-serif);
}

.font-mono {
  font-family: var(--font-mono);
}

[data-state="checked"].data-checked-bg-primary {
  background-color: var(--primary);
}

[data-state="checked"].data-checked-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-state="unchecked"].data-unchecked-bg-input {
  background-color: var(--input);
}

.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
}

[data-selected-single="true"].data-selected-single-bg-primary {
  background-color: var(--primary);
}

[data-selected-single="true"].data-selected-single-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-start="true"].data-range-start-bg-primary {
  background-color: var(--primary);
}

[data-range-start="true"].data-range-start-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-end="true"].data-range-end-bg-primary {
  background-color: var(--primary);
}

[data-range-end="true"].data-range-end-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-middle="true"].data-range-middle-bg-accent {
  background-color: var(--accent);
}

[data-range-middle="true"].data-range-middle-text-accent-foreground {
  color: var(--accent-foreground);
}

.focus-border-ring:focus-visible {
  border-color: var(--ring);
}

.focus-ring-color:focus-visible {
  --tw-ring-color: var(--ring);
}
```
