import { lazy, Suspense } from "react";

const EditorToggle = import.meta.env.DEV
  ? lazy(() => import("./EditorToggle"))
  : () => null;

interface Props {
  type: "note" | "post";
  slug: string;
}

export default function DevEditorToggle(props: Props) {
  if (!import.meta.env.DEV) return null;
  return (
    <Suspense fallback={null}>
      <EditorToggle {...props} />
    </Suspense>
  );
}
