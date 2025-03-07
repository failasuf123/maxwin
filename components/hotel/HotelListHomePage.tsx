"use client";
import React, { useEffect, useState } from "react";
import LoadingAnimationBlack from "../LoadingAnimationBlack";
import HotelCard from "@/components/hotel/HotelCard";
import { getRandomHomepageHotels } from "@/components/hotel/service/getHotelHomePage";

function HotelListHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const data = await getRandomHomepageHotels();
      setHotels(data);
    };
    fetchHotels();
  }, []);

  const handleLinkClick = () => {
    setIsLoading(true); // Activate loading
  };
  
  return (
    <div className="mt-10 md:mx-12 xl:mx-20">
      {isLoading && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div>Memuat Halaman...</div>
        </div>
      )}
      <div className="flex items-center justify-between mb-1 ">
        <h2 className="text-2xl md:text-3xl font-bold">Hotel</h2>
        <a
          href="/explore/hotel"
          className="text-white font-semibold bg-cyan-500 px-3 py-2 rounded-xl hover:bg-black "
          onClick={handleLinkClick}
        >
          Selengkapnya &rarr;
        </a>
      </div>
      <p className="text-gray-600 text-lg md:text-xl mb-1 md:mb-5 flex flex-row justify-between items-center">
        Booking / Masukan Hotel Ke Rencana Trip Anda
        <span className="text-xs md:text-sm font-light text-gray-500 hidden md:block ">*tersedia <span className="font-semibold">28.000+ </span>pilihan hotel</span>
      </p>
      <div className=" mb-2 w-full flex justify-start items-center md:hidden">

        <p className="text-xs md:text-sm font-light text-gray-400 ">* tersedia 28.000+ pilihan hotel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
      {hotels.map((hotel) => (
          <HotelCard key={hotel.hotel_id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default HotelListHomePage;
