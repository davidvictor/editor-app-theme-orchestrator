# Dynamic App Theming From VSCode/Monaco Themes

This file describes how to ingest a VSCode theme JSON, apply it to Monaco Editor, extract the relevant colors, and drive your Tailwind CSS UI with those colors at runtime. Hand this to an engineer and they can build it.

---

## Step 1: Define the End-to-End Pipeline

1. User uploads a VSCode theme JSON file.  
2. Parse and validate the JSON.  
3. Normalize color values.  
4. Apply the theme to Monaco with `defineTheme` and `setTheme`.  
5. Resolve an app palette from the theme’s `colors` map (with fallbacks and derived shades).  
6. Write CSS variables like `--frame-bg`, `--accent`, etc on `:root` (or a scoped wrapper).  
7. Tailwind utilities (bg-frame-bg, text-frame-fg, etc) reference those vars and update instantly.  
8. Optional: derive tints/shades (lighten, darken), persist user choice, allow user tweaks.  
9. Test across popular themes and handle edge cases.

---

## Step 2: Parse and Validate the Uploaded Theme

Create a schema so you always know what you get back.

```ts
// src/types/theme.ts
import { z } from "zod";

export const vscodeThemeSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["dark", "light", "hc-light", "hc-dark"]).optional(),
  colors: z.record(z.string()).default({}),
  tokenColors: z.array(z.any()).optional(),
});

export type VSCodeTheme = z.infer<typeof vscodeThemeSchema>;

export function parseTheme(json: unknown): VSCodeTheme {
  return vscodeThemeSchema.parse(json);
}
```

---

## Step 3: Normalize Color Values

Guarantee consistent formats (lowercase hex, etc).

```ts
// src/lib/normalizeColors.ts
export function normalizeHex(value: string): string {
  if (value.startsWith("#") && value.length === 4) {
    const r = value[1], g = value[2], b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return value.toLowerCase();
}

export function normalizeThemeColors(colors: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(colors)) out[k] = normalizeHex(v);
  return out;
}
```

---

## Step 4: Apply the Theme to Monaco

```ts
// src/lib/monacoTheme.ts
import * as monaco from "monaco-editor";
import { VSCodeTheme } from "../types/theme";

export function applyMonacoTheme(id: string, theme: VSCodeTheme) {
  const base = theme.type === "light" ? "vs" : "vs-dark";

  monaco.editor.defineTheme(id, {
    base,
    inherit: true,
    rules: [], // optionally map tokenColors here
    colors: theme.colors ?? {},
  });

  monaco.editor.setTheme(id);
}
```

If you plan to read CSS variables from Monaco after application, wait one frame:

```ts
await new Promise(r => requestAnimationFrame(r));
```

---

## Step 5: Map VSCode Tokens to Your UI Tokens

Decide which VSCode color keys drive which parts of your UI.

| App token         | CSS var          | Default fallback | Candidate VSCode keys (priority order)                                |
|-------------------|------------------|------------------|------------------------------------------------------------------------|
| frameBg           | --frame-bg       | #1e1e1e          | editor.background, sideBar.background, editorGroupHeader.tabsBackground |
| frameFg           | --frame-fg       | #cccccc          | editor.foreground, foreground                                          |
| surfaceBg         | --surface-bg     | lighten(bg, 6%)  | editor.selectionBackground, input.background                           |
| borderColor       | --border-color   | lighten(bg, 12%) | focusBorder, editorWidget.border                                       |
| accent            | --accent         | #4f46e5          | button.background, activityBarBadge.background                         |
| accentFg          | --accent-fg      | #ffffff          | button.foreground, activityBarBadge.foreground                         |

Implementation:

```ts
// src/lib/palette.ts
import { normalizeHex } from "./normalizeColors";
import { lighten } from "./colorUtils";

export type AppPalette = {
  frameBg: string;
  frameFg: string;
  surfaceBg: string;
  borderColor: string;
  accent: string;
  accentFg: string;
};

const tokenMap = {
  frameBg: ["editor.background", "sideBar.background", "editorGroupHeader.tabsBackground"],
  frameFg: ["editor.foreground", "foreground"],
  surfaceBg: ["editor.selectionBackground", "input.background"],
  borderColor: ["focusBorder", "editorWidget.border"],
  accent: ["button.background", "activityBarBadge.background"],
  accentFg: ["button.foreground", "activityBarBadge.foreground"],
} as const;

export function resolvePalette(
  colors: Record<string, string>,
  defaults: Partial<AppPalette> = {}
): AppPalette {
  const pick = (keys: readonly string[], fallback: string) => {
    for (const k of keys) if (colors[k]) return normalizeHex(colors[k]);
    return fallback;
  };

  const frameBg = pick(tokenMap.frameBg, defaults.frameBg ?? "#1e1e1e");
  const frameFg = pick(tokenMap.frameFg, defaults.frameFg ?? "#cccccc");
  const surfaceBg = pick(tokenMap.surfaceBg, defaults.surfaceBg ?? lighten(frameBg, 0.06));
  const borderColor = pick(tokenMap.borderColor, defaults.borderColor ?? lighten(frameBg, 0.12));
  const accent = pick(tokenMap.accent, defaults.accent ?? "#4f46e5");
  const accentFg = pick(tokenMap.accentFg, defaults.accentFg ?? "#ffffff");

  return { frameBg, frameFg, surfaceBg, borderColor, accent, accentFg };
}
```

