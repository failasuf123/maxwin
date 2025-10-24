/* components/PayableList.tsx */
"use client";
import React, { useState, useEffect } from "react";
import type {
  PayableItem,
  BaseTodo,
  HotelTodo,
  ActivityTodo,
} from "../_service/typings";
import {
  FaChevronDown,
  FaHotel,
  FaTicketAlt,
  FaUtensils,
  FaShoppingBag,
  FaQuestionCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdOutlineCalendarMonth } from "react-icons/md";

// Helpers
const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number") return "N/A";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "no date";
  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateCard = (dateStr: string) => {
  if (!dateStr) return "No Date";
  
  try {
    // Handle format YYYY-MM-DD
    const dateParts = dateStr.split("-");
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Bulan dimulai dari 0
      const day = parseInt(dateParts[2]);
      
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) {
        return "No Date";
      }
      
      const formattedDay = date.getDate().toString().padStart(2, "0");
      const monthName = date.toLocaleString("default", { month: "short" });
      return `${formattedDay}/${monthName}/${year}`;
    }
    
    // Handle format lain jika ada
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "No Date";
    }
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "No Date";
  }
};


// Icon based on todo type
const getTodoIcon = (type?: string) => {
  switch (type) {
    case "hotel":
      return <FaHotel className="text-blue-500" />;
    case "activity":
      return <FaTicketAlt className="text-green-500" />;
    case "restaurant":
      return <FaUtensils className="text-red-500" />;
    case "shopping":
      return <FaShoppingBag className="text-purple-500" />;
    default:
      return <FaQuestionCircle className="text-gray-500" />;
  }
};

