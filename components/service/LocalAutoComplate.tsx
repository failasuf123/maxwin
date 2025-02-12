"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCity } from "react-icons/fa";
import {
  touristPlace,
  cityProvinceList,
} from "@/app/constants/city-province-list";

type Timeout = ReturnType<typeof setTimeout>;

interface Suggestion {
  type: string;
  data: {
    provinsi?: string;
    kota?: string;
    lokasi?: string;
  };
  display: string;
}

interface LocationAutocompleteProps {
  onSelect: (city: string) => void;
  typeProps?: "AITrip" | "EditTrip" | "SearchTrip";
  initialCity?: string;
}

export default function LocationAutocomplete({
  onSelect,
  typeProps,
  initialCity = "",
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialCity);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceTimer = useRef<Timeout | null>(null);

  // Jika initialCity berubah dari luar, update state
  useEffect(() => {
    setQuery(initialCity);
  }, [initialCity]);

  const formatSuggestion = (type: string, data: any) => {
    switch (type) {
      case "kota":
        return `${data.kota}, ${data.provinsi}`;
      case "provinsi":
        return data.provinsi;
      case "lokasi":
        return `${data.lokasi}, ${data.kota}, ${data.provinsi}`;
      default:
        return "";
    }
  };

  const generateSuggestions = (query: string): Suggestion[] => {
    const lowerCaseQuery = query.toLowerCase();

    const touristSuggestions = touristPlace
      .filter(
        (place) =>
          place.lokasi.toLowerCase().includes(lowerCaseQuery) ||
          place.kota.toLowerCase().includes(lowerCaseQuery) ||
          place.provinsi.toLowerCase().includes(lowerCaseQuery)
      )
      .map((place) => ({
        type: "lokasi",
        data: place,
        display: formatSuggestion("lokasi", place),
      }));

    const cityProvinceSuggestions = cityProvinceList.flatMap((province) => {
      const kotaSuggestions = province.kota
        .filter((kota) => kota.toLowerCase().includes(lowerCaseQuery))
        .map((kota) => ({
          type: "kota",
          data: { kota, provinsi: province.provinsi },
          display: formatSuggestion("kota", {
            kota,
            provinsi: province.provinsi,
          }),
        }));

      const provinceSuggestions = province.provinsi
        .toLowerCase()
        .includes(lowerCaseQuery)
        ? [
            {
              type: "provinsi",
              data: { provinsi: province.provinsi },
              display: formatSuggestion("provinsi", {
                provinsi: province.provinsi,
              }),
            },
          ]
        : [];

      return [...kotaSuggestions, ...provinceSuggestions];
    });

    return [...touristSuggestions, ...cityProvinceSuggestions];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        const suggestions = generateSuggestions(value);
        setSuggestions(suggestions);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };
  const handleSelectSuggestion = (suggestion: { display: string }) => {
    let formattedCity = suggestion.display;
  
    if (typeProps === "SearchTrip") {
      formattedCity = suggestion.display.split(",")[0].trim(); // Ambil bagian pertama sebelum koma
    }
  
    setQuery(formattedCity);
    setSuggestions([]);
    onSelect(formattedCity); // Pastikan value yang dikirim hanya bagian pertama
  };
  

  // 🟢 **Tampilan AITrip**
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
        {suggestions.length > 0 && (
          <div className="absolute top-14 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🟡 **Tampilan SearchTrip**
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
        {suggestions.length > 0 && (
          <div className="absolute top-12 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md item-start">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🟠 **Tampilan EditTrip**
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

        {suggestions.length > 0 && (
          <div className="absolute top-12 left-0 right-0 border border-gray-300 bg-white z-50 max-h-48 overflow-y-auto shadow-md rounded-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 font-normal text-xs md:text-base xl:text-lg cursor-pointer border-b border-gray-200 hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ⚪ **Tampilan Default**
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Masukan kota tujuan..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
