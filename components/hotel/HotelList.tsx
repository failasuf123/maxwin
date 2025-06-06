"use client";

import { useState, useEffect, useCallback } from "react";
import HotelCard from "@/components/hotel/HotelCard";
import { getFilteredHotels, getRandomHotels } from "@/components/hotel/service/getHotel";
import FilterHotel from "./FilterHotel";

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

interface AgodaHotel {
  hotelId: number;
  hotelName: string;
  dailyRate: number;
  currency: string;
  imageURL: string;
  landingURL: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  crossedOutRate: number;
  discountPercentage: number;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ city: string; state: string; type: string }>({
    city: "Indonesia", // Default: nonaktifkan filter city
    state: "Indonesia", // Default: nonaktifkan filter state
    type: "All Type", // Default: nonaktifkan filter type
  });
  const [page, setPage] = useState(1); // Untuk infinite scrolling

  // Fungsi untuk mengambil data dari API Agoda berdasarkan batch hotelIds
  const fetchAgodaHotelDataBatch = async (hotelIds: number[]): Promise<AgodaHotel[]> => {
    try {
      const response = await fetch(
        `/api/agoda/getHotelById?hotelIds=${hotelIds.join(",")}&checkInDate=2025-07-01&checkOutDate=2025-07-05`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results; // Kembalikan semua data hotel dari API
      }
      return []; // Jika tidak ada data
    } catch (error) {
      console.error("Error fetching Agoda hotel data:", error);
      return [];
    }
  };

  // Fungsi untuk menggabungkan data lokal dan data dari API Agoda
  const mergeHotelData = async (localHotels: Hotel[]): Promise<Hotel[]> => {
    // Ambil semua hotel_id dari data lokal
    const hotelIds = localHotels.map((hotel) => hotel.hotel_id);

    // Ambil data hotel dari API Agoda secara batch
    const agodaHotels = await fetchAgodaHotelDataBatch(hotelIds);

    // Buat map untuk memudahkan pencarian data Agoda berdasarkan hotelId
    const agodaHotelMap = new Map<number, AgodaHotel>();
    agodaHotels.forEach((hotel) => {
      agodaHotelMap.set(hotel.hotelId, hotel);
    });

    // Gabungkan data lokal dengan data dari API Agoda
    const mergedHotels = localHotels.map((localHotel) => {
      const agodaHotel = agodaHotelMap.get(localHotel.hotel_id);

      return {
        ...localHotel,
        dailyRate: agodaHotel?.dailyRate || null,
        currency: agodaHotel?.currency || null,
        imageURL: agodaHotel?.imageURL || localHotel.photo1 || null,
        landingURL: agodaHotel?.landingURL || localHotel.url || null,
        starRating: agodaHotel?.starRating || localHotel.star_rating || null,
        reviewScore: agodaHotel?.reviewScore || localHotel.rating_average || null,
        reviewCount: agodaHotel?.reviewCount || null,
        crossedOutRate: agodaHotel?.crossedOutRate || null,
        discountPercentage: agodaHotel?.discountPercentage || null,
        includeBreakfast: agodaHotel?.includeBreakfast || null,
        freeWifi: agodaHotel?.freeWifi || null,
      };
    });

    return mergedHotels;
  };

  // Load data pertama kali atau saat filter berubah
  useEffect(() => {
    async function fetchInitialHotels() {
      setLoading(true);
      let initialHotels;
      if (filters.city === "Indonesia" && filters.state === "Indonesia") {
        // Ambil data secara acak jika filter city/state adalah "Indonesia"
        initialHotels = await getRandomHotels(15, filters.type);
      } else {
        // Ambil data berdasarkan filter
        initialHotels = await getFilteredHotels(filters, 1);
      }

      // Gabungkan data lokal dengan data dari API Agoda
      const mergedHotels = await mergeHotelData(initialHotels);
      setHotels(mergedHotels);

      // Tampilkan data hasil merge di console.log
      console.log("Merged Hotel Data:", mergedHotels);

      setLoading(false);
    }
    fetchInitialHotels();
  }, [filters]);

  // Fungsi load more hotels untuk infinite scrolling
  const loadMoreHotels = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      let newHotels;
      if (filters.city === "Indonesia" && filters.state === "Indonesia") {
        // Ambil data secara acak jika filter city/state adalah "Indonesia"
        newHotels = await getRandomHotels(15, filters.type);
      } else {
        // Ambil data berdasarkan filter
        newHotels = await getFilteredHotels(filters, page + 1);
      }

      // Hapus duplikasi data berdasarkan hotel_id
      const uniqueNewHotels = newHotels.filter(
        (newHotel) => !hotels.some((hotel) => hotel.hotel_id === newHotel.hotel_id)
      );

      // Gabungkan data lokal dengan data dari API Agoda
      const mergedNewHotels = await mergeHotelData(uniqueNewHotels);
      setHotels((prev) => [...prev, ...mergedNewHotels]);

      setPage((prev) => prev + 1); // Increment halaman
      setLoading(false);
    }
  }, [loading, filters, page, hotels]);

  // Event listener untuk detect scrolling ke bawah
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        loadMoreHotels();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreHotels]);

  // Fungsi untuk menerima filter dari komponen FilterHotel
  const handleFilter = (newFilters: { city: string; state: string; type: string }) => {
    setFilters(newFilters);
    setPage(1); // Reset halaman ke 1 saat filter berubah
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Mau menginap dimana?</h1>
      <FilterHotel onFilter={handleFilter} />
      <hr className="w-full bg-gray-200 my-2 md:my-4" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.hotel_id} hotel={hotel} />
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}