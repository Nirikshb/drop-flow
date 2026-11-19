"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HouseIcon,
  ImagesIcon,
  PanelRightIcon,
  PlusIcon,
  SearchIcon,
  UploadCloudIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/dashboard", icon: HouseIcon },
  { label: "Assets", href: "/figmadesign", icon: ImagesIcon },
  { label: "Uploads", href: "/dashboard/uploads", icon: UploadCloudIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/figmadesign") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader({
  query,
  onQueryChange,
  onToggleDetails,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onToggleDetails: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#e5e5e5] bg-[#f6f6f6] px-4">
      <div className="hidden items-center gap-1 md:flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
                active
                  ? "border border-[#e5e5e5] bg-white font-medium text-black shadow-sm"
                  : "border border-transparent text-[#5b5b5b] hover:bg-black/5",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="relative min-w-0 flex-1 md:ml-2 md:max-w-[537px]">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7c7c7c]" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Find asset"
          aria-label="Find asset"
          className="h-8 w-full rounded-md border border-[#e5e5e5] bg-white pl-9 pr-3 text-sm text-[#5b5b5b] outline-none placeholder:text-[#9a9a9a] focus:border-[#7b61ff] focus:ring-2 focus:ring-[#7b61ff]/30"
        />
      </div>

      <Link
        href="/dashboard/uploads"
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-[#7b61ff] px-3 text-sm font-medium text-white outline-none transition-colors hover:bg-[#6a50f0] focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
      >
        <PlusIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Upload</span>
      </Link>

      <button
        type="button"
        onClick={onToggleDetails}
        aria-label="Toggle details"
        className="ml-auto grid size-8 shrink-0 place-items-center rounded-md text-[#5b5b5b] outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
      >
        <PanelRightIcon className="size-4" aria-hidden="true" />
      </button>
    </header>
  );
}
