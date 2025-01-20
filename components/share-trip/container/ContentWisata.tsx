import React from "react";
import { FaPen, FaTrash } from "react-icons/fa";

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
  onDelete: () => void;
  onEdit: () => void; // New: triggers edit in the parent
};

export default function ContentWisata({
  name,
  description,
  cost,
  timeStart,
  timeEnd,
  image,
  onDelete,
  onEdit,
}: ContentWisataProps) {
  return (
    <div className="flex flex-col">
      <div className="p-3 rounded-lg flex flex-row items-center gap-4 relative bg-white shadow-sm">
        {/* Time + Thumbnail */}
        <div className="flex flex-col items-center justify-start gap-2">
          <div className="inline-flex items-center bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
            🕒 {timeStart} - {timeEnd || "??"}
          </div>
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-sm">
            <img
              src={image || "/placeholder.png"}
              alt={name || "No Title"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h4 className="font-bold text-base md:text-lg text-cyan-700">
            {name || "No Title"}
          </h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Cost */}
            <span className="inline-flex items-center bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
              💰{" "}
              {cost.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-3 hidden md:block">
            {description || "No description available."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {/* Edit */}
          <button
            className="text-white bg-yellow-400 text-sm px-2 py-1 rounded-full hover:bg-yellow-500 flex items-center gap-1"
            onClick={onEdit}
          >
            <FaPen />
          </button>

          {/* Delete */}
          <button
            className="text-white bg-red-500 text-sm px-2 py-1 rounded-full hover:bg-red-600 flex items-center gap-1"
            onClick={onDelete}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Description on small screens */}
      <div className="block md:hidden ml-8 mt-1">
        <p className="text-xs text-gray-600">
          {description || "No description available."}
        </p>
      </div>
    </div>
  );
}
