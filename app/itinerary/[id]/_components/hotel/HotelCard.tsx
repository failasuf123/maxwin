// components/HotelCard.tsx
"use client";

import React from "react";
import { FaStar as FaStarIcon } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";

interface Hotel {
  hotelId: number;
  hotelName: string;
  dailyRate: number;
  currency: string; 
  imageURL: string;
  landingURL: string;
  roomTypeName?: string | undefined; 
  starRating: number;
  reviewCount: number;
  reviewScore: number;
  crossedOutRate: number;
  discountPercentage: number;
  includeBreakfast: boolean;
  freeWifi: boolean;
  cityName?: string; 
}

// Helper untuk format mata uang
const formatCurrency = (amount: number, currencyCode: string = "IDR") => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface HotelCardProps {
  hotel: Hotel;
  checkinDate: string; 
  checkoutDate: string; 
  onAddToItinerary?: (
    hotel: Hotel,
    checkinDate: string,
    checkoutDate: string
  ) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, checkinDate, checkoutDate, onAddToItinerary }) => {
  return (
    <div className="flex flex-col h-[380px] w-full overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Bagian Gambar */}
      <div className="relative h-2/5 w-full">
        <img
          src={hotel.imageURL || "/default-hotel.jpeg"}
          alt={hotel.hotelName}
          className="h-full w-full object-cover"
        />

        {/* Overlay Nama Kota - Pojok Kiri Atas */}
        {hotel.cityName && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
            {hotel.cityName}
          </div>
        )}

        {/* Overlay Diskon di gambar - Kanan Atas */}
        {hotel.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <MdLocalOffer size={12} />
            <span>{hotel.discountPercentage}% OFF</span>
          </div>
        )}

        {/* Overlay Bintang Rating di gambar - Kanan Bawah */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 z-10">
          {hotel.starRating > 0 && (
            <>
              <span>{hotel.starRating.toFixed(1)}</span>
              <FaStarIcon className="text-yellow-400" />
            </>
          )}
        </div>

        {/* Agoda Logo - Kiri Bawah */}
        <div className="absolute bottom-2 left-2 p-0.5 bg-white rounded-md bg-opacity-80 group-hover:bg-opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <img
            src={"/agoda-logo.svg"}
            className="h-6 w-6 md:h-7 md:w-7 rounded"
            alt="platform-logo"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Bagian Konten Tekstual */}
      <div className="flex flex-col justify-between flex-grow p-3 overflow-hidden bg-white">
        <div>
          <h2
            className="text-gray-800 font-semibold w-full text-ellipsis overflow-hidden line-clamp-2 text-sm md:text-base text-start mb-1 group-hover:text-cyan-600 transition-colors duration-300"
            title={hotel.hotelName}
          >
            {hotel.hotelName}
          </h2>

          {/* Info Review */}
          {hotel.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <span className="bg-cyan-500 text-white font-semibold px-1.5 py-0.5 rounded-sm">
                {hotel.reviewScore.toFixed(1)}
              </span>
              <span>({hotel.reviewCount} reviews)</span>
            </div>
          )}

          {/* Harga */}
          <div className="my-2">
            {hotel.discountPercentage > 0 && hotel.crossedOutRate > 0 && (
              <span className="text-xs text-gray-400 line-through mr-2">
                {formatCurrency(hotel.crossedOutRate, hotel.currency)}
              </span>
            )}
            <p className="text-base md:text-lg font-bold text-red-600">
              {formatCurrency(hotel.dailyRate, hotel.currency)}
              <span className="text-xs font-normal text-gray-500"> / malam</span>
            </p>
          </div>

          {/* Fasilitas */}
          <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] md:text-xs mb-2">
            {hotel.includeBreakfast && (
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Sarapan Gratis
              </span>
            )}
            {hotel.freeWifi && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                WiFi Gratis
              </span>
            )}
          </div>
        </div>
        
        {/* Tombol Tambahkan Ke Trip */}
        <div 
          onClick={() => {onAddToItinerary && onAddToItinerary(hotel, checkinDate, checkoutDate)}}
          className="mt-auto block w-full text-center px-2 py-2 md:px-3 md:py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-300 focus:outline-none transition-colors duration-300 text-xs md:text-sm">
          Tambahkan Ke Trip
        </div>
      </div>
    </div>
  );
};

export default HotelCard;