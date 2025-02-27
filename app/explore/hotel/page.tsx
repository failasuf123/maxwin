"use client"
import FilterHotel from "@/components/hotel/FilterHotel";
import HotelList from "@/components/hotel/HotelList";
import { getRandomHotels } from "@/components/hotel/service/getHotel";
import React, { useState } from "react";

// Definisikan tipe data Hotel
interface Hotel {
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
}

const HotelPage = () => {




  return (
    <div className="flex item-center justify-center">
      <div className="flex flex-col items-center  w-[1000px] min-h-screen">
        <HotelList />
      </div>
    </div>
  );
};

export default HotelPage;