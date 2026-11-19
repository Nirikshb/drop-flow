"use client";

import { Share2Icon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "../_data/tasks";
import { FeatureTable } from "./feature-table";

export function PlanContent({
  tasks,
  selectedId,
  onToggleSelect,
  onSelectTask,
}: {
  tasks: Task[];
  selectedId: string | null;
  onToggleSelect: (id: string) => void;
  onSelectTask: (id: string) => void;
}) {
  return (
    <section className="w-full overflow-hidden rounded-lg bg-white text-black">
      {/* Title row — 52px */}
      <div className="flex h-[52px] items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-medium leading-none text-black">Q3 Plan</h2>
          <StarIcon aria-hidden="true" className="size-[15px] shrink-0 fill-[#f5b301] text-[#f5b301]" />
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-[#3c3c3c] outline-none transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
        >
          <Share2Icon aria-hidden="true" className="size-4" />
          Share
        </button>
      </div>

      {/* Tabs row — 48px */}
      <div className="flex h-[48px] items-stretch gap-6 border-b border-[#e5e5e5] px-4 text-[13px]">
        <button
          type="button"
          className={cn(
            "relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
            "text-[#7c7c7c]",
          )}
        >
          Overview
        </button>
        <button
          type="button"
          aria-current="page"
          className={cn(
            "relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
            "gap-1.5 font-medium text-black",
          )}
        >
          Tasks
          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f0f0f0] px-1 text-[11px] font-medium leading-none text-[#6b6b6b]">
            {tasks.length}
          </span>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-[#7b61ff]" />
        </button>
      </div>

      <FeatureTable
        tasks={tasks}
        selectedId={selectedId}
        onToggleSelect={onToggleSelect}
        onSelectTask={onSelectTask}
      />
    </section>
  );
}
