"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { Job } from "../_data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ALL = "all";

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort();
}

interface SelectFilterProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-8 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
      >
        <option value={ALL}>All {label.toLowerCase()}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <SlidersHorizontal
        className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </label>
  );
}

export function JobFilters({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [arrangement, setArrangement] = useState(ALL);

  const options = useMemo(
    () => ({
      departments: uniqueSorted(jobs.map((job) => job.department)),
      locations: uniqueSorted(jobs.map((job) => job.location)),
      arrangements: uniqueSorted(jobs.map((job) => job.workArrangement)),
    }),
    [jobs],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !needle ||
        [job.title, job.department, job.location, job.summary].some((field) =>
          field.toLowerCase().includes(needle),
        );
      const matchesDepartment =
        department === ALL || job.department === department;
      const matchesLocation = location === ALL || job.location === location;
      const matchesArrangement =
        arrangement === ALL || job.workArrangement === arrangement;

      return (
        matchesQuery &&
        matchesDepartment &&
        matchesLocation &&
        matchesArrangement
      );
    });
  }, [jobs, query, department, location, arrangement]);

  const hasFilters =
    query.trim() !== "" ||
    department !== ALL ||
    location !== ALL ||
    arrangement !== ALL;

  function clearFilters() {
    setQuery("");
    setDepartment(ALL);
    setLocation(ALL);
    setArrangement(ALL);
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative block">
          <span className="sr-only">Search roles</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles"
            aria-label="Search roles"
            className="h-9 pl-9"
          />
        </label>
        <SelectFilter
          label="Department"
          value={department}
          options={options.departments}
          onChange={setDepartment}
        />
        <SelectFilter
          label="Location"
          value={location}
          options={options.locations}
          onChange={setLocation}
        />
        <SelectFilter
          label="Work arrangement"
          value={arrangement}
          options={options.arrangements}
          onChange={setArrangement}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "open role" : "open roles"}
          {hasFilters && " matching your filters"}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border bg-card text-muted-foreground">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-base font-semibold">No roles match yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try a different keyword or clear a filter. New roles are posted here
            as the team grows.
          </p>
          <Button className="mt-5" variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((job) => (
            <Link
              key={job.slug}
              href={`/careersnew/${job.slug}`}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-snug group-hover:text-primary">
                      {job.title}
                    </CardTitle>
                    <ArrowRight
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {job.location}
                    </span>
                    <span className="tabular-nums">{job.compensation}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="font-normal">
                      {job.department}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {job.workArrangement}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {job.employmentType}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Open · {job.employmentType}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-primary">
                    View role
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
