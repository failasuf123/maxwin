import React, { useState } from "react";

type Todo = {
  type: string;
  name: string;
  description: string;
  cost: number;
  timeStart: string;
  timeEnd: string;
  image: string;
  imageList: string[];
  date: string;
};

type ContentWisataProps = Todo & {
  onDelete: () => void; // Fungsi untuk handle delete
};

const ContentUlasan = ({ name, description, onDelete }: ContentWisataProps) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionVisible((prev) => !prev);
  };

  return (
    <div
      className="bg-rose-50 px-5 py-5 rounded-3xl  relative cursor-pointer"
      onClick={toggleDescription}
    >
      <div>
        <h4 className="font-bold">📖 {name || "No Title"}</h4>
        {isDescriptionVisible && (
          <p className="text-xs mt-1">{description || "No description"}</p>
        )}
      </div>

      <div
        className="absolute top-2 right-2 text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
        onClick={(e) => {
          e.stopPropagation(); // Agar klik tombol delete tidak memicu toggle accordion
          onDelete();
        }}
      >
        x
      </div>
    </div>
  );
};

export default ContentUlasan;
