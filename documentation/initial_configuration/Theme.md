# Theme configuration

Select and customize your theme! These styles will be applied to every component in your generated web app.

```css

/**
 * FONT INSTALLATION INSTRUCTIONS:
 * 
 * Add the following imports to your app/layout.tsx:
 * 
 * import { Plus_Jakarta, Lora, Ibm_Plex } from 'next/font/google'
 * 
 * const fontPlus_Jakarta = Plus_Jakarta({
 *   subsets: ['latin'],
 *   variable: '--font-plus-jakarta',
 * })
 * 
 * const fontLora = Lora({
 *   weight: ['300', '400', '700'],
 *   subsets: ['latin'],
 *   variable: '--font-lora',
 * })
 * 
 * const fontIbm_Plex = Ibm_Plex({
 *   subsets: ['latin'],
 *   variable: '--font-ibm-plex',
 * })
 * 
 * Then add to your html element:
 * <html className={`${fontPlus_Jakarta.variable} ${fontLora.variable} ${fontIbm_Plex.variable}`}>
 */

@import "tailwindcss";
@import "tw-animate-css";

:root {
  --background: oklch(0.994 0 0);
  --foreground: oklch(0 0 0);
  --card: oklch(0.994 0 0);
  --card-foreground: oklch(0 0 0);
  --popover: oklch(0.9911 0 0);
  --popover-foreground: oklch(0 0 0);
  --primary: oklch(0.5393 0.2713 286.7462);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.954 0.0063 255.4755);
  --secondary-foreground: oklch(0.1344 0 0);
  --muted: oklch(0.9702 0 0);
  --muted-foreground: oklch(0.4386 0 0);
  --accent: oklch(0.9393 0.0288 266.368);
  --accent-foreground: oklch(0.5445 0.1903 259.4848);
  --destructive: oklch(0.629 0.1902 23.0704);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.93 0.0094 286.2156);
  --input: oklch(0.9401 0 0);
  --ring: oklch(0 0 0);
  --chart-1: oklch(0.7459 0.1483 156.4499);
  --chart-2: oklch(0.5393 0.2713 286.7462);
  --chart-3: oklch(0.7336 0.1758 50.5517);
  --chart-4: oklch(0.5828 0.1809 259.7276);
  --chart-5: oklch(0.559 0 0);
  --sidebar: oklch(0.9777 0.0051 247.8763);
  --sidebar-foreground: oklch(0 0 0);
  --sidebar-primary: oklch(0 0 0);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.9401 0 0);
  --sidebar-accent-foreground: oklch(0 0 0);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0 0 0);

  --font-sans: var(--font-plus-jakarta), sans-serif;
  --font-serif: var(--font-lora), serif;
  --font-mono: var(--font-ibm-plex), monospace;
  --font: var(--font-sans);
  --letter-spacing: -0.025px;

  --radius: 1.4rem;
  --spacing: 0.27rem;
  --shadow: 0px 2px 3px 0px oklch(0.0000 0.0000 0.0000 / 0.16);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

.dark {
  --background: oklch(0.2223 0.006 271.1393);
  --foreground: oklch(0.9551 0 0);
  --card: oklch(0.2568 0.0076 274.6528);
  --card-foreground: oklch(0.9551 0 0);
  --popover: oklch(0.2568 0.0076 274.6528);
  --popover-foreground: oklch(0.9551 0 0);
  --primary: oklch(0.6132 0.2294 291.7437);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.294 0.013 272.9312);
  --secondary-foreground: oklch(0.9551 0 0);
  --muted: oklch(0.294 0.013 272.9312);
  --muted-foreground: oklch(0.7058 0 0);
  --accent: oklch(0.2795 0.0368 260.031);
  --accent-foreground: oklch(0.7857 0.1153 246.6596);
  --destructive: oklch(0.7106 0.1661 22.2162);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.3289 0.0092 268.3843);
  --input: oklch(0.3289 0.0092 268.3843);
  --ring: oklch(0.6132 0.2294 291.7437);
  --chart-1: oklch(0.8003 0.1821 151.711);
  --chart-2: oklch(0.6132 0.2294 291.7437);
  --chart-3: oklch(0.8077 0.1035 19.5706);
  --chart-4: oklch(0.6691 0.1569 260.1063);
  --chart-5: oklch(0.7058 0 0);
  --sidebar: oklch(0.2011 0.0039 286.0396);
  --sidebar-foreground: oklch(0.9551 0 0);
  --sidebar-primary: oklch(0.6132 0.2294 291.7437);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.294 0.013 272.9312);
  --sidebar-accent-foreground: oklch(0.6132 0.2294 291.7437);
  --sidebar-border: oklch(0.3289 0.0092 268.3843);
  --sidebar-ring: oklch(0.6132 0.2294 291.7437);

  --font-sans: var(--font-plus-jakarta), sans-serif;
  --font-serif: var(--font-lora), serif;
  --font-mono: var(--font-ibm-plex), monospace;
  --font: var(--font-sans);
  --letter-spacing: 0px;

  --radius: 1.4rem;
  --spacing: 0.25rem;
  --shadow: 0px 2px 3px 0px oklch(0.0000 0.0000 0.0000 / 0.16);
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
    @apply bg-background text-foreground font;
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

.font {
  font-family: var(--font);
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
