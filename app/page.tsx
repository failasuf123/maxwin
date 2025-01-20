"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";  // <-- Import from next/navigation
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import NavBar from "@/components/navbar/NavBar";

export default function Home() {
  const router = useRouter();  // Correct hook for app/ directory
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleSearch = () => {
    if (selectedCity) {
      // Navigate to /itinerary-list?city=...
      router.push(`/itinerary-list?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  return (
    <>
      {/* If you want custom head elements, 
          you can use Next 13's new metadata API 
          or keep using the old <Head> with caution. 
          For example: 
      */}
      {/* 
      <Head>
        <title>Mau Liburan</title>
        <meta name="description" content="Mau Liburan - Plan your vacation" />
      </Head>
      */}

      <NavBar />

      {/* HERO SECTION */}
      <section
        className="relative flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/home-background.png')",
          height: "75vh",
        }}
      >
        {/* Dark overlay if needed */}
        <div className="absolute inset-0 bg-black opacity-30" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Halo, mau ke mana?
          </h1>
          <p className="mt-2 text-lg text-white md:text-xl">
            Yuk lihat plan liburan orang lain!
          </p>

          {/* Search bar + button */}
          <div className="flex flex-col items-center mt-6 space-y-3 w-full">
            <div className="w-full md:w-3/4 lg:w-1/2">
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  placeholder: "Pilih kota tujuan...",
                  onChange: (value: any) => {
                    setSelectedCity(value?.label || null);
                  },
                }}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ["ID", "SG", "MY", "TH", "VN", "PH"],
                  },
                  types: ["(cities)"],
                }}
              />
            
            </div>

            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-4 py-2 font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none"
            >
              Cari
            </button>
            
          </div>

          {/* Optional CTA Button */}
          <button className="px-4 py-2 mt-4 font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
            Buat Rencana Liburanmu
          </button>
        </div>
      </section>
    </>
  );
}
