import React, { useState, useEffect } from "react";
import { MdPlace, MdAccessTime } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { UploadDropzone } from "@/app/utils/uploadthing";
import PickHotel from "./hotel/PickHotel";

interface HotelFormProps {
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

const HotelForm: React.FC<HotelFormProps> = ({ newTodo, setNewTodo }) => {
  const [imageUrlCover, setImageUrlCover] = useState("");
  const [showPickHotel, setShowPickHotel] = useState(true); // State untuk mengontrol tampilan

  useEffect(() => {
    setNewTodo({ ...newTodo, timeStart: "14:00", timeEnd: "23:59" });
  }, []);

  return (
    <div className="w-full px-2">
      {/* Judul dan Subjudul */}
      <div className="w-full flex flex-col items-center justify-center gap-1 mt-2 ">
        <div className="font-semibold text-lg">Hotel</div>
        {/* <div className="text-gray-600">
          {showPickHotel
            ? "Pilih hotel dari daftar"
            : "Masukan hotel secara manual"}
        </div> */}
        <div className="flex justify-center ">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            {/* Tombol Pilih Hotel */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPickHotel(true);
              }}
              className={`px-3 py-2 text-sm font-medium ${
                showPickHotel
                  ? "bg-cyan-500 text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Pilih Hotel
            </button>

            {/* Tombol Input Manual */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPickHotel(!showPickHotel);
                setShowPickHotel(false);
              }}
              className={`px-3 py-2 text-sm font-medium ${
                !showPickHotel
                  ? "bg-cyan-500 text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Input Manual
            </button>
          </div>
        </div>
      </div>
      <hr className="w-full bg-gray-200 my-2 md:my-4" />

      {/* Konten Form */}
      <div className="mt-1 h-[calc(100vh-200px)] overflow-y-auto no-scrollbar px-3">
        {showPickHotel ? (
          <PickHotel newTodo={newTodo} setNewTodo={setNewTodo} />
        ) : (
          <div className="flex flex-col items-center w-full gap-8 pb-4 md:pb-2">
            {/* Input Nama Hotel */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
                >
                  <MdPlace className="text-base" /> Nama Hotel
                </label>
                <input
                  type="text"
                  id="name"
                  value={newTodo.name}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, name: e.target.value })
                  }
                  placeholder="Masukkan nama hotel"
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
                        let rawValue = e.target.value.replace(/\D/g, "");
                        let numericValue = Math.min(
                          Math.abs(parseInt(rawValue) || 0),
                          100000000
                        );
                        setNewTodo({ ...newTodo, cost: numericValue });
                      }}
                      className="p-2 flex-1 bg-gray-100 text-gray-800 py-2 font-normal border border-gray-300 rounded-none font-bold"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let newValue = Math.min(newTodo.cost * 1000, 100000000);
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

            {/* Input Waktu Check-In */}
            <div className="w-full">
              <label
                htmlFor="timeStart"
                className="block text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
              >
                <MdAccessTime /> Check In
              </label>
              <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs">
                <p>*check in hotel</p>
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
              </div>
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
                Upload Gambar Hotel
              </label>
            </div>
            {imageUrlCover ? (
              <img
                src={imageUrlCover}
                alt="Hotel Image"
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
            <div className="sticky bottom-0 bg-white py-4 border-t flex justify-center items-center flex-row w-full">
              <button
                type="submit"
                className="w-1/2 px-4 py-2 bg-black hover:bg-cyan-500 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelForm;
