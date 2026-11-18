"use client";

import { useCallback, useState, type DragEvent } from "react";

export interface UseDropzoneOptions {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
}

/** Just DOM event state — no upload logic lives here. */
export function useDropzone({ onFiles, multiple = true, disabled = false }: UseDropzoneOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((event: DragEvent) => {
    if (disabled) return;
    event.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    onFiles(multiple ? files : files.slice(0, 1));
  }, [disabled, multiple, onFiles]);

  return { isDragging, onDragOver, onDragLeave, onDrop };
}
