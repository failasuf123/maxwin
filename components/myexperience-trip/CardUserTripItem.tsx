import React, { useEffect, useState } from "react";
import { GetPlacesDetails, PHOTO_REF_URL } from "@/app/service/GlobalApi";
import Link from "next/link";

interface UserTripCreated {
  id: string;
  userPicture: string;
  tripData: {
    title: string;
    city: string;
    dateStart: string;
    dateEnd: string;
    category: string;
    description: string;
    totalDays: number;
    totalPrice: number;
    imageCover: string;
    username: string;
    todos: {
      [date: string]: Array<{
        name: string; // Nama tempat wisata
        type: string; // Jenis aktivitas, contoh: "wisata"
        description: string; // Deskripsi aktivitas
        cost: number; // Biaya aktivitas
        image: string; // Gambar aktivitas
        imageList: string[]; // Daftar gambar tambahan
        tag: string[]; // Tag terkait aktivitas
        timeStart: string; // Waktu mulai
        timeEnd: string; // Waktu selesai
      }>;
    };
  };
}
function CardUserTripItem({ trip }: { trip: UserTripCreated }) {
  return (
    <Link href={`/create-itinerary/edit/${trip?.id}`}>
      <div className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group">
        <div className="relative h-3/5 w-full">
          <img
            src={trip?.tripData?.imageCover || "/placeholder.webp"}
            className="h-full w-full object-cover rounded-lg"
            alt="Gambar"
          />
          <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
            {/* {trip?.tripData?.city} */}
            {trip?.tripData?.city.split(",")[0]}
          </div>
        </div>

        <div className="flex flex-col items-center p-2 overflow-hidden text-ellipsis text-sm md:text-sm text-gray-500 w-96">
          <div className="flex flex-row items-center gap-3 md:gap-2">

            <div className="flex flex-col gap-0.5 leading-tight w-96 ">
              <h2 className="text-gray-700 font-semibold w-full text-ellipsis overflow-hidden line-clamp-2">
                {trip?.tripData.title}
              </h2>
              <div className="flex flex-row gap-1 text-xs font-light">
                <span>Oleh: {trip?.tripData.username}</span>
              </div>
              <div className="flex flex-row gap-1 text-xs font-normal">
                <span>{trip?.tripData.totalDays}</span>
                <span>|</span>
                <span>{trip?.tripData.category}</span>
                <span>|</span>
                <span className="text-green-600 font-normal">
                  Rp.{trip?.tripData.totalPrice}
                </span>
              </div>
              <div className="flex items-center text-xs font-light">
                {/* {trip?.tripData.highlights} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardUserTripItem;