function PayableDetailRow({
  todo,
}: {
  todo: BaseTodo | HotelTodo | ActivityTodo;
}) {
  const isHotel = (todo as HotelTodo).typeTodo === "hotel";
  const isActivity = (todo as ActivityTodo).typeTodo === "activity";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 py-3 border-t border-gray-100"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
        {/* {getTodoIcon(todo.typeTodo)} */}
        <img
          className="w-full h-full rounded-lg"
          src={todo.imgTodoUrl}
          alt=""
        />
      </div>

      <div className="flex-grow">
        <div className="flex flex-row items-center gap-2 justify-start text-[10px] md:text-xs lg:text-sm font-semibold text-gray-800 ">
          <div className="flex-shrink-0">{getTodoIcon(todo.typeTodo)}</div>
          <span className="line-clamp-1">{todo.nameTodo}</span>
        </div>
        <div className="flex items-center gap-2 md:mt-1  text-[8px] md:text-[10px] lg:text-sm text-gray-500">
          {isHotel ? (
            <div className="flex flex-row justify-center items-center gap-1 md:gap-2">
              {/* <span className="text-amber-500 mr-1">★</span> */}
              <MdOutlineCalendarMonth />

              {/* {(todo as HotelTodo).checkinDate} */}
              {formatDateCard((todo as HotelTodo).checkinDate)} - {formatDateCard((todo as HotelTodo).checkoutDate)}
            </div>
          ) : (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
              {isActivity
                ? (todo as ActivityTodo).location || "Lokasi tidak tersedia"
                : ""}
            </div>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0 min-w-[120px]">
        <p className="font-bold text-xs md:text-base  text-gray-900">
          {formatCurrency(todo.cost)}
        </p>
        {isHotel && (todo as HotelTodo).landingURL && (
          <a
            href={(todo as HotelTodo).landingURL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-medium py-0.5 md:py-1.5  px-2 md:px-3 rounded-md transition-colors shadow-sm"
          >
            Pesan Sekarang
          </a>
        )}
      </div>
    </motion.div>
  );
}

// Main component
export default function PayableList({ data }: { data: PayableItem[] }) {
  const [selectedId, setSelectedId] = useState<string>(
    data.length > 0 ? data[0].id : ""
  );
  const [openId, setOpenId] = useState<string | null>(
    data.length > 0 ? data[0].id : null
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const directItineraryEdit = (id: string) => {
    window.open(`/itinerary/${id}?type=edit`, "_blank");
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FaMoneyBillWave className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Tidak ada Biaya
        </h3>
        <p className="text-gray-500">
          Belum ada biaya untuk perjalanan Anda saat ini.
        </p>
      </div>
    );
  }

  // Calculate total per itinerary
  const calculateTotal = (item: PayableItem) => {
    return item.data.reduce((total, todo) => total + (todo.cost || 0), 0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar for lg+ */}
      <div className="hidden lg:block w-1/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-y-auto max-h-[80vh] sticky top-4">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Daftar Perjalanan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pilih perjalanan untuk melihat detail tagihan
          </p>
        </div>

        {data.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`w-full text-left p-4 hover:bg-blue-50 focus:outline-none transition-colors ${
              selectedId === item.id
                ? "bg-blue-50 border-l-4 border-blue-500"
                : ""
            }`}
          >
            <div className="font-semibold text-gray-900 line-clamp-1">
              {item.title}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2" size={12} />
                <span>{formatDate(item.lastUpdate)}</span>
              </div>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {item.data.length} item
              </div>
            </div>
            <div className="mt-2 text-right font-medium text-blue-600">
              {formatCurrency(calculateTotal(item))}
            </div>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1">
        {/* lg+ Mode: show details of selectedId */}
        <div className="hidden lg:block">
          {data
            .filter((item) => item.id === selectedId)
            .map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {item.title ?? "Itinerary Tanpa Judul"}
                    </h2>
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.data.length} item
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2" size={12} />
                      <span>Update: {formatDate(item.lastUpdate)}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(calculateTotal(item))}
                  </div>
                </div>

                <div className="px-4 pb-2">
                  {item.data.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {item.data.map((todo) => (
                        <PayableDetailRow
                          key={(todo as any).uniqueId || todo.id_order_todo}
                          todo={todo}
                        />
                      ))}

                      <div className="py-4 flex justify-between items-center">
                        <div className="flex flex-col items-start justify-start gap-1">
                          <p className="font-medium text-gray-700">Total</p>
                          <p className="text-[10px] text-xs text-gray-500">
                            *harga bisa jadi berbeda mohon verifikasi dan
                            perbaharui harga
                          </p>
                        </div>
                        <p className="font-bold text-xl text-blue-600">
                          {formatCurrency(calculateTotal(item))}
                        </p>
                      </div>

                      <div className="pb-4 flex flex-col justify-end gap-3 px-5 ">
                        <button
                          onClick={() => directItineraryEdit(item.id)}
                          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 text-base md:text-lg rounded-md transition-colors shadow-sm"
                        >
                          Edit Itinerary
                        </button>
                        <p className="text-[10px] text-xs text-gray-500">
                          *edit harga, waktu checkin, hapus dan tambah hotel
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FaMoneyBillWave className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-500">
                        Tidak ada tagihan untuk perjalanan ini.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        {/* sm/md Mode: accordion list */}
        <div className="lg:hidden space-y-4">
          {data.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-start justify-start">
                    <h2 className="font-semibold text-gray-900 line-clamp-1 overflow-hidden text-ellipsis break-words max-w-[90%]">
                      {item.title ?? "Itinerary Tanpa Judul"}
                    </h2>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2" size={12} />
                      <span>{formatDate(item.lastUpdate)}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 w-16 rounded-full text-xs font-medium ml-2">
                        {item.data.length} item
                      </span>
                    </div>
                    <div className="mt-2 font-medium text-blue-600">
                      {formatCurrency(calculateTotal(item))}
                    </div>
                  </div>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-2 border-t border-gray-100">
                        {item.data.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {item.data.map((todo) => (
                              <PayableDetailRow
                                key={
                                  (todo as any).uniqueId || todo.id_order_todo
                                }
                                todo={todo}
                              />
                            ))}

                            <div className="py-1 md:py-4 flex flex-col justify-between items-center">
                              <div className="flex flex-row w-full items-center justify-between">
                                <div className="flex flex-col items-start justify-start gap-1">
                                  <p className="font-medium text-gray-700">
                                    Total
                                  </p>
                                </div>
                                <p className="font-bold text-lg text-blue-600">
                                  {formatCurrency(calculateTotal(item))}
                                </p>
                              </div>
                              <p className="text-[9px] md:text-xs text-gray-500">
                                *harga bisa jadi berbeda mohon verifikasi dan
                                perbaharui harga
                              </p>
                            </div>

                            <div className="pb-4 flex flex-col items-center justify-end w-full gap-3">
                              <div className="pb-4 flex flex-col justify-end gap-3 px-5 ">
                                <button
                                  onClick={() => directItineraryEdit(item.id)}
                                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 text-base md:text-lg rounded-md transition-colors shadow-sm"
                                >
                                  Edit Itinerary
                                </button>
                                <p className="text-[9px] md:text-xs text-gray-500">
                                  *edit harga, waktu checkin, hapus dan tambah
                                  hotel
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-center">
                            <div className="bg-gray-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                              <FaMoneyBillWave className="text-gray-400 text-xl" />
                            </div>
                            <p className="text-gray-500">
                              Tidak ada biaya hotel pada Itinerary ini
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
