"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SearchX, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  type CategoryFilter,
  type Integration,
} from "../_data/integrations";
import { getAccent, getGlyphIcon } from "../_lib/visuals";

interface IntegrationsBrowserProps {
  integrations: Integration[];
}

export function IntegrationsBrowser({ integrations }: IntegrationsBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return integrations.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [integrations, query, category]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  const hasFilters = query.trim().length > 0 || category !== "All";

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-5">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search integrations..."
            aria-label="Search integrations"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Category
          </span>
          {CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                category === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          of {integrations.length} integrations
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = getGlyphIcon(item.glyph);
            const accent = getAccent(item.accent);
            return (
              <Link
                key={item.slug}
                href={`/integrationsnew/${item.slug}`}
                className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-lg text-white shadow-sm",
                      accent.tile,
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <Badge variant="secondary" className="font-normal">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold">{item.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.shortDescription}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View integration
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-base font-semibold">No integrations found</h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Try a different search term or clear the filters to see every
            integration.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
