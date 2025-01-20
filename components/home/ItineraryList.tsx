// components/home/ItineraryList.tsx
"use client";

import React from "react";
import Link from "next/link";

interface ItineraryListProps {
  itineraries: any[];
  loading: boolean;
}

export default function ItineraryList({ itineraries, loading }: ItineraryListProps) {
  return (
    <div className="mt-5">
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {itineraries?.length > 0 ? (
            itineraries.map((itinerary: any, index: number) => (
              <Link href={`/create-itinerary/edit/${itinerary?.id}`} key={index}>
                <div className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group">
                  {/* IMAGE */}
                  <div className="relative h-3/5 w-full">
                    <img
                      src={itinerary.tripData?.imageCover || "/placeholder.webp"}
                      className="h-full w-full object-cover rounded-lg"
                      alt={itinerary.tripData?.title}
                    />
                  </div>

                  {/* TEXT INFO */}
                  <div className="p-2 text-sm text-gray-500 flex flex-col items-start">
                    <h2 className="text-gray-800 font-semibold line-clamp-2">
                      {itinerary.tripData?.title}
                    </h2>

                    {/* AUTHOR */}
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={itinerary.userPicture || "/placeholder.webp"}
                        className="h-5 w-5 rounded-full"
                        alt={itinerary.tripData?.username}
                      />
                      <span className="text-xs text-gray-500">
                        Oleh: {itinerary.tripData?.username}
                      </span>
                    </div>

                    {/* META INFO */}
                    <div className="text-xs mt-1">
                      <span>{itinerary.tripData?.totalDays} hari</span>
                      <span className="mx-1">|</span>
                      <span>{itinerary.tripData?.category}</span>
                      <span className="mx-1">|</span>
                      <span className="text-green-600">
                        Rp.{itinerary.tripData?.totalPrice}
                      </span>
                    </div>

                    {/* Optional snippet: highlights or description */}
                    {itinerary.tripData?.highlights && (
                      <div className="mt-1 text-xs text-gray-400 line-clamp-1">
                        {itinerary.tripData.highlights}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada hasil yang ditemukan</p>
          )}
        </div>
      )}
    </div>
  );
}
