import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteNote } from "./api";
import NoteEditor from "./NoteEditor";
import PostEditor from "./PostEditor";

interface Props {
  type: "note" | "post";
  slug: string;
}

export default function EditorToggle({ type, slug }: Props) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {type === "note" && (
        <button
          onClick={() => setShowConfirm(true)}
          className="fixed bottom-20 right-6 z-40 flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          title="Delete note"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      )}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Edit"
      >
        <PencilSquareIcon className="w-6 h-6" />
      </button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete this note?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteNote(slug);
                  window.location.href = "/notes/";
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {open &&
        (type === "note" ? (
          <NoteEditor slug={slug} onClose={() => setOpen(false)} />
        ) : (
          <PostEditor slug={slug} onClose={() => setOpen(false)} />
        ))}
    </>
  );
}
