import React from "react";
import Banner from "@/components/home/Banner";
import ItineraryListHeader from "@/components/home/ItineraryListHeader";
import ItineraryList from "@/components/home/ItineraryList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="flex flex-col items-center py-3 md:py-8 px-5">
        <Banner />
        {/* <ItineraryListHeader /> */}
        <ItineraryList/>
      </div>
    </main>
  );
}
