"use client";

import { useEffect, useState } from "react";
import convertToHttps from "@/components/hotel/service/convertToHttps";
import { FaFilter, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import HotelCard from "./_components/HotelCard";
import FilterHotel from "./_components/FilterHotel";

interface Hotel {
  hotelId: number;
  hotelName: string;
  dailyRate: number;
  currency: string;
  imageURL: string;
  landingURL: string;
  roomTypeName: string | undefined;
  starRating: number; 
  reviewCount: number;
  reviewScore: number;
  crossedOutRate: number;
  discountPercentage: number;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

interface FilterParams {
  cityId: number;
  cityName: string;
  checkInDate: string;
  checkOutDate: string;
  maxResult: number;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  discountOnly: boolean;
  minStarRating: number | null;
  minReviewScore: number | null;
}

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cityId: 17193,
    cityName: "",
    checkInDate: "2025-07-01",
    checkOutDate: "2025-07-05",
    maxResult: 30,
    sortBy: "Recommended",
    minPrice: null,
    maxPrice: null,
    discountOnly: false,
    minStarRating: null,
    minReviewScore: null,
  });

  const fetchHotels = async (filterParams = filters) => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        cityId: filterParams.cityId.toString(),
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
      });

      const response = await fetch(`/api/agoda/getHotels?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results) {
        const hotelsWithHttps = data.results.map((hotel: Hotel) => ({
          ...hotel,
          imageURL: convertToHttps(hotel.imageURL),
        }));
        setHotels(hotelsWithHttps);
      } else {
        setError("No hotels found.");
        setHotels([]);
      }
    } catch (error) {
      setError("Failed to fetch hotels.");
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    fetchHotels({ ...filters, ...newFilters });
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <div className="text-gray-800 font-bold text-2xl md:text-4xl my-2">
        <h2>Mau menginap dimana?</h2>
      </div>

      <FilterHotel
        onFilter={handleFilter}
        initialCityId={filters.cityId}
        initialCityName={filters.cityName}
      />

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.hotelId} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
