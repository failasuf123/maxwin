"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";

function ItineraryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "Trips"),
        where("public", "==", true),
        where("publish", "==", true)
      );
      const querySnapshot = await getDocs(q);

      const trips: any[] = [];
      querySnapshot.forEach((doc) => trips.push(doc.data()));
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItineraries = userTrips.filter(
    (itinerary) =>
      itinerary.tripData.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      itinerary.tripData.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      itinerary.tripData.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-10 md:mx-20">

      {/* Judul / subjudul bisa disesuaikan. Desain card tetap sama */}
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-black text-lg md:text-2xl font-bold">
          Pengalaman Wisata Orang Lain
        </h2>
        <div className="w-full md:w-96 h-10 flex flex-row justify-start items-center border-2 border-gray-500 rounded-lg gap-2 px-3 ">
          <FaSearchLocation className="text-xl text-gray-500" />
          <input
            className="w-full h-full px-2 outline-none"
            type="text"
            placeholder="Cari kota, judul, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
          {filteredItineraries.length > 0 ? (
            filteredItineraries.map((itinerary: any, index: number) => (
              <Link href={`/create-itinerary/edit/${itinerary?.id}`} key={index}>
                <div className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group">
                  <div className="relative h-3/5 w-full">
                    <img
                      src={itinerary.tripData.imageCover || "/placeholder.webp"}
                      className="h-full w-full object-cover rounded-lg"
                      alt={itinerary.tripData.title}
                    />
                    <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
                      {itinerary.tripData.city}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-2 overflow-hidden text-sm text-gray-500">
                    <div className="flex flex-row items-center gap-2">
                      <img
                        src={itinerary?.userPicture || "/placeholder.webp"}
                        className="h-9 w-9 rounded-full hidden md:block"
                        alt={itinerary.tripData.username}
                      />
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <h2 className="text-gray-700 font-semibold w-full text-ellipsis overflow-hidden line-clamp-2">
                          {itinerary.tripData.title}
                        </h2>
                        <div className="text-xs font-light">
                          Oleh: {itinerary.tripData.username}
                        </div>
                        <div className="flex flex-row gap-1 text-xs font-normal">
                          <span>{itinerary.tripData.totalDays} hari</span>
                          <span>|</span>
                          <span>{itinerary.tripData.category}</span>
                          <span>|</span>
                          <span className="text-green-600 font-normal">
                            Rp.{itinerary.tripData.totalPrice}
                          </span>
                        </div>
                        <div className="text-xs font-light">
                          {itinerary.tripData.highlights}
                        </div>
                      </div>
                    </div>
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

export default ItineraryList;
