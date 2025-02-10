import React, { useState } from "react";
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

const ContentUlasan = ({ name, description, onDelete ,  onEdit,}: ContentWisataProps) => {
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

      {/* <div
        className="absolute top-2 right-2 text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
        onClick={(e) => {
          e.stopPropagation(); // Agar klik tombol delete tidak memicu toggle accordion
          onDelete();
        }}
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
  );
};

export default ContentUlasan;
