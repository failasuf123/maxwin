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
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100000);
  const MAX_LIMIT = 20000000; // Batas maksimum
  const MIN_LIMIT = 0; // Batas minimum
  const MIN_DIFFERENCE = 20000; // Selisih minimal antara min dan max
  const maxValueRef = useRef(100000); // Ref untuk menyimpan nilai max yang stabil


  useEffect(() => {
    if (newTodo.cost > 100000) {
      const newMax = Math.min(newTodo.cost * 2, MAX_LIMIT); // Pastikan tidak melebihi MAX_LIMIT
      setMaxValue(newMax);
      maxValueRef.current = newMax; // Simpan di ref agar tidak berubah
    }
  }, [newTodo.cost]);
  

  // Fungsi untuk membulatkan ke ribuan terdekat ke atas
  const roundUpToNearestThousand = (value: any) =>
    Math.ceil(value / 1000) * 1000;

  // Fungsi untuk menghitung nilai tengah yang sudah dibulatkan
  const calculateMidValue = (min: any, max: any) =>
    roundUpToNearestThousand((min + max) / 2);

  // Fungsi untuk mengupdate nilai tengah setiap kali min/max berubah
  const updateMidValue = (newMin: any, newMax: any) => {
    const midValue = calculateMidValue(newMin, newMax);
    setNewTodo((prev: any) => ({ ...prev, cost: midValue }));
  };

  const handleMinChange = (e:any) => {
    let newMin = Number(e.target.value);
    if (newMin < MIN_LIMIT) newMin = MIN_LIMIT; // Cegah negatif
    if (newMin >= maxValue - MIN_DIFFERENCE) return; // Pastikan ada jarak minimal
    setMinValue(newMin);
    updateMidValue(newMin, maxValue);
  };
  

  const handleMaxChange = (e:any) => {
    let newMax = Number(e.target.value);
    if (newMax > MAX_LIMIT) newMax = MAX_LIMIT; // Batasi ke 20 juta
    if (newMax <= minValue + MIN_DIFFERENCE) return; // Pastikan selisih minimal
    setMaxValue(newMax);
    maxValueRef.current = newMax; // Update ref agar tidak berubah oleh slider
    updateMidValue(minValue, newMax);
  };
  
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

  const handleCostChanges = (value: number) => {
    setNewTodo({
      ...newTodo,
      cost: value,
    });
  };

  return (
    <div className="w-full ">
      <DrawerHeader>
        <DrawerTitle className="text-center">Tempat Wisata</DrawerTitle>
        <DrawerDescription className="text-center">
          Masukan tempat wisata secara manual
        </DrawerDescription>
      </DrawerHeader>

      <ScrollArea className="h-[calc(100vh-200px)] px-3 md:px-28 lg:px-32 xl:px-64 py-1">
        <div className="flex flex-col items-center w-full gap-8">
          {/* Baris untuk input nama tempat wisata dan tombol switch */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full">
              <label htmlFor="name" className="block mb-3 text-sm font-medium">
                Nama Tempat Wisata
              </label>
              {/* {isManual ? (
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
              )} */}
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

            {/* Tombol Switch Manual */}
            {/* <button
              type="button"
              onClick={() => setIsManual((prev) => !prev)}
              className="p-2 bg-black text-xs md:text-base text-white rounded-md w-32 md:w-40 h-7 md:h-10 flex items-center justify-center"
            >
              {isManual ? "Bantuan Google" : "Input Manual"}
            </button> */}
          </div>

          {/* Biaya */}
          <div className="w-full">
            <label htmlFor="cost" className="block mb-3 text-sm font-medium">
              Biaya
            </label>

            {/* Slider */}
            <div className="w-full ">
            <input
  type="range"
  min={minValue}
  max={maxValueRef.current} // Gunakan nilai dari ref agar tidak berubah
  value={newTodo.cost}
  step={1000}
  onChange={(e) => setNewTodo((prev:any) => ({ ...prev, cost: Number(e.target.value) }))}
  className="w-full"
/>

              <div className="flex justify-between text-sm mt-1">
                {newTodo.cost.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>

              <div className="flex flex-row items-center md:justify-end gap-2 mt-3">
                {/* Input manual atau slider */}
                <div className="flex flex-col items-center space-x-2 text-xs">
                  <input
                    type="number"
                    value={minValue}
                    min={0}
                    max={maxValue - 20000}
                    onChange={handleMinChange}
                    className="border p-2 w-full"
                  />
                  <label className="w-40 text-gray-500">Min Range Harga</label>
                </div>

                <div className="flex flex-col items-center space-x-2 text-xs"><div>-</div><div>.</div></div>

                {/* Form Max */}
                <div className="flex flex-col items-center space-x-2 text-xs">
                  <input
                    type="number"
                    value={maxValue}
                    min={minValue + 20000}
                    max={3000000}
                    onChange={handleMaxChange}
                    className="border p-2 w-full"
                  />
                  <label className="w-40 text-gray-500">Maks Range Harga</label>
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="block mb-3 text-sm font-medium"
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
              className="w-full h-32 p-2 border rounded-md"
            />
          </div>

          {/* Waktu Mulai */}
          <div className="w-full">
            <label
              htmlFor="timeStart"
              className="block mb-3 text-sm font-medium"
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
            <label htmlFor="timeEnd" className="block mb-3 text-sm font-medium">
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
            <label className="block  text-sm text-start font-medium">
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
