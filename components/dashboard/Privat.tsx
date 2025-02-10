"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearchLocation } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import CardUserTripItem from "@/components/myexperience-trip/CardUserTripItem";
import LoadingAnimationBlack from "../LoadingAnimationBlack";
import { MdOutlineLocationOff } from "react-icons/md";

function Privat() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // State untuk indikator loading

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    setLoading(true); // Set loading menjadi true sebelum mulai fetch
    const userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      const user = JSON.parse(userLocalStorage);
      const q = query(
        collection(db, "Trips"),
        where("userId", "==", `${user?.id}`), // Kondisi userEmail
        where("tripData.public", "==", false), // Kondisi public
        where("tripData.publish", "==", false) // Kondisi publish
      );
      const querySnapshot = await getDocs(q);

      const trips: any[] = [];
      querySnapshot.forEach((doc) => {
        trips.push(doc.data());
      });

      setUserTrips(trips);
      setLoading(false); // Set loading menjadi false setelah fetch selesai
    } else {
      // router.push("/");
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
    <div className="w-full flex flex-col gap-4  py-4 md:px-4 w-full">
      {/* SearchBar */}
      <div className="w-full md:w-96 h-10 flex flex-row justify-start items-center border-2 border-gray-500 rounded-lg gap-2 px-3">
        <FaSearchLocation className="text-xl text-gray-500" />
        <input
          className="w-full h-full px-2 outline-none"
          type="text"
          placeholder="Cari kota, judul, atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* End SearchBar */}

      {/* Main Content */}
      {loading ? ( // Gantikan seluruh grid dengan animasi loading
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <LoadingAnimationBlack />
          <h2>Loading...</h2>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 mt-2 w-full">
          {filteredItineraries.length > 0 ? (
            filteredItineraries.map((trip: any, index: any) => (
              <div key={index}>
                <CardUserTripItem trip={trip} />
              </div>
            ))
          ) : (
            <div className="w-full">
              <div className="flex flex-col md:hidden justify-center items-center w-full  gap-3 mt-10">
                <MdOutlineLocationOff className="text-4xl " />
                <h2 className="text-center text-gray-500">
                  Tidak ada hasil yang ditemukan
                </h2>
                <div className="text-xs text-gray-400 ">
                  buat trip terlebih dahulu
                </div>
              </div>
              <div className="flex-row hidden md:flex justify-center items-center w-96  gap-2">
                <div>
                  <MdOutlineLocationOff className="text-3xl  md:text-4xl" />
                </div>
                <div>
                  <h2 className=" text-gray-500">
                    Tidak ada hasil yang ditemukan....
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* End Main Content */}
    </div>
  );
}

export default Privat;
