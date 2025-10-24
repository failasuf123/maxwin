import React, { useEffect, useState } from "react";
import { GripVertical, Clock } from "lucide-react";
import { TbPigMoney } from "react-icons/tb";
import { TiDelete } from "react-icons/ti";
import { FaRegClock } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HotelTodo } from "../_utils/typings";
import { LuCalendarDays } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";

interface HotelTodoItemProps {
  hotelTodo: HotelTodo;
  dayId: number;
  todoId: number;
  todoIndex: number;
  updateActivity: (
    dayId: number,
    todoId: number,
    field: string,
    value: string | boolean | number
  ) => void;
  confirmDelete: (dayId: number, todoId: number) => void;
  providedDraggableTodo: any;
}

const HotelTodoItem: React.FC<HotelTodoItemProps> = ({
  hotelTodo,
  dayId,
  todoId,
  todoIndex,
  updateActivity,
  confirmDelete,
  providedDraggableTodo,
}) => {
  const hasCost = hotelTodo.isPayable && hotelTodo.cost;
  const hasCheckIn = !!hotelTodo.time_start;

  const onClickPesanHotel = (hotelLink: string) => {
    window.open(hotelLink, "_blank", "noopener,noreferrer");
  };

  const [tempDates, setTempDates] = useState({
    checkinDate: hotelTodo.checkinDate || "",
    checkoutDate: hotelTodo.checkoutDate || "",
    time_start: hotelTodo.time_start || "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Sinkronkan state tempDates ketika hotelTodo berubah
  useEffect(() => {
    setTempDates({
      checkinDate: hotelTodo.checkinDate || "",
      checkoutDate: hotelTodo.checkoutDate || "",
      time_start: hotelTodo.time_start || "",
    });
  }, [hotelTodo.checkinDate, hotelTodo.checkoutDate, hotelTodo.time_start]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Tanggal tidak valid";

    try {
      // Handle format YYYY-MM-DD
      const dateParts = dateStr.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Bulan dimulai dari 0
        const day = parseInt(dateParts[2]);

        const date = new Date(year, month, day);
        if (isNaN(date.getTime())) {
          return "Tanggal tidak valid";
        }

        const formattedDay = date.getDate().toString().padStart(2, "0");
        const monthName = date.toLocaleString("default", { month: "short" });
        return `${formattedDay}/${monthName}/${year}`;
      }

      // Handle format lain jika ada
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }

      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0];
  };

  const getMinCheckoutDate = (checkinDate: string) => {
    if (!checkinDate) return "";

    try {
      const dateParts = checkinDate.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);

        const nextDay = new Date(year, month, day + 1);
        return nextDay.toISOString().split("T")[0];
      }

      // Fallback untuk format lain
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error calculating min checkout date:", error);
      return "";
    }
  };

  const formatDateForInput = (dateStr: string) => {
    return dateStr ? dateStr.split("T")[0] : "";
  };

  // Fungsi validasi tanggal
  const validateDates = () => {
    const newErrors: string[] = [];
    const today = new Date();
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 1);

    today.setHours(0, 0, 0, 0);

    // Validasi checkin date
    if (!tempDates.checkinDate) {
      newErrors.push("Tanggal check-in harus diisi");
    } else {
      try {
        // Parse tanggal dalam format YYYY-MM-DD
        const [year, month, day] = tempDates.checkinDate.split("-").map(Number);
        const checkinDate = new Date(year, month - 1, day);
        checkinDate.setHours(0, 0, 0, 0);

        if (checkinDate < today) {
          newErrors.push("Tanggal check-in tidak boleh sebelum hari ini");
        }

        if (checkinDate > maxAdvanceDate) {
          newErrors.push(
            "Tanggal check-in tidak boleh lebih dari 1 tahun dari hari ini"
          );
        }
      } catch (error) {
        newErrors.push("Format tanggal check-in tidak valid");
      }
    }

    // Validasi checkout date
    if (!tempDates.checkoutDate) {
      newErrors.push("Tanggal checkout harus diisi");
    } else if (tempDates.checkinDate) {
      try {
        // Parse tanggal dalam format YYYY-MM-DD
        const [checkinYear, checkinMonth, checkinDay] = tempDates.checkinDate
          .split("-")
          .map(Number);
        const [checkoutYear, checkoutMonth, checkoutDay] =
          tempDates.checkoutDate.split("-").map(Number);

        const checkinDate = new Date(checkinYear, checkinMonth - 1, checkinDay);
        const checkoutDate = new Date(
          checkoutYear,
          checkoutMonth - 1,
          checkoutDay
        );

        checkinDate.setHours(0, 0, 0, 0);
        checkoutDate.setHours(0, 0, 0, 0);

        if (checkoutDate <= checkinDate) {
          newErrors.push("Tanggal checkout harus setelah tanggal check-in");
        }
        if (checkoutDate > maxAdvanceDate) {
          newErrors.push(
            "Tanggal check-out tidak boleh lebih dari 1 tahun dari hari ini"
          );
        }
      } catch (error) {
        newErrors.push("Format tanggal checkout tidak valid");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Di HotelTodoItem
  const handleSave = () => {
    if (validateDates()) {
      updateActivity(dayId, todoId, "checkinDate", tempDates.checkinDate);
      updateActivity(dayId, todoId, "checkoutDate", tempDates.checkoutDate);
      updateActivity(dayId, todoId, "time_start", tempDates.time_start);
      setIsPopoverOpen(false);
    }
  };

  // Fungsi untuk menutup popover tanpa menyimpan
  const handleCancel = () => {
    setTempDates({
      checkinDate: hotelTodo.checkinDate || "",
      checkoutDate: hotelTodo.checkoutDate || "",
      time_start: hotelTodo.time_start || "",
    });
    setErrors([]);
    setIsPopoverOpen(false);
  };

  // Validasi utama untuk menampilkan error di luar popover
  const mainErrors: string[] = [];
  if (hotelTodo.checkinDate) {
    try {
      const [year, month, day] = hotelTodo.checkinDate.split("-").map(Number);
      const checkinDate = new Date(year, month - 1, day);
      checkinDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkinDate < today) {
        mainErrors.push("Tanggal check-in tidak boleh sebelum hari ini");
      }
    } catch (error) {
      mainErrors.push("Format tanggal check-in tidak valid");
    }
  }

  if (hotelTodo.checkinDate && hotelTodo.checkoutDate) {
    try {
      const [checkinYear, checkinMonth, checkinDay] = hotelTodo.checkinDate
        .split("-")
        .map(Number);
      const [checkoutYear, checkoutMonth, checkoutDay] = hotelTodo.checkoutDate
        .split("-")
        .map(Number);

      const checkinDate = new Date(checkinYear, checkinMonth - 1, checkinDay);
      const checkoutDate = new Date(
        checkoutYear,
        checkoutMonth - 1,
        checkoutDay
      );

      checkinDate.setHours(0, 0, 0, 0);
      checkoutDate.setHours(0, 0, 0, 0);

      if (checkoutDate <= checkinDate) {
        mainErrors.push("Tanggal checkout harus setelah tanggal check-in");
      }
    } catch (error) {
      mainErrors.push("Format tanggal tidak valid");
    }
  }

  return (
    <div
      ref={providedDraggableTodo.innerRef}
      {...providedDraggableTodo.draggableProps}
      className="bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
    >
      <div className="flex flex-col   border-t border-gray-200">
        {/* Tombol popover untuk waktu dan biaya */}
        <div className="flex flex-row  justify-between pr-3 pl-8 md:pl-10 pt-2">
          {hasCheckIn && (
            <div className="px-2 scale-90 py-0  text-[8px] md:text-[10px] rounded-full bg-gray-800 text-white flex flex-row gap-1 items-center justify-center">
              <FaRegClock className="text-xs" />
              <span>checkin: {hotelTodo.time_start}</span>
            </div>
          )}

          <div className="flex flex-wrap  gap-3 justify-end">
            {/* Popover waktu check-in */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <Clock className="w-3 h-3 text-gray-800 items-center" />
                  <p className="hidden lg:block">Waktu Menginap</p>
                  <p className="hidden md:block lg:hidden">Waktu </p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-3 p-2">
                  {/* Input Tanggal Check-in */}
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">
                      Tanggal Check-in:
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(tempDates.checkinDate)}
                      min={getMinDate()}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setTempDates((prev) => ({
                          ...prev,
                          checkinDate: newDate,
                        }));

                        // Reset checkout jika tidak valid
                        if (
                          tempDates.checkoutDate &&
                          newDate &&
                          tempDates.checkoutDate <= newDate
                        ) {
                          setTempDates((prev) => ({
                            ...prev,
                            checkoutDate: "",
                          }));
                        }
                      }}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimal hari ini
                    </p>
                  </div>

                  {/* Input Tanggal Checkout */}
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">
                      Tanggal Checkout:
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(tempDates.checkoutDate)}
                      min={getMinCheckoutDate(tempDates.checkinDate)}
                      disabled={!tempDates.checkinDate}
                      onChange={(e) =>
                        setTempDates((prev) => ({
                          ...prev,
                          checkoutDate: e.target.value,
                        }))
                      }
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                        !tempDates.checkinDate
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Harus setelah tanggal check-in
                    </p>
                  </div>

                  {/* Input Waktu Check-in */}
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">
                      Waktu Check-in:
                    </label>
                    <input
                      type="time"
                      value={tempDates.time_start || ""}
                      onChange={(e) =>
                        setTempDates((prev) => ({
                          ...prev,
                          time_start: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Area Peringatan */}
                  <div className="w-full">
                    <div>
                      {errors.length > 0 && (
                        <div className="text-red-500 text-xs p-2 bg-red-50 rounded-md">
                          {errors.map((error, index) => (
                            <div key={index} className="flex items-start mb-1">
                              <CgDanger className="mt-0.5 mr-1 flex-shrink-0" />
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Popover biaya */}
            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <TbPigMoney className="text-sm text-gray-800" />
                  <p className="hidden lg:block">Biaya Per Malam</p>
                  <p className="hidden md:block lg:hidden">Biaya</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-3 p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hotelTodo.isPayable}
                      onChange={(e: any) =>
                        updateActivity(
                          dayId,
                          todoId,
                          "isPayable",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                    <label className="text-sm">Tampilkan biaya?</label>
                  </div>

                  {hotelTodo.isPayable && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Rp</span>
                        <input
                          type="number"
                          value={hotelTodo.cost || 0}
                          onChange={(e) =>
                            updateActivity(
                              dayId,
                              todoId,
                              "cost",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Biaya per malam"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Biaya ini akan ditampilkan sebagai biaya per malam
                      </p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex ">
          <div className="flex flex-col justify-evenly items-center justify-center pr-3 md:px-3 bg-white">
            <div className="flex items-center justify-center ml-1">
              <div
                onClick={() => confirmDelete(dayId, todoId)}
                className="text-xl px-0 py-0 bg-red-200 text-red-700 rounded-full hover:cursor-pointer hover:bg-red-300 hover:text-white"
              >
                <TiDelete />
              </div>
            </div>
            <div
              {...providedDraggableTodo.dragHandleProps}
              className="text-gray-400 hover:text-gray-600 cursor-grab"
            >
              <GripVertical />
            </div>
          </div>

          {/* Gambar hotel */}
          <div className="flex flex-col justify-evenly items-center justify-center  bg-white">
            {hotelTodo.imgTodoUrl ? (
              <img
                src={hotelTodo.imgTodoUrl}
                alt={hotelTodo.nameTodo}
                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl"
              />
            ) : (
              <div className="text-gray-400 text-2xl">🏨</div>
            )}
          </div>

          <div className="flex-1 p-1 md:p-4">
            {/* Input nama hotel */}
            <div className="mb-1 flex flex-row gap-2 items-center">
              <div className="text-[10px] rounded-full bg-gray-300 mb-2 flex w-4 h-4 justify-center items-center text-white">
                {todoIndex + 1}
              </div>

              <input
                value={hotelTodo.nameTodo}
                onChange={(e) =>
                  updateActivity(dayId, todoId, "nameTodo", e.target.value)
                }
                placeholder="Nama hotel"
                className="w-full text-xs md:text-base font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Badge informasi */}
            <div className="w-full flex flex-wrap justify-start gap-3 md:gap-4 my-2">
              {hotelTodo.checkinDate && hotelTodo.checkoutDate && (
                <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-blue-100 text-blue-800 flex flex-row gap-1 items-center justify-center">
                  <LuCalendarDays />
                  {formatDate(hotelTodo.checkinDate)} -{" "}
                  {formatDate(hotelTodo.checkoutDate)}
                </div>
              )}
              {/* Badge biaya */}
              {hasCost && (
                <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-green-100 text-green-800 flex flex-row gap-1 items-center justify-center">
                  <span>Rp</span>
                  <span>
                    {new Intl.NumberFormat("id-ID").format(hotelTodo.cost || 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Textarea deskripsi */}
            <div className="md:mb-2">
              <textarea
                value={hotelTodo.descriptionTodo || ""}
                onChange={(e) =>
                  updateActivity(
                    dayId,
                    todoId,
                    "descriptionTodo",
                    e.target.value
                  )
                }
                placeholder="Tambahkan catatan..."
                className="w-full p-1 md:p-2 text-[10px] md:text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                rows={2}
              />
            </div>

            {/* Tombol pesan hotel */}
            <div className="w-full flex flex-col  md:gap-2   items-end justify-center">
              {mainErrors.length > 0 && (
                <div className="text-[8px] md:text-xs text-red-600 flex flex-row gap-1 md:gap-2 items-center">
                  <CgDanger />
                  {mainErrors.join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelTodoItem;
