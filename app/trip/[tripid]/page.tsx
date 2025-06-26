"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/app/service/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import HeaderUpper from "./_components/HeaderUpper";
import ContentItinerary from "./_components/ContentItinerary";

interface TripData {
  title: string;
  description: string;
  [key: string]: any;
}

function page() {
  const params = useParams();
  const id = params.tripid as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trip, setTrip] = useState<TripData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      getTripData();
    }
  }, [id]);

  const getTripData = async () => {
    setIsLoading(true); // Tampilkan spinner

    try {
      const docRef = doc(db, "Itinerary", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Ambil userId dari trip
        const userId = data.userOwner;

        let userData: { username: string; userPicture: string } = {
          username: "anonim",
          userPicture: "/default-picture.png",
        };

        if (userId) {
          // Query ke Users untuk mendapatkan usern  ame & userPicture
          const userRef = doc(db, "Users", userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userDoc = userSnap.data() as {
              username?: string;
              userPicture?: string;
            };
            userData = {
              username: userDoc.username ?? "anonim",
              userPicture: userDoc.userPicture ?? "/default-picture.png",
            };
          }
        }

        // Gabungkan hasil trip dengan data user
        const tripData: TripData = {
          title: data.title || "Tanpa Judul",
          description: data.description || "",
          ...data,
          username: userData.username,
          userPicture: userData.userPicture,
        };
        console.log(tripData)
        setTrip(tripData);
      } else {
        console.error("No Document");
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast({
        title: "Upss",
        description: "Rencana Perjalanan Ini Tidak Ditemukan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 pt-10 md:p-10 md:px-28 lg:px-36 xl:px-52 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="flex items-center space-x-2 text-lg">
            <div>
              <LoadingAnimationBlack />
            </div>
          </div>
        </div>
      )}
            <HeaderUpper trip={trip} />
            {!isLoading && <ContentItinerary trip={trip as any} />}


    </div>
  );
}

export default page;
