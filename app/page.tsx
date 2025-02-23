"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import ItineraryList from "@/components/home/ItineraryList";
import HotelList from "@/components/home/HotelList";
import ActivityList from "@/components/home/ActivityList";
import Typewriter from "typewriter-effect";
import { TbMapPinStar } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsStars } from "react-icons/bs";
import { IoIosCreate } from "react-icons/io";
import Link from "next/link";
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";
import ItineraryListHome from "@/components/home/ItineraryListHome";
import BannerAIBeta from "@/components/home/BannerAIBeta";
import FooterHome from "@/components/home/FooterHome";
import LocationAutocomplete from "@/components/service/LocalAutoComplate";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleSearch = () => {
    if (!selectedCity) {
      toast({
        title: "Oops!",
        description: "Silakan pilih kota dari daftar sebelum mencari.",
      });
      return;
    }
  
    setIsLoading(true); // Activate loading
    setTimeout(() => {
      router.push(`/explore/itinerary?city=${encodeURIComponent(selectedCity)}`);
    }, 500); // Simulate loading delay
  };
  

  const cities = [
    "di Jakarta",
    "di Bali",
    "di Purwokerto",
    "di Bandung",
    "di Jogja",
    "di Malang",
    "di Surabaya",
    "di Dieng",
    "di Batu",
  ];
  const handleLinkClick = () => {
    setIsLoading(true); // Activate loading
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div>
            Loading...
          </div>
        </div>
      )}
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
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Halo, mau ke mana?
          </h1>
          {/* <p className="mt-2 text-lg text-white md:text-xl">
            Yuk lihat plan liburan orang lain di Bali
          </p> */}
          <div className="mt-2 text-lg text-white md:text-xl flex flex-col md:flex-row gap-2">
            <p>Yuk lihat plan liburan orang lain</p>
            <Typewriter
              options={{
                strings: cities,
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
              }}
            />
          </div>

          {/* Search bar + button */}
          <div className="flex flex-row justify-center  gap-3 items-center mt-6 w-full">
            <div className="w-full md:w-3/4 ">
              {/* <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  placeholder: "Pilih kota tujuan...",
                  onChange: (value: any) => {
                    setSelectedCity(value?.label || null);
                  },
                }}
                autocompletionRequest={{
                  componentRestrictions: {
                    // country: ["ID", "SG", "MY", "TH", "VN", "PH"],
                    country: ["ID"],
                  },
                  types: ["(cities)"],
                }}
              /> */}
              {/* <input
                type="text"
                placeholder="Masukkan kota tujuan..."
                value={selectedCity || ""}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              /> */}

        <LocationAutocomplete
          onSelect={(city) => setSelectedCity(city)} // Simpan kota yang dipilih
          typeProps="SearchTrip" // Contoh styling yang bisa diubah nantinya
          initialCity=""
        />

            </div>

            <div className="items-center">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-4 py-2 font-medium text-white bg-yellow-500 rounded-md hover:bg-black focus:outline-none"
              >
                Cari
              </button>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="flex flex-row items-center justify-center mx-1 md:mx-8 gap-2 px-4 py-2 mt-5 md:mt-12 font-semibold text-white bg-yellow-500 border-yellow-500 rounded-md hover:bg-black cursor-pointer border-2 hover:border-white">
                <div>
                  <TbMapPinStar />
                </div>
                <div>Buat Rencana Liburanmu</div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-72 md:w-[350px]">
              <div className="flex flex-col md:flex-row text-gray-800 md:justify-evenly w-full gap-3 md:gap-0">
                <Link href="/create-itinerary/create" onClick={handleLinkClick}>
                  <div className="flex flex-row md:flex-col gap-3 md:gap-2 items-center justify-start md:justify-center group cursor-pointer">
                    <BsStars className="text-xl md:text-2xl lg:text-3xl group-hover:rotate-12" />
                    <div className="group-hover:underline group-hover:underline-offset-8">
                      Menggunakan AI
                    </div>
                  </div>
                </Link>

                <hr className="w-full  border-gray-400 md:hidden" />
                <Link href="/share-trip/share" onClick={handleLinkClick}>
                  <div className="flex flex-row md:flex-col gap-3 md:gap-2 items-center justify-start md:justify-center group cursor-pointer">
                    <IoIosCreate className="text-base md:text-2xl lg:text-3xl group-hover:rotate-12" />
                    <div className="group-hover:underline group-hover:underline-offset-8">
                      Buat manual
                    </div>
                  </div>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-between py-5 px-3">
        {/* <div className="flex flex-col items-center py-3 md:py-8 px-5"> */}
        <div className="w-full max-w-7xl mx-auto">
          {/* <Banner /> */}

          <div className="mt-10">
            <ItineraryListHome />
          </div>

          <div className="mt-10 md:mt-16">
            <BannerAIBeta />
          </div>

          {/* Section 2: CariHotel */}

          {/* <div className="mt-10">
            <ItineraryList />
          </div> */}

          {/* Section 2: CariHotel */}
          {/* <div className="mt-10">
          <HotelList />
        </div> */}

          {/* Section 3: CariAktivitas */}
          {/* <div className="mt-10">
          <ActivityList />
        </div> */}
        </div>
      </section>

      <section className="mt-10">
        <FooterHome/>
      </section>
    </>
  );
}
