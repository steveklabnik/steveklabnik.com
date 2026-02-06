import { lazy, Suspense } from "react";

const CreateButton = import.meta.env.DEV
  ? lazy(() => import("./CreateButton"))
  : () => null;

interface Props {
  type: "note" | "post";
}

export default function DevCreateButton(props: Props) {
  if (!import.meta.env.DEV) return null;
  return (
    <Suspense fallback={null}>
      <CreateButton {...props} />
    </Suspense>
  );
}
