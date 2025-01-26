import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { UploadDropzone } from "@/app/utils/uploadthing";

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
  setNewTodo: (todo: any) => void; // Sesuaikan tipe `todo` sesuai dengan kebutuhan
}

const WisataForm: React.FC<WisataFormProps> = ({ newTodo, setNewTodo }) => {
  const [isManual, setIsManual] = useState(false); // State untuk switch manual input
  const [costInputType, setCostInputType] = useState<"slider" | "manual">(
    "slider"
  ); // State untuk menentukan jenis input biaya
  const [imageUrlCover, setImageUrlCover] = useState("");

  // Fungsi untuk menghitung nilai step berdasarkan cost
  const getStepValue = (cost: number) => {
    if (cost <= 100000) return 5000;
    if (cost <= 200000) return 10000;
    if (cost <= 500000) return 25000;
    if (cost <= 1500000) return 50000;
    if (cost <= 5000000) return 250000;
    return 1000000;
  };

  const handleCostChange = (value: number | string) => {
    setNewTodo({
      ...newTodo,
      cost: typeof value === "string" ? parseFloat(value) : value,
    });
  };

  return (
    <div className="w-full">
      <DrawerHeader>
        <DrawerTitle>Tempat Wisata</DrawerTitle>
        <DrawerDescription>
          Masukan tempat wisata secara manual
        </DrawerDescription>
      </DrawerHeader>

      <ScrollArea className="h-[300px]  rounded-md border p-4">
        <div className="flex flex-col items-center w-full gap-4">
          {/* Baris untuk input nama tempat wisata dan tombol switch */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Nama Tempat Wisata
              </label>
              {isManual ? (
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
              ) : (
                <GooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                  selectProps={{
                    value: newTodo.name
                      ? { label: newTodo.name, value: newTodo.name }
                      : null,
                    onChange: (location: any) =>
                      setNewTodo({ ...newTodo, name: location.label }),
                    placeholder: "Pilih tempat wisata...",
                    noOptionsMessage: () =>
                      "Ketik sesuatu untuk mencari lokasi...",
                    styles: {
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        padding: "0.175rem",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0 0.5rem",
                      }),
                    },
                  }}
                  autocompletionRequest={{
                    componentRestrictions: { country: ["ID"] },
                    types: ["establishment"],
                  }}
                />
              )}
            </div>

            {/* Tombol Switch Manual */}
            <button
              type="button"
              onClick={() => setIsManual((prev) => !prev)}
              className="p-2 bg-black text-xs md:text-base text-white rounded-md w-32 md:w-40 h-7 md:h-10 flex items-center justify-center"
            >
              {isManual ? "Bantuan Google" : "Input Manual"}
            </button>
          </div>

          {/* Biaya */}
          <div className="w-full">
            <label htmlFor="cost" className="block mb-1 text-sm font-medium">
              Biaya
            </label>

            {/* Input manual atau slider */}

            {costInputType === "manual" ? (
              <div>
                <input
                  id="cost"
                  type="number"
                  placeholder="Biaya"
                  value={newTodo.cost}
                  onChange={(e) => handleCostChange(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                />

                <div className="flex justify-between text-sm mt-1">
                  {newTodo.cost.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <input
                  type="range"
                  min={0}
                  max={3000000}
                  value={newTodo.cost}
                  step={getStepValue(newTodo.cost)} // Set step berdasarkan nilai
                  onChange={(e) => handleCostChange(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  {newTodo.cost.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </div>
              </div>
            )}
            {/* Tombol untuk switch antara slider dan input manual */}
            <div className="mt-2 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setCostInputType("slider")}
                className={`p-2 border rounded-md text-xs md:text-base ${
                  costInputType === "slider"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                Slider
              </button>
              <button
                type="button"
                onClick={() => setCostInputType("manual")}
                className={`p-2 border rounded-md text-xs md:text-base ${
                  costInputType === "manual"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                Input Manual
              </button>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium"
            >
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              placeholder="Deskripsi (Opsional)"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Waktu Mulai */}
          <div className="w-full">
            <label
              htmlFor="timeStart"
              className="block mb-1 text-sm font-medium"
            >
              Waktu Mulai
            </label>
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

          {/* Waktu Selesai */}
          <div className="w-full">
            <label htmlFor="timeEnd" className="block mb-1 text-sm font-medium">
              Waktu Selesai
            </label>
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

          {/* Upload Gambar */}
          <div className="flex flex-start">
            <label  className="block mb-1 text-sm text-start font-medium">
                Upload Gambar Tempat Wisata
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
                // setImageKeyCover(res[0].key);
                // if (res && res.length > 0) {
                //     handleImageChange({ url: res[0].url, key: res[0].key });
                //   }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error.message);
              }}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WisataForm;
