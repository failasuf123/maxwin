"use client";
import React, { useState, useEffect } from "react";
import { FaCity } from "react-icons/fa";

interface City {
  city: string;
  city_id: number;
}

interface LocationAutocompleteProps {
  onSelect: (city: string, cityId?: number) => void;
  typeProps?: "AITrip" | "EditTrip" | "SearchTrip" | "Itinerary";
  initialCity?: string;
}

export default function LocationAutocomplete({
  onSelect,
  typeProps,
  initialCity = "",
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialCity);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);

  // Load city data
  useEffect(() => {
    fetch("/city_list.json")
      .then((response) => response.json())
      .then((data) => setCityList(data))
      .catch((error) => console.error("Error loading city data:", error));
  }, []);

  // Filter cities based on query
  useEffect(() => {
    if (query && query.length >= 2) {
      const filtered = cityList.filter((item) =>
        item.city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [query, cityList]);

  // Update query if initialCity changes
  useEffect(() => {
    setQuery(initialCity);
  }, [initialCity]);

  const handleSelectCity = (city: City) => {
    setQuery(city.city);
    setFilteredCities([]);
    onSelect(city.city, city.city_id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // For EditTrip mode, send the query directly
    if (typeProps === "EditTrip") {
      onSelect(value);
    }
  };

  // 🟢 **AITrip View**
  if (typeProps === "AITrip") {
    return (
      <div className="relative w-full">
        <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Masukkan Nama Kota"
          className="mt-1 block w-full pl-10 p-2 h-12 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm hover:bg-gray-100 hover:placeholder-gray-700 transition-all duration-300 ease-in-out"
        />
        {filteredCities.length > 0 && (
          <div className="absolute top-14 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {filteredCities.map((city) => (
              <div
                key={city.city_id}
                className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectCity(city)}
              >
                {city.city}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🟡 **SearchTrip View**
  if (typeProps === "SearchTrip") {
    return (
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Masukkan kota tujuan..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {filteredCities.length > 0 && (
          <div className="absolute top-12 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {filteredCities.map((city) => (
              <div
                key={city.city_id}
                className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectCity(city)}
              >
                {city.city}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🟠 **EditTrip View**
  if (typeProps === "EditTrip") {
    return (
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Masukan kota tujuan..."
          className="w-full font-bold text-sm md:text-lg xl:text-xl outline-none bg-gray-100 focus:outline-none border-b-2 px-2 py-2 border-dashed border-gray-700 hover:bg-gray-200 rounded"
        />
        {filteredCities.length > 0 && (
          <div className="absolute top-12 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {filteredCities.map((city) => (
              <div
                key={city.city_id}
                className="p-3 font-normal text-xs md:text-base xl:text-lg cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectCity(city)}
              >
                {city.city}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeProps === "Itinerary") {
    return (
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Kota tujuan..."
          className="w-full py-2 bg-transparent focus:outline-none placeholder-gray-500 text-gray-700"
        />
        {filteredCities.length > 0 && (
          <div className="absolute top-10 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {filteredCities.map((city) => (
              <div
                key={city.city_id}
                className="p-2 text-sm cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                onClick={() => handleSelectCity(city)}
              >
                {city.city}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // ⚪ **Default View**
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Masukan kota tujuan..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {filteredCities.length > 0 && (
        <div className="absolute top-12 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
          {filteredCities.map((city) => (
            <div
              key={city.city_id}
              className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200"
              onClick={() => handleSelectCity(city)}
            >
              {city.city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
