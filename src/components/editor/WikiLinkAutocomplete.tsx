import { useState, useEffect, useCallback, useRef } from "react";

interface NoteItem {
  slug: string;
  title: string;
}

interface Props {
  textarea: HTMLTextAreaElement | null;
  notes: NoteItem[];
}

export default function WikiLinkAutocomplete({ textarea, notes }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query
    ? notes.filter((n) =>
        n.title.toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  const visibleItems = filtered.slice(0, 20);

  // Reset focused index when filtered list changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [query]);

  const detectTrigger = useCallback(() => {
    if (!textarea) return;
    const val = textarea.value;
    const cursor = textarea.selectionStart;
    const before = val.slice(0, cursor);

    // Find the last [[ that isn't closed
    const triggerIdx = before.lastIndexOf("[[");
    if (triggerIdx === -1) {
      setOpen(false);
      return;
    }
    const after = before.slice(triggerIdx + 2);
    if (after.includes("]]")) {
      setOpen(false);
      return;
    }

    setQuery(after);
    setOpen(true);

    // Position below the cursor area
    const linesBefore = before.split("\n");
    const lineHeight = 20;
    const charWidth = 8;
    const top = linesBefore.length * lineHeight + 4;
    const left = (linesBefore[linesBefore.length - 1]?.length ?? 0) * charWidth;
    setPosition({
      top: Math.min(top, textarea.clientHeight - 200),
      left: Math.min(left, textarea.clientWidth - 280),
    });
  }, [textarea]);

  useEffect(() => {
    if (!textarea) return;
    const handler = () => detectTrigger();
    textarea.addEventListener("input", handler);
    textarea.addEventListener("keyup", handler);
    textarea.addEventListener("click", handler);
    return () => {
      textarea.removeEventListener("input", handler);
      textarea.removeEventListener("keyup", handler);
      textarea.removeEventListener("click", handler);
    };
  }, [textarea, detectTrigger]);

  const insertLink = useCallback(
    (note: NoteItem) => {
      if (!textarea) return;
      const val = textarea.value;
      const cursor = textarea.selectionStart;
      const before = val.slice(0, cursor);
      const triggerIdx = before.lastIndexOf("[[");
      if (triggerIdx === -1) return;

      const replacement = `[[${note.title}]]`;
      const updated =
        val.slice(0, triggerIdx) + replacement + val.slice(cursor);

      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      nativeSetter?.call(textarea, updated);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      const newCursor = triggerIdx + replacement.length;
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = newCursor;
        textarea.focus();
      });
      setOpen(false);
    },
    [textarea]
  );

  // Handle keyboard navigation on the textarea
  useEffect(() => {
    if (!textarea || !open || visibleItems.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        insertLink(visibleItems[focusedIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setFocusedIndex((i) => Math.min(i + 1, visibleItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };

    textarea.addEventListener("keydown", handler, true);
    return () => textarea.removeEventListener("keydown", handler, true);
  }, [textarea, open, visibleItems, focusedIndex, insertLink]);

  // Scroll focused item into view
  useEffect(() => {
    const el = listRef.current?.children[focusedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  if (!open || visibleItems.length === 0) return null;

  return (
    <div
      className="absolute z-10"
      style={{ top: position.top, left: position.left }}
    >
      <ul
        ref={listRef}
        role="listbox"
        className="w-64 max-h-48 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg"
      >
        {visibleItems.map((note, i) => (
          <li
            key={note.slug}
            role="option"
            aria-selected={i === focusedIndex}
            onMouseEnter={() => setFocusedIndex(i)}
            onClick={() => insertLink(note)}
            className={`px-3 py-2 text-sm cursor-pointer ${
              i === focusedIndex
                ? "bg-purple-50 text-purple-700"
                : "text-gray-900"
            }`}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
