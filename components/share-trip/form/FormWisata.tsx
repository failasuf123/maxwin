import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { UploadDropzone } from "@/app/utils/uploadthing";
import PriceFilter from "./PriceFilter";
import { MdPlace } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";

interface WisataFormProps {
  newTodo: {
    type: string;
    name: string;
    description?: string;
    cost: number;
    timeStart?: string;
    timeEnd?: string;
    tag?: string[];
    image?: string;
    imageList?: string[];
    date?: string;
  };
  setNewTodo: (todo: any) => void;
}

const WisataForm: React.FC<WisataFormProps> = ({ newTodo, setNewTodo }) => {
  const [imageUrlCover, setImageUrlCover] = useState("");

  if (!newTodo) {
    console.log("!newTodo, new todo saat ini", newTodo);
    return null;
  }

  return (
    <>
      <div className="w-full px-2">
        {/* Judul dan Subjudul */}
        <div className="w-full flex flex-col items-center justify-center gap-1 mt-2 md:mt-5">
          <div className="font-semibold text-lg">Tempat Wisata</div>
          <div className="text-gray-600">
            Masukan tempat wisata secara manual
          </div>
        </div>

        {/* Konten Form */}
        <div className="mt-5 h-[calc(100vh-200px)] overflow-y-auto px-3 ">
          <div className="flex flex-col items-center w-full gap-8 pb-4">
            {/* Input Nama Tempat Wisata */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
                >
                  <MdPlace className="text-base" /> Nama Tempat Wisata
                </label>
                <input
                  type="text"
                  id="name"
                  value={newTodo.name}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, name: e.target.value })
                  }
                  placeholder="Masukkan nama tempat wisata"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Input Biaya */}
            <div className="w-full">
              <label
                htmlFor="cost"
                className="block mb-3 text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
              >
                <GiMoneyStack className="md:text-base" /> Biaya
              </label>
              <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs">
                <p>*lakukan estimasi biaya</p>
              </div>
              <div className="w-full">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <span className="flex items-center rounded-l px-3 font-bold text-gray-600">
                      Rp
                    </span>
                    <input
                      type="text"
                      name="cost"
                      value={new Intl.NumberFormat("id-ID").format(
                        newTodo.cost || 0
                      )}
                      onChange={(e) => {
                        let rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
                        let numericValue = Math.min(
                          Math.abs(parseInt(rawValue) || 0),
                          100000000
                        ); // Batas 1 miliar
                        setNewTodo({ ...newTodo, cost: numericValue });
                      }}
                      className="p-2 flex-1 bg-gray-100 text-gray-800 py-2 font-normal border border-gray-300 rounded-none font-bold"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // 🔥 Mencegah event bubbling agar drawer tidak tertutup
                        e.stopPropagation(); // 🔥 Mencegah efek bubbling lebih lanjut
                        let newValue = Math.min(newTodo.cost * 1000, 100000000); // Tambah 000 dan batasi 1 miliar
                        setNewTodo({ ...newTodo, cost: newValue });
                      }}
                      disabled={newTodo.cost >= 100000000}
                      className={`px-3 py-2 rounded-r font-bold ${
                        newTodo.cost >= 100000000
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      +000
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full text-gray-400 text-[9.5px] md:text-xs mt-1">
                min Rp 0 maks Rp 100 juta
              </div>
            </div>

            {/* Input Waktu */}
            <div className="w-full">
              <label
                htmlFor="timeStart"
                className="block text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
              >
                <MdAccessTime /> Waktu
              </label>
              <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs">
                <p>*waktu mulai s.d. waktu berakhir</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="timeStart"
                  type="time"
                  value={newTodo.timeStart || ""}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, timeStart: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
                <span className="font-medium">s.d.</span>
                <input
                  id="timeEnd"
                  type="time"
                  value={newTodo.timeEnd || ""}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, timeEnd: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Peringatan */}
              {newTodo.timeStart && newTodo.timeEnd && (
                <div className="flex justify-end w-full text-red-600 text-[9.5px] md:text-xs mt-1">
                  {newTodo.timeStart === newTodo.timeEnd ? (
                    <>Waktu mulai dan berakhir tidak boleh sama!</>
                  ) : newTodo.timeStart > newTodo.timeEnd ? (
                    <>Waktu mulai harus lebih awal dari waktu berakhir!</>
                  ) : null}
                </div>
              )}
            </div>

            {/* Input Deskripsi */}
            <div className="w-full">
              <label
                htmlFor="description"
                className="block mb-3 text-sm font-medium"
              >
                Deskripsi / Catatan (Opsional)
              </label>
              <textarea
                id="description"
                placeholder="Deskripsi (Opsional)"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                className="w-full h-24 md:h-28 p-2 border rounded-md"
              />
            </div>

            {/* Upload Gambar */}
            <div className="flex flex-start">
              <label className="block text-sm text-start font-medium">
                Upload / Edit Gambar Tempat Wisata (Opsional)
              </label>
            </div>
            {imageUrlCover ? (
              <img
                src={imageUrlCover}
                alt="Trip Image"
                className="h-[340px] w-full object-cover rounded"
              />
            ) : (
              <UploadDropzone
                className="border-4 border-dashed border-blue-400 h-[340px] w-full"
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  setNewTodo({ ...newTodo, image: res[0].url });
                  setImageUrlCover(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error.message);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white py-4 border-t flex justify-center items-center flex-row w-full">
        <button
          type="submit"
          className="w-1/2 px-4 py-2 bg-black hover:bg-cyan-500 text-white rounded-lg"
        >
          Simpan
        </button>
      </div>
    </>
  );
};

export default WisataForm;
