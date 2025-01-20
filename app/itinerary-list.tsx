"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import NavBar from "@/components/navbar/NavBar";
import ItineraryList from "@/components/home/ItineraryList";

export default function ItineraryListPage() {
  const router = useRouter();
  const { city } = router.query; // /itinerary-list?city=<ExactCityName>
  
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrips = async () => {
      // Only run if city is set in the URL
      if (!city) return;
      setLoading(true);

      try {
        // EXACT match for tripData.city:
        const cityValue = city as string;
        const q = query(
          collection(db, "Trips"),
          where("public", "==", true),
          where("publish", "==", true),
          where("tripData.city", "==", cityValue) // exact match
        );
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
  }, [city]);

  return (
    <>
      <NavBar />
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">
          Hasil Pencarian: {city || ""}
        </h1>

        <ItineraryList itineraries={itineraries} loading={loading} />
      </div>
    </>
  );
}
