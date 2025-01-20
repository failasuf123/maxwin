// app/itinerarry-list/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { collection, query, where, getDocs } from "firebase/firestore";

import NavBar from "@/components/navbar/NavBar";
import ItineraryList from "@/components/home/ItineraryList";
import { db } from "@/app/service/firebaseConfig";

// 1) Define a custom type for GooglePlacesAutocomplete's "Option"
interface GooglePlaceOption {
  label: string;
  // 'value' must have at least a 'description' field
  value: {
    description: string;
  };
}

export default function ItineraryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Grab "?city=..." from the URL, e.g. "/itinerary-list?city=Jakarta"
  const initialCityParam = searchParams.get("city") || "";

  // 2) Keep track of the current city param (for fetching data)
  const [cityParam, setCityParam] = useState<string>(initialCityParam);

  // 3) We'll store the user's selected city string in 'selectedCity'
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // 4) We also have a separate state to control what the autocomplete shows.
  //    If there's an initial city, we fill it with label + value.description.
  const [autocompleteValue, setAutocompleteValue] = useState<GooglePlaceOption | null>(
    initialCityParam
      ? {
          label: initialCityParam,
          value: { description: initialCityParam },
        }
      : null
  );

  // Firestore data
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ------------------------------------------------------------------
  // Fetch itineraries:
  // - If cityParam is empty => fetch ALL itineraries (public + published).
  // - If cityParam is not empty => fetch EXACT "tripData.city" == cityParam.
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        let q;
        if (!cityParam) {
          // No city => get all
          q = query(
            collection(db, "Trips"),
            where("public", "==", true),
            where("publish", "==", true)
          );
        } else {
          // Has city => exact match
          q = query(
            collection(db, "Trips"),
            where("public", "==", true),
            where("publish", "==", true),
            where("tripData.city", "==", cityParam)
          );
        }

        const querySnapshot = await getDocs(q);
        const trips: any[] = [];
        querySnapshot.forEach((doc) => trips.push(doc.data()));
        setItineraries(trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [cityParam]);

  // ------------------------------------------------------------------
  // Handle user selecting a new city from the search bar
  // ------------------------------------------------------------------
  const handleSearch = () => {
    // If we have selectedCity, then push it to the URL
    if (selectedCity) {
      router.replace(`/itinerary-list?city=${encodeURIComponent(selectedCity)}`);
      setCityParam(selectedCity);
    }
  };

  // ------------------------------------------------------------------
  // Handle user clicking "Semua Itinerary": reset to show ALL
  // ------------------------------------------------------------------
  const handleAllItinerary = () => {
    router.replace("/itinerary-list"); // remove any ?city=...
    setCityParam("");
    // Also clear the autocomplete value so the field is empty
    setAutocompleteValue(null);
    setSelectedCity(null);
  };

  return (
    <>
      <NavBar />
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {/* Conditional Title */}
        {cityParam ? (
          <h1 className="text-2xl font-bold mb-2">
            Hasil Pencarian: {cityParam}
          </h1>
        ) : (
          <h1 className="text-2xl font-bold mb-2">Semua Itinerary</h1>
        )}

        {/* TOP SEARCH BAR */}
        <div className="mb-6 flex flex-col items-start space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-2">
          <div className="w-full md:w-1/2">
            <GooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
              selectProps={{
                // "value" must match your GooglePlaceOption or be null
                value: autocompleteValue,
                placeholder: "Pilih kota tujuan...",

                // Clears on focus
                onFocus: () => {
                  setAutocompleteValue(null);
                  setSelectedCity(null);
                },

                // When user selects from suggestions:
                onChange: (option: GooglePlaceOption | null) => {
                  setAutocompleteValue(option);
                  setSelectedCity(option?.label || null);
                },
              }}
              autocompletionRequest={{
                componentRestrictions: { country: ["ID", "SG", "MY", "TH", "VN", "PH"] },
                types: ["(cities)"],
              }}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-row gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 font-medium text-white 
                         bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none"
            >
              Cari
            </button>

            <button
              onClick={handleAllItinerary}
              className="px-4 py-2 font-medium text-white 
                         bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
            >
              Semua Itinerary
            </button>
          </div>
        </div>

        {/* ITINERARY LIST */}
        <ItineraryList itineraries={itineraries} loading={loading} />
      </div>
    </>
  );
}