---

## Step 6: Implement Lighten and Darken Helpers

```ts
// src/lib/colorUtils.ts
export function lighten(hex: string, amount = 0.1): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s, Math.min(1, l + amount));
}

export function darken(hex: string, amount = 0.1): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s, Math.max(0, l - amount));
}

function hexToHSL(H: string) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else {
    r = parseInt(H[1] + H[2], 16);
    g = parseInt(H[3] + H[4], 16);
    b = parseInt(H[5] + H[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number) {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
```

---

## Step 7: Write CSS Variables at Runtime

```ts
// src/lib/applyCssVars.ts
import { AppPalette } from "./palette";

export function applyCssVars(palette: AppPalette, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--frame-bg", palette.frameBg);
  root.style.setProperty("--frame-fg", palette.frameFg);
  root.style.setProperty("--surface-bg", palette.surfaceBg);
  root.style.setProperty("--border-color", palette.borderColor);
  root.style.setProperty("--accent", palette.accent);
  root.style.setProperty("--accent-fg", palette.accentFg);
}
```

Call this after resolving the palette.

---

## Step 8: Integrate With Tailwind

### Option A: Tailwind v3 (config based)

**Global CSS**

```css
/* src/styles/theme-vars.css */
:root {
  --frame-bg: #1e1e1e;
  --frame-fg: #cccccc;
  --surface-bg: #2a2a2a;
  --border-color: #333333;
  --accent: #4f46e5;
  --accent-fg: #ffffff;
}
```

**tailwind.config.js**

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        "frame-bg": "var(--frame-bg)",
        "frame-fg": "var(--frame-fg)",
        "surface-bg": "var(--surface-bg)",
        "border-color": "var(--border-color)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)",
      },
    },
  },
};
```

Use them:

```html
<header class="bg-frame-bg text-frame-fg border-b border-border-color">...</header>
<button class="bg-accent text-accent-fg hover:bg-frame-bg hover:text-frame-fg">...</button>
```

### Option B: Tailwind v4 (@theme directive)

```css
/* src/styles/theme.css */
@theme {
  --color-frame-bg: var(--frame-bg);
  --color-frame-fg: var(--frame-fg);
  --color-surface-bg: var(--surface-bg);
  --color-border: var(--border-color);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);
}
```

Tailwind will auto-generate utilities bound to these vars. Confirm the exact class names in your build.

---

## Step 9: React Hook to Tie It Together

```tsx
// src/hooks/useApplyTheme.ts
import { useEffect } from "react";
import { parseTheme, VSCodeTheme } from "../types/theme";
import { applyMonacoTheme } from "../lib/monacoTheme";
import { normalizeThemeColors } from "../lib/normalizeColors";
import { resolvePalette } from "../lib/palette";
import { applyCssVars } from "../lib/applyCssVars";

export function useApplyTheme(themeJson: unknown, monacoId = "user-theme") {
  useEffect(() => {
    if (!themeJson) return;
    const theme: VSCodeTheme = parseTheme(themeJson);

    // 1. Apply to Monaco
    applyMonacoTheme(monacoId, theme);

    // 2. Resolve palette
    const normalizedColors = normalizeThemeColors(theme.colors ?? {});
    const palette = resolvePalette(normalizedColors, {});

    // 3. Write CSS vars
    applyCssVars(palette);
  }, [themeJson, monacoId]);
}
```

Usage:

```tsx
function App({ uploadedTheme }: { uploadedTheme: any }) {
  useApplyTheme(uploadedTheme);
  return (
    <div className="bg-frame-bg text-frame-fg">
      <Header />
      <EditorContainer />
    </div>
  );
}
```

---

## Step 10: Optional Path to Read Monaco CSS Vars

If you want Monaco’s resolved defaults instead of your own mapping:

```ts
applyMonacoTheme("user-theme", theme);
await new Promise(r => requestAnimationFrame(r));
const el = document.querySelector(".monaco-editor") as HTMLElement;
const bg = getComputedStyle(el).getPropertyValue("--vscode-editor-background").trim();
// Use bg to override frameBg, etc
```

Still keep fallbacks for missing keys.

---

## Step 11: Persistence, UX, and Edge Cases

- Persist the uploaded theme (localStorage or backend) so it loads on refresh.  
- Provide a small UI to tweak derived values (accent color, lighten amount).  
- Always fallback to defaults if a key is missing.  
- Handle rgba or 8 digit hex gracefully.  
- Ensure text contrast: run a quick contrast check if necessary.  
- Avoid Flash of Unthemed Content: default vars in CSS ensure UI looks consistent before JS runs.  
- Consider scoping: apply vars to a container if you want multiple themed areas simultaneously.

---

## Step 12: Testing, Safeguards, and Future Enhancements

- Test with several popular themes like Dracula, One Dark Pro, Solarized Light.  
- Rapidly switch themes to catch timing issues.  
- Verify Tailwind classes update without rebuild (they should, since they point to CSS vars).  
- Future enhancements:
  - Pre-generate palettes for known themes and offer quick theme switching with `[data-theme]`.
  - Map more VSCode keys for richer parity (inputs, tabs, hover states).
  - Build a CLI or script to extract an app palette from a theme file for offline builds.
  - Offer a palette preview component so users see the impact before applying globally.

---

**Done.** Copy this file into your repo (for example `THEMING_GUIDE.md`) and hand it to the team.

