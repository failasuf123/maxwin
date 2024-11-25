import React from "react";

interface UlasanFormProps {
  newTodo: {
    name: string;
    cost: number;
    description?: string;
    timeStart?: string;
    timeEnd?: string;
  };
  setNewTodo: (todo: any) => void; // Sesuaikan tipe `todo` sesuai dengan kebutuhan
}

const UlasanForm: React.FC<UlasanFormProps> = ({ newTodo, setNewTodo }) => {
  return (
    <>
    <input
      type="text"
      placeholder="Judul"
      value={newTodo.name}
      onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
      required
      className="w-full p-2 border rounded"
    />
    <textarea
      placeholder="Deskripsi"
      value={newTodo.description}
      onChange={(e) =>
        setNewTodo({ ...newTodo, description: e.target.value })
      }
      required
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
    </>
  );
};

export default UlasanForm;
