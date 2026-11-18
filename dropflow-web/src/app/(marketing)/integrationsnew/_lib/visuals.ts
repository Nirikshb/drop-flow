import {
  Blocks,
  Boxes,
  Feather,
  Globe2,
  LayoutTemplate,
  Leaf,
  Notebook,
  ShoppingBag,
  Table2,
  type LucideIcon,
} from "lucide-react";

/** Maps the `glyph` field in the integration data to an icon component. */
const glyphs: Record<string, LucideIcon> = {
  Boxes,
  Blocks,
  Leaf,
  Globe2,
  ShoppingBag,
  Notebook,
  LayoutTemplate,
  Table2,
  Feather,
};

export function getGlyphIcon(name: string): LucideIcon {
  return glyphs[name] ?? Boxes;
}

interface AccentStyle {
  /** Solid icon tile gradient. */
  tile: string;
  /** Soft page-header gradient (used with `bg-gradient-to-br`). */
  header: string;
  /** Small accent bar used under headings. */
  bar: string;
}

/** Full literal class strings so Tailwind can detect them at build time. */
const accents: Record<string, AccentStyle> = {
  sky: {
    tile: "bg-gradient-to-br from-sky-500 to-cyan-500",
    header: "from-sky-500/20 via-cyan-400/10 to-transparent",
    bar: "from-sky-500 to-cyan-500",
  },
  rose: {
    tile: "bg-gradient-to-br from-rose-500 to-pink-500",
    header: "from-rose-500/20 via-pink-400/10 to-transparent",
    bar: "from-rose-500 to-pink-500",
  },
  emerald: {
    tile: "bg-gradient-to-br from-emerald-500 to-teal-500",
    header: "from-emerald-500/20 via-teal-400/10 to-transparent",
    bar: "from-emerald-500 to-teal-500",
  },
  blue: {
    tile: "bg-gradient-to-br from-blue-500 to-indigo-500",
    header: "from-blue-500/20 via-indigo-400/10 to-transparent",
    bar: "from-blue-500 to-indigo-500",
  },
  lime: {
    tile: "bg-gradient-to-br from-lime-500 to-emerald-500",
    header: "from-lime-500/20 via-emerald-400/10 to-transparent",
    bar: "from-lime-500 to-emerald-500",
  },
  slate: {
    tile: "bg-gradient-to-br from-slate-600 to-slate-800",
    header: "from-slate-500/20 via-slate-400/10 to-transparent",
    bar: "from-slate-600 to-slate-800",
  },
  indigo: {
    tile: "bg-gradient-to-br from-indigo-500 to-violet-500",
    header: "from-indigo-500/20 via-violet-400/10 to-transparent",
    bar: "from-indigo-500 to-violet-500",
  },
  amber: {
    tile: "bg-gradient-to-br from-amber-500 to-orange-500",
    header: "from-amber-500/20 via-orange-400/10 to-transparent",
    bar: "from-amber-500 to-orange-500",
  },
  violet: {
    tile: "bg-gradient-to-br from-violet-500 to-purple-500",
    header: "from-violet-500/20 via-purple-400/10 to-transparent",
    bar: "from-violet-500 to-purple-500",
  },
};

export function getAccent(key: string): AccentStyle {
  return accents[key] ?? accents.sky;
}
