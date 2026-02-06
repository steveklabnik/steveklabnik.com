import { useState, useEffect, useCallback, useMemo } from "react";
import ContentEditor from "./ContentEditor";
import WikiLinkAutocomplete from "./WikiLinkAutocomplete";
import { fetchNote, fetchNoteList, saveNote, type NoteData } from "./api";
import { slugify, wikiLinkRegex } from "../../utils/wikilinks";

interface Props {
  slug: string;
  onClose: () => void;
}

export default function NoteEditor({ slug, onClose }: Props) {
  const [note, setNote] = useState<NoteData | null>(null);
  const [allNotes, setAllNotes] = useState<NoteData[]>([]);
  const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    fetchNote(slug).then(setNote);
    fetchNoteList().then(setAllNotes);
  }, [slug]);

  const handleSave = useCallback(
    async (data: { title: string; body: string }) => {
      await saveNote(slug, data);
    },
    [slug]
  );

  const preprocessMarkdown = useCallback(
    (src: string) => {
      // Replace [[target]] and [[target|display]] with <a> tags
      return src.replace(
        new RegExp(wikiLinkRegex.source, "g"),
        (_match, target, display) => {
          const s = slugify(target);
          const text = display?.trim() || target.trim();
          return `<a href="/notes/${s}">${text}</a>`;
        }
      );
    },
    []
  );

  // Compute backlinks: notes that link to this slug
  const backlinks = useMemo(() => {
    return allNotes.filter((n) => {
      if (n.slug === slug) return false;
      const regex = new RegExp(wikiLinkRegex.source, "g");
      let m;
      while ((m = regex.exec(n.body)) !== null) {
        if (slugify(m[1]) === slug) return true;
      }
      return false;
    });
  }, [allNotes, slug]);

  if (!note) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
        <div className="text-white text-lg">Loading…</div>
      </div>
    );
  }

  const sidebar = (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Backlinks</h3>
      {backlinks.length === 0 ? (
        <p className="text-xs text-gray-500">No backlinks yet</p>
      ) : (
        <ul className="space-y-1">
          {backlinks.map((bl) => (
            <li key={bl.slug}>
              <a
                href={`/notes/${bl.slug}/`}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                {bl.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const noteItems = allNotes.map((n) => ({ slug: n.slug, title: n.title }));

  return (
    <ContentEditor
      title={note.title}
      body={note.body}
      onSave={handleSave}
      onClose={onClose}
      preprocessMarkdown={preprocessMarkdown}
      sidebar={sidebar}
      textareaRef={setTextarea}
    >
      <WikiLinkAutocomplete textarea={textarea} notes={noteItems} />
    </ContentEditor>
  );
}
