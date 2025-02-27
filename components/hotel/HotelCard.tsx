// components/HotelCard.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { MdLocalHotel } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import HotelModalContent from "./HotelModalContent";

interface HotelCardProps {
  hotel: {
    hotel_id: number;
    hotel_name: string;
    city: string;
    state: string;
    country: string;
    star_rating: number;
    photo1?: string | null;
    photo2?: string | null;
    photo3?: string | null;
    photo4?: string | null;
    photo5?: string | null;
    url: string;
    rating_average: number;
    overview: string;
    accommodation_type: string;
    addressline1: string;
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [showTodoModal, setShowTodoModal] = useState(false);

  return (
    // <a href={hotel.url} target="_blank" rel="noopener noreferrer">
    <>
      <div
        className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group "
        onClick={() => {
          setShowTodoModal(true);
        }}
      >
        <div className="relative h-3/5 w-full">
          <img
            src={hotel.photo1 || "/default-hotel.jpeg"}
            className="h-full w-full object-cover rounded-lg"
            alt={hotel.hotel_name}
          />
          <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
            {hotel.city}
          </div>

          <div className="absolute bottom-2 left-2 px-0.5 py-0.5 bg-white rounded-lg bg-opacity-80 group-hover:bg-opacity-100 ">
            <img
              src={"/agoda-logo.svg"}
              className="h-7 w-7 md:w-8 md:h-8 rounded-lg"
              alt="agoda-logo"
            />
          </div>
        </div>
        <div className="flex flex-col justify-start p-2 overflow-hidden text-sm text-gray-500">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col gap-0.5 leading-tight">
              <h2 className="text-gray-700 font-semibold w-full text-ellipsis overflow-hidden line-clamp-2 text-xs md:text-base text-start">
                {hotel.hotel_name}
              </h2>
              <div className="text-xs font-light overflow-hidden line-clamp-1 text-start flex flex-row gap-1 items-center">
                <p className="line-clamp-1 ">{hotel.addressline1}</p>
              </div>
              <div className="flex flex-row gap-1 text-[9px] md:text-xs font-normal  text-ellipsis overflow-hidden line-clamp-2 text-start mt-1">
                <span className="flex flex-row gap-1 items-center">
                  <FaStar /> {hotel.rating_average}
                </span>
                <span>|</span>
                <span className="flex flex-row gap-1 items-center">
                  <MdLocalHotel />
                  <p className="line-clamp-1">{hotel.accommodation_type}</p>
                </span>
                {/* <span>|</span> */}
              </div>
              {/* <div className="text-start text-gray-400 text-[9px] mt-1">

             <p>{hotel.addressline1}</p>
          </div> */}
            </div>
          </div>
        </div>
      </div>
      {showTodoModal && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => {
              setShowTodoModal(false);
              // setNewTodo(null);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.div>

          <AnimatePresence>
            <motion.div
              className={`fixed inset-y-0 z-50 bg-white ${
                window.innerWidth >= 1024 // Mode lg ke atas
                  ? "right-0 w-3/5 max-h-screen" // Modal di sebelah kanan dengan lebar 3/5 layar dan tinggi maksimum layar
                  : "inset-x-0 bottom-0 h-screen" // Modal di bagian bawah untuk mode sm dan md dengan tinggi 90% layar
              }`}
              initial={
                window.innerWidth >= 1024
                  ? { x: "100%" } // Animasi dari kanan untuk lg ke atas
                  : { y: "100%" } // Animasi dari bawah untuk sm dan md
              }
              animate={
                window.innerWidth >= 1024
                  ? { x: 0 } // Animasi ke posisi awal (kanan)
                  : { y: 0 } // Animasi ke posisi awal (bawah)
              }
              exit={
                window.innerWidth >= 1024
                  ? { x: "100%" } // Animasi keluar ke kanan
                  : { y: "100%" } // Animasi keluar ke bawah
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative flex flex-col h-full justify-start items-end md:items-start px-4 my-2">
                <div className="flex mt-3">

                  <button
                    onClick={() => setShowTodoModal(false)}
                    className="items-start text-sm md:text-base text-gray-500 px-3 cursor-pointer flex items-center flex-row gap-3 "
                  >
                    <FaArrowLeft /> tutup
                  </button>
                </div>
                <hr className="w-full bg-gray-200 mt-2" />
                <HotelModalContent hotel={hotel} />

                <hr className="w-full bg-gray-500 my-2" />
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default HotelCard;
