"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import { getUserId } from "@/app/itinerary/[id]/_service/getUser";
import TripCard from "./_components/TripCard";
import TripFilter from "./_components/TripFilter";
import { Itinerary } from "@/app/itinerary/[id]/_utils/typings";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";

export default function TripPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);
  const [isPublicTab, setIsPublicTab] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const router = useRouter();

  // Dapatkan ID user dari localStorage
  const userId = getUserId();

  // Ambil data itinerary dari Firestore
  useEffect(() => {
    const fetchItineraries = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const q = query(collection(db, "Itinerary"), where("userOwner", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const data: Itinerary[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id } as Itinerary);
        });
        
        setItineraries(data);
        setFilteredItineraries(data.filter(item => !item.isPublic));
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [userId]);

  // Filter data berdasarkan tab, pencarian, dan kota
  useEffect(() => {
    let result = itineraries.filter(item => 
      item.isPublic === isPublicTab
    );

    // Filter berdasarkan pencarian
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )}

    // Filter berdasarkan kota
    if (selectedCity !== "all") {
      result = result.filter(item => 
        item.Cities?.some(city => 
          city.cityName.toLowerCase().includes(selectedCity.toLowerCase())
        )
      );
    }

    setFilteredItineraries(result);
  }, [itineraries, isPublicTab, searchQuery, selectedCity]);

  // Handle perubahan tab
  const handleTabChange = (isPublic: boolean) => {
    setIsPublicTab(isPublic);
    setSearchQuery("");
    setSelectedCity("all");
  };

  // Handle share itinerary
  const handleShare = async (id: string) => {
    try {
      await updateDoc(doc(db, "Itinerary", id), { isPublic: true });
      setItineraries(prev => 
        prev.map(item => item.id === id ? { ...item, isPublic: true } : item)
      );
    } catch (error) {
      console.error("Error sharing itinerary:", error);
    }
  };

  // Handle make private
  const handleMakePrivate = async (id: string) => {
    try {
      await updateDoc(doc(db, "Itinerary", id), { isPublic: false });
      setItineraries(prev => 
        prev.map(item => item.id === id ? { ...item, isPublic: false } : item)
      );
    } catch (error) {
      console.error("Error making itinerary private:", error);
    }
  };

  // Handle delete itinerary
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus itinerary ini? Semua data akan hilang secara permanen.")) {
      try {
        await deleteDoc(doc(db, "Itinerary", id));
        setItineraries(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting itinerary:", error);
      }
    }
  };

  // Dapatkan daftar kota unik untuk filter
  const getUniqueCities = () => {
    const cities = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.Cities?.forEach(city => {
        cities.add(city.cityName);
      });
    });
    return Array.from(cities).sort();
  };

  const newTrip = () => {
      const id = uuidv4();
      router.push(`/itinerary/${id}?type=create`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div> */}
        <LoadingAnimationBlack/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <button
            onClick={() => newTrip()}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> New Trip
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              !isPublicTab 
                ? "text-gray-800 border-b-2 border-gray-800" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange(false)}
          >
            Private Trips
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              isPublicTab 
                ? "text-gray-800 border-b-2 border-gray-800" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange(true)}
          >
            Shared Trips
          </button>
        </div>

        {/* Filter Section */}
        <TripFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={getUniqueCities()}
        />

        {/* Trip List */}
        {filteredItineraries.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900">No trips found</h3>
            <p className="mt-1 text-gray-500">
              {isPublicTab
                ? "You haven't shared any trips yet."
                : "Create your first trip to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItineraries.map((itinerary) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TripCard
                    itinerary={itinerary}
                    onShare={() => handleShare(itinerary.id!)}
                    onMakePrivate={() => handleMakePrivate(itinerary.id!)}
                    onDelete={() => handleDelete(itinerary.id!)}
                    isPublicTab={isPublicTab}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}