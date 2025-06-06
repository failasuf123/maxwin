"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  MdHome,
  MdDirectionsBus,
  MdPlace,
  MdCalendarToday,
  MdHotel,
  MdComment,
  MdMenu,
  MdClose,
} from "react-icons/md";
import CityInformation from "./_components/CityInformation";
import Activity from "./_components/Activity";
import Itinerary from "./_components/Itinerary";
import Hotel from "./_components/Hotel";
import Comment from "./_components/Comment";
import { DataType } from "./_utils/typings";
import { AI_PROMPT_CITY } from "@/app/constants/option";
import PageNotFound from "@/components/PageNotFound";
import { chatSession } from "../service/AIModel";
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";

const FloatingNavbar = () => {
  const [activeSection, setActiveSection] = useState("city-info");
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "city-info",
        "activities",
        "itinerary",
        "hotels",
        "comments",
      ];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { id: "city-info", icon: <MdHome size={20} />, label: "Info Kota" },
    { id: "activities", icon: <MdPlace size={20} />, label: "Aktivitas" },
    {
      id: "itinerary",
      icon: <MdCalendarToday size={20} />,
      label: "Itinerary",
    },
    { id: "hotels", icon: <MdHotel size={20} />, label: "Hotel" },
    { id: "comments", icon: <MdComment size={20} />, label: "Komentar" },
  ];

  return (
    <>
      {!isNavOpen && (
        <button
          className="fixed right-2 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsNavOpen(true)}
          aria-label="Open navigation"
        >
          <MdMenu size={24} />
        </button>
      )}

      {isNavOpen && (
        <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 opacity-90 md:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-1 py-3 flex flex-col items-center space-y-3 border border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`p-3 rounded-lg transition-all flex flex-col items-center ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                aria-label={item.label}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}

            {/* TOMBOL TUTUP (Di dalam Navbar, dengan styling berbeda) */}
            <button
              onClick={() => setIsNavOpen(false)}
              className="mt-3 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
              aria-label="Close navigation"
            >
              <MdClose className="inline mr-1" size={16} />
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const onGenerateCityInfo = async (city: string, cityId: number) => {
  if (city && cityId) {
    const FINAL_PROMPT = AI_PROMPT_CITY.replace("{city}", city);
    console.log("[AI] Generating city info with prompt:", FINAL_PROMPT);
    
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const data_result = result?.response.text();
    
    console.log("[Firestore] Saving generated data to CityExplore collection");
    await setDoc(doc(db, "CityExplore", cityId.toString()), {
      cityId: cityId,
      city: city,
      data: data_result,
      createdAt: new Date() // Tambahkan timestamp untuk tracking
    });

    return data_result;
  }
};

export default function Page() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const cityIdParam = searchParams.get("cityId");
  const cityId = cityIdParam ? Number(cityIdParam) : null;
  const [data, setData] = useState<DataType | undefined>();
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    const fetchData = async () => {
      if (city && cityId) {
        setIsLoading(true);
        
        // 1. Cek dulu di Firestore
        console.log(`[Firestore] Checking CityExplore for cityId: ${cityId}`);
        const docRef = doc(db, "CityExplore", cityId.toString());
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("[Firestore] Data found in CityExplore, using cached data");
          const firestoreData = docSnap.data();
          try {
            const parsedData: DataType = JSON.parse(firestoreData.data);
            setData(parsedData);
            setIsLoading(false);
            return;
          } catch (err) {
            console.error("[Firestore] Failed to parse cached data:", err);
            // Lanjut ke generate baru jika parsing gagal
          }
        } else {
          console.log("[Firestore] Data not found in CityExplore, generating new data");
        }
        
        // 2. Jika tidak ada di Firestore, generate baru
        console.log("[AI] Generating new city info");
        const data_ai = await onGenerateCityInfo(city, cityId);

        if (data_ai) {
          try {
            const parsedData: DataType = JSON.parse(data_ai);
            setData(parsedData);
          } catch (err) {
            console.error("[AI] Failed to parse AI data:", err);
          }
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city, cityId]);

  const isInvalid = !city || city.trim() === "" || !cityId;

  if (isInvalid) {
    return <PageNotFound />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingAnimationBlack />
      </div>
    );
  }

  return (
    <div className="relative">
      <FloatingNavbar />

      <div className="flex flex-col min-h-screen w-full max-w-6xl mx-auto px-4 md:pl-24">
        <section id="city-info" className="py-2">
          {data && <CityInformation city={city || ""} data={data} />}
        </section>

        <section id="activities" className="py-2">
          {data && <Activity data={data} />}
        </section>

        <section id="itinerary" className="py-2">
          <Itinerary city={city || ""} />
        </section>

        <section id="hotels" className="py-2">
          <Hotel city={city || ""} cityId={cityId || 17193} />
        </section>

        <section id="comments" className="py-2">
          <Comment />
        </section>
      </div>
    </div>
  );
}