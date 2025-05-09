"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";
import LoadingAnimationBlack from "../LoadingAnimationBlack";

// Definisikan tipe data Trip
type Trip = {
  id: string;
  userId: string;
  category: string;
  city: string;
  totalDays: number;
  imageCover: string;
  title: string;
  username: string; // Tambahkan properti username
  userPicture: string; // Tambahkan properti userPicture
  totalPrice?: number; // Opsional, jika diperlukan
};

function ItineraryListHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTrips, setUserTrips] = useState<Trip[]>([]); // Gunakan tipe Trip[]
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNavigate, setIsLoadingNavigate] = useState(false);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "Trips"),
        where("tripData.public", "==", true),
        where("tripData.publish", "==", true),
        limit(4) // Ambil hanya 8 data dari Firestore
      );
      const querySnapshot = await getDocs(q);

      const trips: Trip[] = []; // Gunakan tipe Trip[]
      for (const doc of querySnapshot.docs) {
        const tripData = doc.data();

        // Ambil hanya field yang diperlukan dari tripData
        const requiredData: Trip = {
          id: doc.id, // Ambil ID dokumen untuk routing
          userId: tripData.userId,
          category: tripData.tripData.category,
          city: tripData.tripData.city[0],
          totalDays: tripData.tripData.totalDays,
          imageCover: tripData.tripData.imageCover,
          title: tripData.tripData.title,
          username: "anonim", // Default value
          userPicture: "/default-picture.png", // Default value
          totalPrice: tripData.tripData.totalPrice, // Opsional, jika diperlukan
        };

        // Ambil data user dari koleksi Users
        if (requiredData.userId) {
          const userRef = collection(db, "Users");
          const userQuery = query(userRef, where("userId", "==", requiredData.userId));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            requiredData.username = userData.username; // Ambil username
            requiredData.userPicture = userData.userPicture; // Ambil userPicture
          }
        }

        trips.push(requiredData); // Simpan data yang sudah difilter
      }

      setUserTrips(trips); // Set state dengan data yang diperlukan
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItineraries = userTrips.filter(
    (itinerary) =>
      itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkClick = () => {
    setIsLoading(true); // Activate loading
  };

  const formatRupiah = (value: number | string): string => {
    const numberValue = Math.floor(Number(value)); // Hapus desimal tanpa pembulatan ke atas
    if (isNaN(numberValue)) {
      return "Rp 0"; // Tampilkan Rp 0 jika bukan angka
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  // Fungsi untuk menentukan jumlah data yang ditampilkan berdasarkan ukuran layar
  const getDisplayCount = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 4; // sm: 4 gambar
      if (width < 768) return 6; // md: 6 gambar
      if (width < 1024) return 4; // lg: 4 gambar
      return 8; // xl dan lebih besar: 8 gambar
    }
    return 8; // Default
  };

  const displayCount = getDisplayCount();
  const displayedItineraries = filteredItineraries.slice(0, displayCount); // Potong data yang ditampilkan
  return (
    <div className="mt-10 md:mx-12 xl:mx-20">
      {isLoading && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div>Memuat Halaman...</div>
        </div>
      )}

      {isLoadingNavigate && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div className="font-semibold text-lg md:text-xl text-black">
            Memuat...
          </div>
        </div>
      )}
      {/* Itinerary List */}
      <div className="flex items-center justify-between mb-1 ">
        <h2 className="text-2xl md:text-3xl font-bold">Inspirasi Liburan</h2>
        <a
          href="/explore/itinerary"
          className="text-white font-semibold bg-cyan-500 px-3 py-2 rounded-xl hover:bg-black "
          onClick={handleLinkClick}
        >
          Selengkapnya &rarr;
        </a>
      </div>
      <p className="text-gray-600 text-lg md:text-xl mb-5">
        Jelajahi Pengalaman Perjalanan Orang Lain
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
        {loading ? (
          <>
            <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[200px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
          </>
        ) : (
          <>
            {displayedItineraries.length > 0 ? (
              displayedItineraries.map((itinerary, index) => (
                <Link
                  key={itinerary.id || index}
                  href={`/view-experience/${itinerary.id}`}
                  onClick={() => setIsLoadingNavigate(true)}
                >
                  <div
                    className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group"
                  >
                    <div className="relative h-3/5 w-full">
                      <img
                        src={itinerary.imageCover || "/placeholder.webp"}
                        className="h-full w-full object-cover rounded-lg"
                        alt={itinerary.title}
                      />
                      <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
                        {itinerary.city
                          .split(",")[0]
                          .split(" ")
                          .slice(0, 10)
                          .join(" ") +
                          (itinerary.city.split(",")[0].split(" ").length > 10
                            ? "..."
                            : "")}
                      </div>

                      <div className="absolute bottom-2 left-2 px-0.5 py-0.5 bg-white rounded-lg bg-opacity-40 group-hover:bg-opacity-80 ">
                        <img
                          src={itinerary.userPicture || "/default-picture.png"}
                          className="h-7 w-7 md:w-8 md:h-8 rounded-lg"
                          alt={itinerary.username}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-start p-2 overflow-hidden text-sm text-gray-500">
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col gap-0.5 leading-tight">
                          <h2 className="text-gray-700 font-semibold w-full text-ellipsis overflow-hidden line-clamp-2 text-xs md:text-base">
                            {itinerary.title}
                          </h2>
                          <div className="text-[9px] md:text-xs font-light overflow-hidden line-clamp-1">
                            Oleh: {itinerary.username}
                          </div>
                          <div className="flex flex-row gap-1 text-[9px] md:text-xs font-normal overflow-hidden line-clamp-1">
                            <span>{itinerary.totalDays} hari</span>
                            <span>|</span>
                            <span>{itinerary.category}</span>
                            <span>|</span>
                            <span className="text-green-600 font-normal">
                              {formatRupiah(itinerary.totalPrice || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div>
                <p className="text-gray-500">Tidak ada hasil yang ditemukan</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ItineraryListHome;