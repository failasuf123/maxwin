import React, { useState } from "react";
import { FaMotorcycle, FaCarSide, FaTrain, FaBusAlt, FaShuttleVan, FaPlaneDeparture } from "react-icons/fa";
import { BsFillTaxiFrontFill, BsPersonWalking } from "react-icons/bs";
import { RiTaxiWifiFill } from "react-icons/ri";
import { MdPlace } from "react-icons/md";
import { IoIosBicycle } from "react-icons/io";
import { FaFerry } from "react-icons/fa6";
import { SiGojek } from "react-icons/si";
import { FaPen, FaTrash } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"




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
  onEdit: () => void;

};

const getIconByName = (name: string) => {
  switch (name.toLowerCase()) {
    case "motor":
    case "motor sewa":
    case "ojek motor":
      return <FaMotorcycle className="text-4xl text-white" />;
    case "ojek motor online":
      return <SiGojek className="text-4xl text-white" />
    case "taksi":
      return <BsFillTaxiFrontFill className="text-4xl text-white" />;
    case "ojek mobil online":
      return <RiTaxiWifiFill className="text-4xl text-white" />;
    case "mobil":
    case "mobil sewa":
      return <FaCarSide className="text-4xl text-white" />;
    case "kereta":
    case "kerta-mrt":
    case "kereta-lrt":
    case "kereta-krl":
      return <FaTrain className="text-4xl text-white" />;
    case "bus":
    case "bus kota":
      return <FaBusAlt className="text-4xl text-white" />;
    case "trevel":
      return <FaShuttleVan className="text-4xl text-white" />;
    case "jalan kaki":
      return <BsPersonWalking className="text-4xl text-white" />;
    case "sepeda":
      return <IoIosBicycle  className="text-4xl text-white" />;
    case "pesawat":
      return <FaPlaneDeparture className="text-4xl text-white" />;
    case "ferry":
      return <FaFerry className="text-4xl text-white" />
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
  onEdit,
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

        {/* <div
          className="absolute top-2 right-2 text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete();
          }}
        >
          x
        </div> */}
                <Popover>
          <PopoverTrigger asChild>
            <div className="absolute top-2 right-2 text-black text-xl bg-gray-100 text-sm px-3 py-3  rounded-full cursor-pointer hover:bg-gray-200">
              <HiDotsVertical />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col ">
              <div onClick={onEdit} className="hover:bg-gray-200 rounded-xl cursor-pointer px-2 py-2 flex flex-row text-gray-700 items-center gap-4 text-lg">
                <FaPen className="text-sm"/> Edit
              </div>

              <hr className="w-full text-gray-300 my-1" />

              {/* <div className="hover:bg-gray-200 rounded-xl cursor-pointer px-2 py-2 flex flex-row text-gray-700 items-center gap-4 text-lg text-red-400">
                <FaTrash className="text-sm "/> Hapus
              </div> */}
              <Dialog>
                <DialogTrigger className="border-none outline-none focus:outline-none">
                <div className="hover:bg-gray-200 rounded-xl cursor-pointer px-2 py-2 flex flex-row text-gray-700 items-center gap-4 text-lg text-red-400 border-none">
                <FaTrash className="text-sm "/> Hapus
              </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apakah Anda Yakin Menghapus Aktivitas Ini ?</DialogTitle>
                    <DialogDescription>
                      Perhatian! Anda akan menghapus lokasi "{name}" dari rencana perjalanan anda.
                    </DialogDescription>
                  </DialogHeader>
                <DialogFooter>
                <DialogClose asChild>
                  <button className="bg-red-500 rounded text-white border-none px-2 py-2 cursor-pointer hover:bg-red-600" onClick={onDelete}>Hapus Aktivitas</button>
                </DialogClose>
                </DialogFooter>
                </DialogContent>

              </Dialog>

            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ContentTransportasi;
