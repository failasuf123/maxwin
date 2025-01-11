import React, { useState } from "react";
import { FaMotorcycle, FaCarSide, FaTrain, FaBusAlt, FaShuttleVan } from "react-icons/fa";
import { BsFillTaxiFrontFill, BsPersonWalking } from "react-icons/bs";
import { RiTaxiWifiFill } from "react-icons/ri";
import { MdPlace } from "react-icons/md";

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

type ContentTransportasiProps = Todo & {
  onDelete: () => void;
};

const getIconByName = (name: string) => {
  switch (name.toLowerCase()) {
    case "ojek motor online":
      return <FaMotorcycle className="text-4xl text-white" />;
    case "ojek mobile online":
      return <BsFillTaxiFrontFill className="text-4xl text-white" />;
    case "ojek wifi online":
      return <RiTaxiWifiFill className="text-4xl text-white" />;
    case "mobil":
    case "mobil sewa":
      return <FaCarSide className="text-4xl text-white" />;
    case "kereta":
    case "krl":
      return <FaTrain className="text-4xl text-white" />;
    case "bus":
      return <FaBusAlt className="text-4xl text-white" />;
    case "trevel":
      return <FaShuttleVan className="text-4xl text-white" />;
    case "jalan kaki":
      return <BsPersonWalking className="text-4xl text-white" />;
    default:
      return <MdPlace className="text-4xl text-white" />;
  }
};

const calculateDuration = (timeStart: string, timeEnd: string): string => {
  const [startHour, startMinute] = timeStart.split(":").map(Number);
  const [endHour, endMinute] = timeEnd.split(":").map(Number);

  let totalStartMinutes = startHour * 60 + startMinute;
  let totalEndMinutes = endHour * 60 + endMinute;

  if (totalEndMinutes < totalStartMinutes) {
    totalEndMinutes += 24 * 60;
  }

  const diffMinutes = totalEndMinutes - totalStartMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours} jam ${minutes} menit`;
};

const ContentTransportasi = ({
  name,
  description,
  cost,
  timeStart,
  timeEnd,
  onDelete,
}: ContentTransportasiProps) => {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const duration = calculateDuration(timeStart, timeEnd);

  return (
    <div
      className="flex flex-col bg-yellow-50 rounded-3xl  cursor-pointer"
      onClick={() => setDescriptionVisible(!isDescriptionVisible)} // Toggle description visibility
    >
      <div className="p-3 rounded-lg flex flex-row items-start gap-4 relative">
        {/* Thumbnail */}
        <div className="flex flex-col items-center justify-start gap-2 relative">
          <div className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-yellow-300">
            {getIconByName(name)}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h4 className="font-bold text:base md:text-lg text-yellow-400">
            {name || "No Title"}
            <div className="inline-flex items-center ml-1 text-gray-400 text-xs font-medium rounded-full scale-90">
              | 🕒 {timeStart} - {timeEnd} | {duration}
            </div>
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

          {/* Description */}
          {isDescriptionVisible && (
            <p className="text-gray-600 mt-3 text-xs md:text-sm">
              {description || "No description available."}
            </p>
          )}
        </div>

        {/* Delete Button */}
        <div
          className="absolute top-2 right-2 text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from toggling the accordion
            onDelete();
          }}
        >
          x
        </div>
      </div>
    </div>
  );
};

export default ContentTransportasi;
