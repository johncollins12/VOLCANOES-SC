'use client';

import { useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2, type LucideIcon } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  className?: string;
}

/**
 * WRAPPER, not a full WYSIWYG implementation. This renders a styled
 * `contentEditable` surface with a formatting toolbar (bold/italic/lists/
 * link/heading via `document.execCommand`, still broadly supported for
 * this exact use case) so admin forms — news articles, match reports,
 * club history/vision-mission text — have a working rich-text field today
 * without pulling in a heavy editor dependency (TipTap, Lexical, etc.)
 * before we know the real content requirements.
 *
 * The component boundary is deliberate: every call site imports
 * `RichTextEditor` from this one file, so swapping the internals for a
 * proper editor library later is a one-file change, not a find-and-replace
 * across every admin form that edits long-form text.
 */
export function RichTextEditor({ id, label, value, onChange, hint, error, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    onChange(editorRef.current?.innerHTML ?? '');
  }

  function handleLink() {
    const url = window.prompt('Link URL');
    if (url) exec('createLink', url);
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className={cn('rounded-card border border-border bg-surface', error && 'border-danger')}>
        <div className="flex items-center gap-0.5 border-b border-border p-1.5" role="toolbar" aria-label="Formatting">
          <ToolbarButton icon={Bold} label="Bold" onClick={() => exec('bold')} />
          <ToolbarButton icon={Italic} label="Italic" onClick={() => exec('italic')} />
          <ToolbarButton icon={Heading2} label="Heading" onClick={() => exec('formatBlock', '<h2>')} />
          <ToolbarButton icon={List} label="Bulleted list" onClick={() => exec('insertUnorderedList')} />
          <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={() => exec('insertOrderedList')} />
          <ToolbarButton icon={LinkIcon} label="Insert link" onClick={handleLink} />
        </div>

        <div
          ref={editorRef}
          id={id}
          role="textbox"
          aria-multiline="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: value }}
          className="max-w-none px-3.5 py-3 text-sm text-ink focus:outline-none [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-cyan [&_a]:underline"
        />
      </div>

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

function ToolbarButton({ icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return <IconButton icon={icon} aria-label={label} size="sm" variant="ghost" onClick={onClick} type="button" />;
}
