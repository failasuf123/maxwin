import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MdPlace } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";

interface TransportasiFormProps {
  newTodo: {
    name: string;
    cost: number;
    description?: string;
    timeStart?: string;
    timeEnd?: string;
  };
  setNewTodo: (todo: any) => void; // Sesuaikan tipe `todo` sesuai dengan kebutuhan
}

const transportOptions = [
  "Angkot",
  "Bus",
  "Ferry",
  "Jalan Kaki",
  "Kapal Laut",
  "Kereta",
  "Mobil",
  "Motor",
  "Nebeng",
  "Ojek motor",
  "Ojek motor Online",
  "Pesawat",
  "Sepeda",
  "Shuttle/Trevel"
];


const TransportasiForm: React.FC<TransportasiFormProps> = ({
  newTodo,
  setNewTodo,
}) => {
  const [isManual, setIsManual] = useState(false); // State untuk switch manual input
  const [costInputType, setCostInputType] = useState<"slider" | "manual">(
    "slider"
  ); // State untuk menentukan jenis input biaya

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
        <DrawerTitle className="text-center">Transportasi</DrawerTitle>
        <DrawerDescription className="text-center">
          Masukan Transportasi secara manual
        </DrawerDescription>
      </DrawerHeader>

      <ScrollArea className="h-[calc(100vh-200px)] px-3 md:px-28 lg:px-32 xl:px-64 py-1">
        <div className="flex flex-col items-center w-full gap-4">
          {/* Input Nama Transportasi */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Nama Transportasi
              </label>

              <select
                id="name"
                value={newTodo.name || ""}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, name: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Pilih transportasi...</option>
                {transportOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Biaya */}
          <div className="w-full">
            <label
              htmlFor="cost"
              className="block mb-3 text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
            >
              <GiMoneyStack className="md:text-base" /> Biaya
            </label>
            <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs ">
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

          {/* Waktu */}
          <div className="w-full">
            <label
              htmlFor="timeStart"
              className="block  text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
            >
              <MdAccessTime /> Waktu
            </label>

            <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs ">
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
        </div>
      </ScrollArea>

      {/* <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="flex flex-col items-center w-full gap-4">
          <img width={300} height={200} src="https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&generator=search&gsrsearch=Eiffel+Tower" alt="" />
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Nama Transportasi
              </label>
              {isManual ? (
                <input
                  type="text"
                  id="name"
                  value={newTodo.name}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, name: e.target.value })
                  }
                  placeholder="Masukkan nama transportasi"
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <select
                  id="name"
                  value={newTodo.name || ""}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih transportasi...</option>
                  {transportOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsManual((prev) => !prev)}
              className="p-2 bg-black text-xs md:text-base text-white rounded-md w-32 md:w-40 h-7 md:h-10 flex items-center justify-center"
            >
              {isManual ? "Pilih dari List" : "Input Manual"}
            </button>
          </div>

          <div className="w-full">
            <label htmlFor="cost" className="block mb-1 text-sm font-medium">
              Biaya
            </label>
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
                  step={getStepValue(newTodo.cost)}
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
        </div>
      </ScrollArea> */}
    </div>
  );
};

export default TransportasiForm;
