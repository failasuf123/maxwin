import React from "react";
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

type ContentWisataProps = Todo & {
  onDelete: () => void; // Fungsi untuk handle delete
  onEdit: () => void;
};

const ContentWisata = ({
  name,
  description,
  cost,
  timeStart,
  timeEnd,
  image,
  onDelete,
  onEdit,
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
              src={image || "/placeholder.webp"}
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
        {/* <div
          className="absolute top-2 right-2 text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
          onClick={onDelete}
        >
          x
        </div> */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="absolute top-2 right-2 text-black text-xl  text-sm px-3 py-3  rounded-full cursor-pointer hover:bg-gray-100">
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

      <div className="block md:hidden ml-8">
        <p className="text-xs text-gray-600 mt-1">
          {description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default ContentWisata;