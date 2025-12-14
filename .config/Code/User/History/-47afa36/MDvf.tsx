import NoteClient from "./NoteClient";

export default function NotePage({ params }: any) {
  return <NoteClient id={params.id} />;
}
