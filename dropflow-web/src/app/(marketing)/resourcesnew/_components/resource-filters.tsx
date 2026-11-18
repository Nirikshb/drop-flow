"use client";

import { useMemo, useState } from "react";
import { ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { resourceCategories, resourceTypes, type Resource, type ResourceType } from "../_data/resources";
import { ResourceCard } from "./resource-card";

type TypeFilter = "All" | ResourceType;

const typeFilters: TypeFilter[] = ["All", ...resourceTypes];
const categoryFilters: string[] = ["All", ...resourceCategories];

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function ResourceFilters({ resources }: { resources: Resource[] }) {
  const [activeType, setActiveType] = useState<TypeFilter>("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () =>
      resources.filter(
        (resource) =>
          (activeType === "All" || resource.type === activeType) &&
          (activeCategory === "All" || resource.category === activeCategory),
      ),
    [resources, activeType, activeCategory],
  );

  const hasFilters = activeType !== "All" || activeCategory !== "All";

  function reset() {
    setActiveType("All");
    setActiveCategory("All");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <ListFilter className="size-3.5" aria-hidden="true" />
            Format
          </span>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={activeType === type}
                onClick={() => setActiveType(type)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Topic
          </span>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((category) => (
              <FilterChip
                key={category}
                label={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          of {resources.length} resources
        </p>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-muted-foreground"
          >
            <X aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed bg-card/50 p-10 text-center">
          <p className="text-sm font-medium">No resources match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different format or topic.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-4"
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
