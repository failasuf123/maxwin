import React from "react";
import { Todo } from "@/components/create/utils/utility"; // or wherever it's defined

// interface Todo {
//   name: string;
//   cost: number;
//   description?: string;
//   timeStart?: string;
//   timeEnd?: string;
//   // You can add other fields if needed (e.g. image, tag, etc.)
// }

interface WisataFormProps {
  // ALLOW `null` here:
  newTodo: Todo | null;
  // If you prefer a stricter type, do:
  // setNewTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setNewTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

const WisataForm: React.FC<WisataFormProps> = ({ newTodo, setNewTodo }) => {
  // 1) Handle the `null` case. If newTodo is null, show a placeholder or return null.
  if (!newTodo) {
    return (
      <p className="text-red-500">
        Tidak ada data untuk di-edit. (newTodo is null)
      </p>
    );
  }

  // 2) If newTodo is non-null, render the form.
  return (
    <>
      <input
        type="text"
        placeholder="Nama Tempat Wisata"
        value={newTodo.name}
        onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Biaya"
        value={newTodo.cost}
        onChange={(e) =>
          setNewTodo({
            ...newTodo,
            cost: parseFloat(e.target.value) || 0,
          })
        }
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Deskripsi (Opsional)"
        value={newTodo.description}
        onChange={(e) =>
          setNewTodo({ ...newTodo, description: e.target.value })
        }
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        placeholder="Waktu Mulai"
        value={newTodo.timeStart || ""}
        onChange={(e) =>
          setNewTodo({ ...newTodo, timeStart: e.target.value })
        }
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        placeholder="Waktu Selesai"
        value={newTodo.timeEnd || ""}
        onChange={(e) =>
          setNewTodo({ ...newTodo, timeEnd: e.target.value })
        }
        required
        className="w-full p-2 border rounded"
      />
    </>
  );
};

export default WisataForm;
