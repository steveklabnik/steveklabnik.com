import { forwardRef, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSave?: () => void;
}

const EditorTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ onSave, onKeyDown, ...rest }, ref) => {
    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      // Ctrl/Cmd+S → save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }
      // Tab → insert two spaces
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const updated = val.substring(0, start) + "  " + val.substring(end);

        // Use native setter to trigger React's onChange
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        nativeSetter?.call(ta, updated);
        ta.dispatchEvent(new Event("input", { bubbles: true }));

        // Restore cursor
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
        return;
      }
      onKeyDown?.(e);
    }

    return (
      <textarea
        ref={ref}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none bg-white p-4 font-mono text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        {...rest}
      />
    );
  }
);

EditorTextArea.displayName = "EditorTextArea";
export default EditorTextArea;
