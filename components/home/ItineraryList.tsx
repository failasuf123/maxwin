"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";
import LoadingAnimationBlack from "../LoadingAnimationBlack";
import ListCategory from "../explore/ListCategory";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  searchParams: string;
  typeParams: string;
}

// =======================|
// NOTE: Type of Params:  |
// - "explore-itinerary"  |
// - "dashboard"          |
// =======================|

function ItineraryList({ searchParams, typeParams }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [isLoadingNavigate, setIsLoadingNavigate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setSearchTerm(searchParams);
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    setLoading(true);
    try {
      const userLocalStorage = localStorage.getItem("user");

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
      setLoading(false); // Set loading menjadi false setelah fetch selesai
    }
  };

  const filteredItineraries = userTrips.filter((itinerary) =>
  (itinerary.tripData.title?.toLowerCase() || "").includes(
    searchTerm?.toLowerCase() || ""
  ) ||
  (itinerary.tripData.city?.toLowerCase() || "").includes(
    searchTerm?.toLowerCase() || ""
  )
);


  return (
    <div className="mt-10  md:mx-20">
      {isLoadingNavigate && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div className="font-semibold text-lg md:text-xl text-black">
            Memuat...
          </div>
        </div>
      )}
      {/* Input pencarian */}
      <div className="mb-3 flex flex-col gap-2">
        <div className="text-black text-lg md:text-2xl font-bold">
          Pengalaman Wisata Orang Lain
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="w-full md:w-96 h-10 flex flex-row justify-start items-center border-2 border-gray-500 rounded-lg gap-2 px-3 ">
            <FaSearchLocation className="text-xl text-gray-500" />
            <input
              className="w-full h-full px-2 outline-none"
              type="text"
              placeholder="Cari kota atau judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <button
            className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-cyan-600 flex items-center gap-2"
            onClick={() => setShowCategories(!showCategories)}
          >
            {showCategories ? (
              <>
                <IoMdEyeOff className="text-lg" />
                <span>Kategori</span>
              </>
            ) : (
              <>
                <IoMdEye className="text-lg" />
                <span>Kategori</span>
              </>
            )}
          </button> */}
        </div>
      </div>

      {/* <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ListCategory />
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-14 md:mt-20 gap-4">
          <LoadingAnimationBlack />
          <p className="text-center text-gray-500">Memuat...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2  md:gap-3 xl:gap-5 2xl:gap-8 mt-2">
          {filteredItineraries.length > 0 ? (
            filteredItineraries.map((itinerary: any, index: number) => (
              <Link
                key={itinerary?.id || index} // Gunakan id dari itinerary atau index sebagai fallback
                href={`/view-experience/${itinerary?.id}`}
                onClick={() => setIsLoadingNavigate(true)}
              >
                <div className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group">
                  <div className="relative h-3/5 w-full justify-evently">
                    <img
                      src={itinerary.tripData.imageCover || "/placeholder.webp"}
                      className="h-full w-full object-cover rounded-lg"
                      alt={itinerary.tripData.title}
                    />
                    <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
                      {itinerary.tripData.city
                        .split(",")[0] // Ambil bagian pertama sebelum koma
                        .split(" ") // Pisahkan menjadi kata-kata
                        .slice(0, 10) // Ambil maksimal 10 kata
                        .join(" ") +
                        (itinerary.tripData.city.split(",")[0].split(" ")
                          .length > 10
                          ? "..."
                          : "")}
                    </div>

                    <div className="absolute bottom-2 left-2">
                      <img
                        src={itinerary?.userPicture || "/placeholder.webp"}
                        className="h-7 w-7 rounded-lg  md:hidden group-hover:rounded-sm"
                        alt={itinerary.tripData.username}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-2 overflow-hidden text-sm text-gray-500">
                    <div className="flex flex-row justify-between items-center gap-2">
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
                            Rp.{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(itinerary.tripData.totalPrice).replace(",00", "")}
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
