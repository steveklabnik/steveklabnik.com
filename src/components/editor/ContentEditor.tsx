import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import MarkdownIt from "markdown-it";
import EditorTextArea from "./EditorTextArea";

const md = new MarkdownIt({ html: true });

interface Props {
  title: string;
  body: string;
  onSave: (data: { title: string; body: string }) => Promise<void>;
  onClose: () => void;
  /** Optional preprocessing of markdown before rendering preview */
  preprocessMarkdown?: (src: string) => string;
  /** Extra fields rendered between title and textarea */
  extraFields?: ReactNode;
  /** Sidebar rendered to the right of the preview */
  sidebar?: ReactNode;
  /** Ref callback for the textarea element (used by WikiLinkAutocomplete) */
  textareaRef?: React.RefCallback<HTMLTextAreaElement>;
  /** Children rendered as overlays on top of the textarea (e.g. autocomplete) */
  children?: ReactNode;
}

export default function ContentEditor({
  title: initialTitle,
  body: initialBody,
  onSave,
  onClose,
  preprocessMarkdown,
  extraFields,
  sidebar,
  textareaRef,
  children,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  // Debounced preview
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const src = preprocessMarkdown ? preprocessMarkdown(body) : body;
      setPreview(md.render(src));
    }, 150);
    return () => clearTimeout(timerRef.current);
  }, [body, preprocessMarkdown]);

  // beforeunload guard
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave({ title, body });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [onSave, title, body]);

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      textareaRef?.(el);
    },
    [textareaRef]
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-900/50">
      <div className="flex flex-1 m-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Left: editing */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setDirty(true);
              }}
              className="flex-1 text-lg font-semibold bg-transparent border-none focus:outline-none"
              placeholder="Title"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          {extraFields && (
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              {extraFields}
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 relative">
            <EditorTextArea
              ref={setRef}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setDirty(true);
              }}
              onSave={handleSave}
            />
            {children}
          </div>
        </div>

        {/* Right: preview + optional sidebar */}
        <div className="flex flex-row w-1/2 border-l border-gray-200">
          <div className="flex-1 overflow-auto p-6">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
          {sidebar && (
            <div className="w-64 border-l border-gray-200 overflow-auto p-4 bg-gray-50">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
