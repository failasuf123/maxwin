
"use client"
// import React, { useEffect, useState } from "react";
import React, { Suspense } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import ItineraryList from "@/components/home/ItineraryList";
import { db } from "@/app/service/firebaseConfig";
import { useSearchParams } from "next/navigation";  // Import useSearchParams



export default function ItineraryListPage() {
  // const [cityParam, setCityParam] = useState<string>("");
  const searchParams = useSearchParams();  // Mengambil query params
  const cityFromURL = searchParams.get("city") || "";  // Ambil dari URL atau fallback ke initialCityParam


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-screen px-5 md:px-8 lg:px-12 xl:px-16">
        <ItineraryList searchParams={cityFromURL} typeParams={"explore-itinerary"} />
      </div>
    </Suspense>
  );
}
