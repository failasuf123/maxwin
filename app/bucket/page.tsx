"use client";
import React, { useState, useEffect } from "react";
import { getUserId } from "@/app/itinerary/[id]/_service/getUser";
import { collection, getDocs,getDoc, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig";
import PayableList from "./_components/PayableList";



export default function Bucket() {
  const [isItineraryPage, setIsItineraryPage] = useState(false);
  const [payableData, setPayableData] = useState<any[]>([]);

  const handleTabChange = (isPublic: boolean) => {
    setIsItineraryPage(isPublic);
  };

  const userId = getUserId();


  useEffect(() => {
    if (!userId) return;
  
    const fetchPayables = async () => {
      try {
        const colRef = collection(db, "Bucket", userId, "Payable");
        const snap = await getDocs(colRef);
  
        // Flatten data: merge id + fields dari .data() ke level terluar
        const arr = snap.docs.map(d => {
          const docData = d.data();
          return {
            id: d.id,
            itineraryId: docData.itineraryId,
            title: docData.title,
            lastUpdate: docData.lastUpdate,     // Timestamp Firestore
            data: docData.data,
            // ... kalau ada field lain, tambahkan di sini
          };
        });
  
        console.log("Mapped Payables:", arr);
        setPayableData(arr);
      } catch (err) {
        console.error("Error fetching Payables:", err);
      }
    };
  
    fetchPayables();
  }, [userId]);
  

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const colRef = collection(db, "Bucket", userId, "Payable");
      const snap = await getDocs(colRef);
      console.log(">> sub‑collection Payable docs:", 
        snap.docs.map(d => ({ id: d.id, data: d.data() }))
      );
    })();
  }, [userId]);
  

  useEffect(() => {
      console.log("%% PAYABLE DATA")
      console.log(payableData)
  })


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>

        </div>

        {/* Tab */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange(false)}
            className={`py-2 px-4 font-medium ${
              !isItineraryPage ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pemesanan
          </button>
          <button
            onClick={() => handleTabChange(true)}
            className={`py-2 px-4 font-medium ${
              isItineraryPage ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bucket List 
          </button>
        </div>

        {/* Tampilan berdasarkan tab */}
        <div className="text-center text-xl font-semibold text-gray-800">
          {isItineraryPage ? "Ini Bucket Lisst" : <PayableList data={payableData} />}
        </div>
      </div>
    </div>
  );
}
