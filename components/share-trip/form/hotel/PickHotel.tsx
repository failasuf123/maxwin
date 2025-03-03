"use client";

import { useState, useEffect, useCallback } from "react";
import HotelCardTodo from "@/components/hotel/HotelCardTodo";
import { getFilteredHotels, getRandomHotels } from "@/components/hotel/service/getHotel";
import FilterHotelTodo from "@/components/hotel/FilterHotelTodo";

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

interface HotelFormProps {
  newTodo: {
    type: string;
    name: string;
    description?: string;
    cost: number;
    timeStart?: string;
    timeEnd?: string;
    tag?: string[];
    image?: string;
    imageList?: string[];
    date?: string;
  };
  setNewTodo: (todo: any) => void;
}


const PickHotel: React.FC<HotelFormProps> = ({ newTodo, setNewTodo }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ city: string; state: string; type: string }>({
    city: "Indonesia", // Default: nonaktifkan filter city
    state: "Indonesia", // Default: nonaktifkan filter state
    type: "All Type", // Default: nonaktifkan filter type
  });
  const [page, setPage] = useState(1); // Untuk infinite scrolling

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
        setHotels(initialHotels);
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
  
        setHotels((prev) => [...prev, ...uniqueNewHotels]);
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

  // Fungsi untuk menerima filter dari komponen FilterHotelTodo
  const handleFilter = (newFilters: { city: string; state: string; type: string }) => {
    setFilters(newFilters);
    setPage(1); // Reset halaman ke 1 saat filter berubah
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Hai! Mau menginap dimana?</h1>
      <FilterHotelTodo onFilter={handleFilter} />
      <hr className="w-full bg-gray-200 my-2 md:my-4" />
      <div className="grid grid-cols-2 gap-2 md:gap-5">
        {hotels.map((hotel) => (
          // <HotelCardTodo key={hotel.hotel_id} hotel={hotel} />
          <HotelCardTodo key={hotel.hotel_id} hotel={hotel} newTodo={newTodo} setNewTodo={setNewTodo} />
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-2 gap-2 md:gap-5">
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

export default PickHotel
