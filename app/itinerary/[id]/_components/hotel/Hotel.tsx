"use client";

import { useEffect, useState } from "react";
import convertToHttps from "@/components/hotel/service/convertToHttps";
import { FaFilter, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import HotelCard from "../hotel/HotelCard";
import FilterHotel from "./FilterHotel";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  HotelAgodaAPI,
  HotelTodo,
} from "../../_utils/typings";




interface HotelProps {
  city: string;
  cityId: number[];
  startDate?: string;
  endDate?: string;
  onHotelSelect: (hotel: HotelAgodaAPI) => void; // Perubahan di sini
}

export default function Hotel({
  city,
  cityId,
  startDate = "",
  endDate = "",
  onHotelSelect
}: HotelProps) {
  const [selectedHotel, setSelectedHotel] = useState<HotelAgodaAPI | null>(null);
  const [hotels, setHotels] = useState<HotelAgodaAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cityId: cityId,
    cityName: city,
    checkInDate: startDate || "2025-07-01",
    checkOutDate: endDate || "2025-07-05",
    maxResult: 30,
    sortBy: "Recommended",
    minPrice: null,
    maxPrice: null,
    discountOnly: false,
    minStarRating: null,
    minReviewScore: null,
  });

  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Fungsi untuk mengacak array
  const shuffleArray = (array: HotelAgodaAPI[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchHotels = async (filterParams = filters) => {
    // Cek apakah kota dan tanggal sudah diisi
    if (filterParams.cityId.length === 0) {
      setError("Silakan pilih kota tujuan terlebih dahulu");
      setShowPlaceholder(true);
      setLoading(false);
      return;
    }

    if (!filterParams.checkInDate || !filterParams.checkOutDate) {
      setError("Silakan pilih tanggal check-in dan check-out");
      setShowPlaceholder(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setShowPlaceholder(false);
    
    try {
      // Persiapkan semua parameter dasar (tanpa cityId)
      const baseParams = {
        checkInDate: filterParams.checkInDate,
        checkOutDate: filterParams.checkOutDate,
        maxResult: filterParams.maxResult.toString(),
        sortBy: filterParams.sortBy,
        discountOnly: filterParams.discountOnly.toString(),
        ...(filterParams.minPrice !== null && { minPrice: String(filterParams.minPrice) }),
        ...(filterParams.maxPrice !== null && { maxPrice: String(filterParams.maxPrice) }),
        ...(filterParams.minStarRating !== null && { minStarRating: String(filterParams.minStarRating) }),
        ...(filterParams.minReviewScore !== null && { minReviewScore: String(filterParams.minReviewScore) }),
      };

      // Fetch untuk semua cityId secara paralel
      const fetchPromises = filterParams.cityId.map(async (id) => {
        const params = new URLSearchParams({
          ...baseParams,
          cityId: id.toString() 
        });

        const response = await fetch(`/api/agoda/getHotels?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} untuk cityId ${id}`);
        }
        
        return response.json();
      });

      const results = await Promise.allSettled(fetchPromises);
      let allHotels: HotelAgodaAPI[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const hotelsWithHttps = result.value.results?.map((hotel: HotelAgodaAPI) => ({
            ...hotel,
            imageURL: convertToHttps(hotel.imageURL),
          })) || [];
          allHotels = [...allHotels, ...hotelsWithHttps];
        }
      });

      // Acak urutan hotel dan simpan
      setHotels(shuffleArray(allHotels));

    } catch (error) {
      setError("Gagal memuat hotel. Silakan coba lagi.");
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchHotels(updatedFilters);
  };

  useEffect(() => {
    // Cek apakah ada data yang kurang
    if (cityId.length === 0 || !startDate || !endDate) {
      setShowPlaceholder(true);
      setError(cityId.length === 0 
        ? "Silakan pilih kota tujuan terlebih dahulu" 
        : "Silakan pilih tanggal check-in dan check-out"
      );
    } else {
      fetchHotels();
    }
  }, []);

    const handleAddToItinerary = (hotel: HotelAgodaAPI) => {
    setSelectedHotel(hotel);
    console.log("Dari Hote: ", hotel)
  };

  return (
    <>
      <ScrollArea className="min-h-screen w-full rounded-md border pb-12">
        <div className="w-full mx-4 min-h-screen pl-5 pr-10 md:pl-4 md:pr-4 ">
          <div className="text-gray-800 font-bold text-2xl md:text-4xl my-2">
            <h2>Mau menginap dimana?</h2>
          </div>

          <FilterHotel
            onFilter={handleFilter}
            initialCityId={filters.cityId}
            initialCityName={filters.cityName}
            initialStartDate={filters.checkInDate}
            initialEndDate={filters.checkOutDate}
          />

          {/* Tampilkan placeholder jika data kurang */}
          {showPlaceholder && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-8 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Lengkapi Informasi</h3>
                <p className="text-gray-600 mb-6">
                  {error || "Silakan lengkapi informasi kota dan tanggal liburan Anda"}
                </p>
                
                <div className="flex flex-col gap-3">
                  {cityId.length === 0 && (
                    <Link href="/">
                      <Button className="w-full">
                        Pilih Kota Tujuan
                      </Button>
                    </Link>
                  )}
                  
                  {(!startDate || !endDate) && (
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        Pilih Tanggal Liburan
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
                  <div className="bg-gray-200 h-4 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-4 rounded animate-pulse w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded animate-pulse w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {!showPlaceholder && error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          {!showPlaceholder && hotels.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.hotelId} hotel={hotel} onAddToItinerary={() => onHotelSelect(hotel)}/>
              ))}
            </div>
          )}

          {!showPlaceholder && !loading && hotels.length === 0 && !error && (
            <div className="text-center py-8">
              <p>Tidak ada hotel yang ditemukan</p>
              <Button 
                onClick={() => fetchHotels()} 
                className="mt-4"
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}