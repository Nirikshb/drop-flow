"use client";

import { cn } from "@/lib/utils";
import type { Task } from "../_data/tasks";
import { TaskRow } from "./task-row";

const COLUMNS = ["Feature", "Progress", "Urgency", "Assigned to"] as const;

export function FeatureTable({
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
    <div className="w-full">
      {/* Table header — 47px */}
      <div className="grid h-[47px] grid-cols-[minmax(0,539fr)_140px_140px_120px] items-center border-b border-[#e5e5e5] px-4 text-xs text-[#7c7c7c]">
        {COLUMNS.map((column, index) => (
          <span key={column} className={cn(index === COLUMNS.length - 1 && "text-right")}>
            {column}
          </span>
        ))}
      </div>

      <div>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            selected={task.selected || task.id === selectedId}
            onToggleSelect={onToggleSelect}
            onSelectTask={onSelectTask}
          />
        ))}
      </div>
    </div>
  );
}
