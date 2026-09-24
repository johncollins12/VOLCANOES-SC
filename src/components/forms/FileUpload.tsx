'use client';

import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  /** Called with the newly chosen files (from either the click-to-browse input or a drop). Upload/storage logic lives in the caller — see src/lib/supabase/storage.ts — this component only collects files. */
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

/**
 * Generic drag-and-drop file picker — the base for admin uploads (gallery
 * photos, player headshots, PDF documents). Deliberately upload-agnostic:
 * it hands back `File[]` and lets the caller decide what to do with them
 * (e.g. pass to Supabase Storage via src/lib/supabase/storage.ts), so this
 * one component works for images, PDFs, or any other accepted type.
 *
 * See ImageUploadField (src/components/cms/ImageUploadField.tsx) for the
 * image-specific version of this with a live preview grid.
 */
export function FileUpload({
  id,
  label = 'Upload files',
  hint,
  error,
  accept,
  multiple,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<File[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    setSelected(files);
    onFilesSelected(files);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    const next = selected.filter((_, i) => i !== index);
    setSelected(next);
    onFilesSelected(next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors',
          isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-cyan',
          error && 'border-danger',
          className
        )}
      >
        <UploadCloud className="h-8 w-8 text-muted" aria-hidden />
        <p className="text-sm text-ink">
          <span className="font-semibold text-cyan">Click to upload</span> or drag and drop
        </p>
        {accept && <p className="text-xs text-muted">Accepted: {accept}</p>}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </div>

      {selected.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {selected.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-card border border-border bg-surface-muted px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-ink">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="shrink-0 text-muted hover:text-danger"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
