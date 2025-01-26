// app/itinerarry-list/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import ListCategory from "@/components/explore/ListCategory"

import ItineraryList from "@/components/home/ItineraryList";
import { db } from "@/app/service/firebaseConfig";

interface GooglePlaceOption {
  label: string;
  value: {
    description: string;
  };
}

export default function ItineraryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCityParam = searchParams.get("city") || "";
  const [cityParam, setCityParam] = useState<string>(initialCityParam);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [autocompleteValue, setAutocompleteValue] = useState<GooglePlaceOption | null>(
    initialCityParam
      ? {
          label: initialCityParam,
          value: { description: initialCityParam },
        }
      : null
  );

  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="max-w-screen px-5 md:px-8 lg:px-12 xl:px-16">
        {/* <ListCategory /> */}

        <ItineraryList searchParams={cityParam} typeParams={"explore-itinerary"} />
    </div>
  );
}
