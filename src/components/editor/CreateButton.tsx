import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateNoteModal from "./CreateNoteModal";
import CreatePostModal from "./CreatePostModal";

interface Props {
  type: "note" | "post";
}

export default function CreateButton({ type }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title={type === "note" ? "New note" : "New post"}
      >
        <PlusIcon className="w-6 h-6" />
      </button>
      {type === "note" ? (
        <CreateNoteModal open={open} onClose={() => setOpen(false)} />
      ) : (
        <CreatePostModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
