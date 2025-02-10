"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/app/service/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";
import HeaderUpper from "@/components/my-trip/HeaderUpper";
import ContentItinerary from "@/components/myexperience-trip/ContentItinerary";
import FooterButton from "@/components/myexperience-trip/FooterButton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";

interface TripData {
  title: string;
  description: string;
  [key: string]: any;
}

interface PageProps {
  params: Promise<{
    tripid: string;
  }>;
}
const Page: React.FC<PageProps> = ({ params }) => {
  // const { tripid } = params;
  const { tripid } = React.use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (tripid) {
      getTripData();
    }
  }, [tripid]);

  const getTripData = async () => {
    setIsLoading(true); // Tampilkan spinner
  
    try {
      const docRef = doc(db, "Trips", tripid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
  
        // Ambil userId dari trip
        const userId = data.userId;
  
        // Ambil user dari localStorage & parse JSON
        const userString = localStorage.getItem("user");
        let user = null;
  
        try {
          user = userString ? JSON.parse(userString) : null;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
  
        // Cek otorisasi
        if (!user || !user.id) {
          router.push("/");
          toast({
            title: "Akses Ditolak",
            description: "Anda harus login terlebih dahulu.",
          });
          return;
        }
  
        if (user.id !== userId) {
          router.push("/");
          toast({
            title: "Akses Ditolak",
            description: "Anda tidak memiliki akses ke perjalanan ini.",
          });
          return;
        }
  
        let userData: { username: string; userPicture: string } = {
          username: "anonim",
          userPicture: "/default-picture.png",
        };
  
        if (userId) {
          // Query ke Users untuk mendapatkan username & userPicture
          const userRef = doc(db, "Users", userId);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const userDoc = userSnap.data() as { username?: string; userPicture?: string };
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
};

export default Page;
