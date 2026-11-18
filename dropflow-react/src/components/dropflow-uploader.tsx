"use client";

import { useRef, type ChangeEvent } from "react";
import { useDropzone } from "../hooks/use-dropzone.js";
import { useUpload } from "../hooks/use-upload.js";

/** Self-contained uploader built from the two hooks — no duplicated protocol. */
export function DropflowUploader({ accept, multiple = true }: { accept?: string; multiple?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, cancel, reset, status, progress, asset, error } = useUpload();

  const selectFiles = (files: File[]) => {
    if (files[0]) void upload(files[0]);
  };
  const { isDragging, onDragOver, onDragLeave, onDrop } = useDropzone({
    onFiles: selectFiles, multiple,
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-dragging={isDragging}
      style={{
        border: `2px dashed ${isDragging ? "#4f46e5" : "#cbd5e1"}`,
        borderRadius: 12, padding: 32, textAlign: "center",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onInputChange}
        hidden
      />
      <button type="button" onClick={() => inputRef.current?.click()}>Choose a file</button>
      <p>or drop it here</p>
      {status === "uploading" && (
        <div>
          <progress value={progress.percentage} max={100} />
          <span>{Math.round(progress.percentage)}%</span>
          <button type="button" onClick={cancel}>Cancel</button>
        </div>
      )}
      {status === "completed" && asset && (
        <div>
          <p>Uploaded: {asset.originalFilename}</p>
          <a href={asset.url}>{asset.url}</a>
          <button type="button" onClick={reset}>Upload another</button>
        </div>
      )}
      {status === "failed" && <p role="alert">{error?.message}</p>}
      {status === "cancelled" && <p>Upload cancelled.</p>}
    </div>
  );
}
