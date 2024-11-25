import React from "react";

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

type ContentWisataProps = Todo 

const ContentWisata = ({
  name,
  description,
  cost,
  timeStart,
  timeEnd,
  image,
}: ContentWisataProps) => {
  return (
    <div className="flex flex-col ">
      <div className="p-3 rounded-lg flex flex-row items-center gap-4 relative ">
        {/* Thumbnail */}
        <div className="flex flex-col items-center justify-start gap-2 relative">
          <div className="inline-flex items-center bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
            🕒 {timeStart} - {timeEnd}
          </div>

          <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32  rounded-lg overflow-hidden shadow-sm">
            <img
              src={image || "/placeholder.png"}
              alt={name || "No Title"}
              className="w-full h-full object-cover mt-3"
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
            {/* Time */}
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-3 hidden md:block">
            {description || "No description available."}
          </p>
        </div>

        {/* Delete Button */}

      </div>

      <div className="block md:hidden ml-8">
        <p className="text-xs text-gray-600 mt-1">
          {description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default ContentWisata;
