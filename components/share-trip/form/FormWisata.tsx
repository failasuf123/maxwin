import React from "react";

interface WisataFormProps {
  newTodo: {
    name: string;
    cost: number;
    description?: string;
    timeStart?: string;
    timeEnd?: string;
  };
  setNewTodo: (todo: any) => void; // Sesuaikan tipe `todo` sesuai dengan kebutuhan
}

const WisataForm: React.FC<WisataFormProps> = ({ newTodo, setNewTodo }) => {
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
