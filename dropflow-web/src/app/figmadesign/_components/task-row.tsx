"use client";

import { MessageCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "../_data/tasks";
import { AvatarStack, ProgressIcon, SelectionCircle, UrgencyBars } from "./primitives";

function splitKey(key: string): { prefix: string; number: string } {
  const dash = key.lastIndexOf("-");
  if (dash < 0) return { prefix: key, number: "" };
  return { prefix: key.slice(0, dash + 1), number: key.slice(dash + 1) };
}

export function TaskRow({
  task,
  selected,
  onToggleSelect,
  onSelectTask,
}: {
  task: Task;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectTask: (id: string) => void;
}) {
  const { prefix, number } = splitKey(task.key);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${task.key}: ${task.title}`}
      onClick={() => onSelectTask(task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectTask(task.id);
        }
      }}
      className={cn(
        "grid h-[48px] grid-cols-[minmax(0,539fr)_140px_140px_120px] items-center border-b border-[#e5e5e5] px-4 text-[13px] text-black outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7b61ff]/50",
        selected ? "bg-[#f7f5ff]" : "bg-white hover:bg-[#fafafa]",
      )}
    >
      {/* Feature */}
      <div className="flex min-w-0 items-center gap-3 pr-3">
        <SelectionCircle
          selected={selected}
          onToggle={() => onToggleSelect(task.id)}
          label={`Select ${task.key}`}
        />
        <span className="shrink-0 whitespace-nowrap text-sm leading-none text-[#7c7c7c]">
          <span>{prefix}</span>
          <span className="font-medium text-[#6b6b6b]">{number}</span>
        </span>
        <span className="truncate font-normal text-black">{task.title}</span>
        {task.comments > 0 ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] leading-none text-[#7c7c7c]">
            <MessageCircleIcon aria-hidden="true" className="size-[13px]" />
            {task.comments}
          </span>
        ) : null}
      </div>

      {/* Progress */}
      <div className="flex min-w-0 items-center gap-2 pr-2">
        <ProgressIcon progress={task.progress} />
        <span className="truncate whitespace-nowrap">{task.progress}</span>
      </div>

      {/* Urgency */}
      <div className="flex min-w-0 items-center gap-2 pr-2">
        <UrgencyBars urgency={task.urgency} />
        <span className="truncate whitespace-nowrap">{task.urgency}</span>
      </div>

      {/* Assigned to */}
      <div className="flex items-center justify-end">
        <AvatarStack ids={task.assignees} />
      </div>
    </div>
  );
}
