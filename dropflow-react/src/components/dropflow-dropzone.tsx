"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";
import { useDropzone } from "../hooks/use-dropzone.js";

export function DropflowDropzone({
  onFiles,
  multiple = true,
  accept,
  children,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  children?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, onDragOver, onDragLeave, onDrop } = useDropzone({ onFiles, multiple });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-dragging={isDragging}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} hidden onChange={onChange} />
      <button type="button" onClick={() => inputRef.current?.click()}>Browse files</button>
      {children}
    </div>
  );
}
