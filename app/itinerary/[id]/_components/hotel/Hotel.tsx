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

import { City, HotelAgodaAPI, HotelTodo } from "../../_utils/typings";

interface HotelProps {
  cityList: City[] | undefined;
  cityId: number[];
  startDate?: string;
  endDate?: string;
  onHotelSelect: (
    hotel: HotelAgodaAPI,
    checkinDate: string,
    checkoutDate: string
  ) => void; // Perubahan di sini
}

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

export default function Hotel({
  cityList,
  cityId,
  startDate = "",
  endDate = "",
  onHotelSelect,
}: HotelProps) {
  const [selectedHotel, setSelectedHotel] = useState<HotelAgodaAPI | null>(
    null
  );
  const [hotels, setHotels] = useState<HotelAgodaAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const [filters, setFilters] = useState({
    cityId: cityId,
    cityName: cityList,
    checkInDate: startDate || formatDate(tomorrow),
    checkOutDate: endDate || formatDate(dayAfterTomorrow),
    maxResult: 30,
    sortBy: "Recommended",
    minPrice: null,
    maxPrice: null,
    discountOnly: false,
    minStarRating: null,
    minReviewScore: null,
  });

  useEffect(() => {
    console.log("city List =");
    console.log(cityList);
  });

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
        ...(filterParams.minPrice !== null && {
          minPrice: String(filterParams.minPrice),
        }),
        ...(filterParams.maxPrice !== null && {
          maxPrice: String(filterParams.maxPrice),
        }),
        ...(filterParams.minStarRating !== null && {
          minStarRating: String(filterParams.minStarRating),
        }),
        ...(filterParams.minReviewScore !== null && {
          minReviewScore: String(filterParams.minReviewScore),
        }),
      };

      // Fetch untuk semua cityId secara paralel
      const fetchPromises = filterParams.cityId.map(async (id) => {
        const params = new URLSearchParams({
          ...baseParams,
          cityId: id.toString(),
        });

        const response = await fetch(
          `/api/agoda/getHotels?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} untuk cityId ${id}`
          );
        }

        return response.json();
      });

      const results = await Promise.allSettled(fetchPromises);
      let allHotels: HotelAgodaAPI[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const cityIdUsed = filterParams.cityId[index];

          const hotelsWithHttps =
            result.value.results?.map((hotel: HotelAgodaAPI) => ({
              ...hotel,
              imageURL: convertToHttps(hotel.imageURL),
              cityId: cityIdUsed,
            })) || [];
          allHotels = [...allHotels, ...hotelsWithHttps];
        }
      });

      const hotelsWithCityName = allHotels.map((hotel) => {
        console.log("Hotel CityId:", hotel.cityId); // Perhatikan huruf besar 'C'
        console.log(
          "Available cityIds:",
          cityList?.map((c) => c.cityId)
        );

        const city = cityList?.find((c) => c.cityId === hotel.cityId);

        console.log("Found city:", city);

        return {
          ...hotel,
          cityName: city ? city.cityName : "Unknown City",
        };
      });

      // Acak urutan hotel dan simpan
      // setHotels(shuffleArray(allHotels));
      setHotels(shuffleArray(hotelsWithCityName));
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
      setError(
        cityId.length === 0
          ? "Silakan pilih kota tujuan terlebih dahulu"
          : "Silakan pilih tanggal check-in dan check-out"
      );
    } else {
      fetchHotels();
    }
  }, []);

  const handleAddToItinerary = (hotel: HotelAgodaAPI) => {
    setSelectedHotel(hotel);
    console.log("Dari Hote: ", hotel);
  };

  const formatUserFriendlyDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <ScrollArea className="min-h-screen w-full rounded-md border pb-12">
        <div className="w-full mx-4 min-h-screen pl-5 pr-10 md:pl-4 md:pr-4 ">
          <div className="text-gray-800 font-bold text-2xl md:text-4xl my-2">
            <h2>Mau menginap dimana?</h2>
          </div>

          {/* Informasi default tanggal */}
          {!showPlaceholder && (
            <>
              <div className="text-gray-600 text-sm mb-2 flex flex-row items-center justify-between">
                <p>Check-in: {formatUserFriendlyDate(filters.checkInDate)}</p>
                <p>Check-out: {formatUserFriendlyDate(filters.checkOutDate)}</p>
              </div>
            </>
          )}

          {cityId.length !== 0 && (
            <FilterHotel
              onFilter={handleFilter}
              initialCityId={filters.cityId}
              initialCityName={""}
              initialStartDate={filters.checkInDate}
              initialEndDate={filters.checkOutDate}
            />
          )}

          {/* Tampilkan placeholder jika data kurang */}
          {showPlaceholder && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-8 rounded-lg max-w-xl w-full">
                {cityId.length === 0 ? (
                  <h3 className="text-xl font-bold mb-4">
                    Sepertinya kamu belum memiliki kota tujuan
                  </h3>
                ) : (
                  <h3 className="text-xl font-bold mb-4">
                    Sesuaikan Tanggal Checkout dan Chekin kamu
                  </h3>
                )}

                {cityId.length === 0 ? (
                  <>
                    <p className="text-gray-600 mb-6">
                      Silakan pilih satu atau beberapa kota tujuan terlebih
                      dahulu
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-6">
                      Silakan pilih tanggal check-in dan check-out
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>
                        Default check-in: besok (
                        {formatUserFriendlyDate(filters.checkInDate)})
                      </p>
                      <p>
                        Default check-out: besok lusa (
                        {formatUserFriendlyDate(filters.checkOutDate)})
                      </p>
                    </div>
                  </>
                )}
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
                {hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.hotelId}
                    hotel={hotel}
                    checkinDate={filters.checkInDate}
                    checkoutDate={filters.checkOutDate}
                    onAddToItinerary={() =>
                      onHotelSelect(
                        hotel,
                        filters.checkInDate,
                        filters.checkOutDate
                      )
                    }
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2 my-10 rounded w-full mx-1 px-2 py-2 rounded bg-gray-100 items-center justify-center">
                <div className="font-bold text-lg md:text-xl text-gray-800">
                  Tidak menemukan hotel yang cocok buat kamu?
                </div>

                <p className="text-base md:text-lg text-gray-700">
                  Coba lakukan filter hotel
                </p>
              </div>
            </>
          )}

          {!showPlaceholder && !loading && hotels.length === 0 && !error && (
            <div className="text-center py-8">
              <p>Tidak ada hotel yang ditemukan</p>
              <Button onClick={() => fetchHotels()} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
