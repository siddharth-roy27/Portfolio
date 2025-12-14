interface NoteCardProps {
  note: { id: string; title?: string; content?: string };
  onSelect: () => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onSelect, onDelete }: NoteCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{note.title || "Untitled"}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
        {note.content}
      </p>

      <div className="flex justify-between items-center">
        <button
          className="text-blue-600 font-medium"
          onClick={onSelect}
        >
          View
        </button>
        <button
          className="text-red-500 font-medium"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
