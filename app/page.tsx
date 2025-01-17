import React from "react";
import Banner from "@/components/home/Banner";
import ItineraryList from "@/components/home/ItineraryList"; 
import HotelList from "@/components/home/HotelList";
import ActivityList from "@/components/home/ActivityList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      {/* <div className="flex flex-col items-center py-3 md:py-8 px-5"> */}
      <div className="w-full max-w-6xl mx-auto">
        <Banner />

        <div className="mt-10">
          <ItineraryList />
        </div>

        {/* Section 2: CariHotel */}
        <div className="mt-10">
          <HotelList />
        </div>

        {/* Section 3: CariAktivitas */}
        <div className="mt-10">
          <ActivityList />
        </div>
        
      </div>
    </main>
  );
}
