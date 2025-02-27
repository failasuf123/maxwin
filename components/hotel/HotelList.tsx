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

export default function HotelList() {
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

  // Fungsi untuk menerima filter dari komponen FilterHotel
  const handleFilter = (newFilters: { city: string; state: string; type: string }) => {
    setFilters(newFilters);
    setPage(1); // Reset halaman ke 1 saat filter berubah
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Hai! Mau menginap dimana?</h1>
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
// "use client";

// import { useState, useEffect } from "react";
// import HotelCard from "@/components/hotel/HotelCard";
// import { getRandomHotels } from "@/components/hotel/service/getHotel";
// import FilterHotel from "./FilterHotel";

// // Definisikan tipe data Hotel
// interface Hotel {
//   hotel_id: number;
//   hotel_name: string;
//   city: string;
//   state: string;
//   country: string;
//   star_rating: number;
//   photo1?: string | null;
//   photo2?: string | null;
//   photo3?: string | null;
//   photo4?: string | null;
//   photo5?: string | null;
//   url: string;
//   rating_average: number;
//   overview: string;
//   accommodation_type: string;
//   addressline1: string;
// }

// export default function HotelList() {
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<{ city: string; state: string; type: string }>({
//     city: "",
//     state: "",
//     type: "All Type",
//   });

//   // Load data pertama kali
//   useEffect(() => {
//     async function fetchInitialHotels() {
//       const initialHotels = await getRandomHotels();
//       setHotels(applyFilters(initialHotels, filters));
//     }
//     fetchInitialHotels();
//   }, [filters]);

//   // Fungsi untuk menerapkan filter
//   const applyFilters = (hotels: Hotel[], filters: { city: string; state: string; type: string }) => {
//     return hotels.filter((hotel) => {
//       const cityMatch = filters.city ? hotel.city === filters.city : true;
//       const stateMatch = filters.state ? hotel.state === filters.state : true;
//       const typeMatch = filters.type !== "All Type" ? hotel.accommodation_type === filters.type : true;
//       return cityMatch && stateMatch && typeMatch;
//     });
//   };

//   // Fungsi load more hotels untuk infinite scrolling
//   const loadMoreHotels = async () => {
//     if (!loading) {
//       setLoading(true);
//       setTimeout(async () => {
//         const newHotels = await getRandomHotels();
//         const filteredNewHotels = applyFilters(newHotels, filters);

//         setHotels((prev) => {
//           const uniqueHotels = [...prev, ...filteredNewHotels].filter(
//             (hotel, index, self) =>
//               index === self.findIndex((h) => h.hotel_id === hotel.hotel_id)
//           );
//           return uniqueHotels;
//         });

//         setLoading(false);
//       }, 2000);
//     }
//   };

//   // Event listener untuk detect scrolling ke bawah
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 50 >=
//         document.documentElement.offsetHeight
//       ) {
//         loadMoreHotels();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [loadMoreHotels]);

//   // Fungsi untuk menerima filter dari komponen FilterHotel
//   const handleFilter = (newFilters: { city: string; state: string; type: string }) => {
//     setFilters(newFilters);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Hotel List</h1>
//       <FilterHotel onFilter={handleFilter} />
//       <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
//         {hotels.map((hotel) => (
//           <HotelCard key={hotel.hotel_id} hotel={hotel} />
//         ))}
//       </div>
//       {loading && (
//         <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
//           <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
//           <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
//           <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
//           <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
//         </div>
//       )}
//     </div>
//   );
// }
