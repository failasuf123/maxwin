"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/app/service/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";
import HeaderUpper from "@/components/myexperience-trip/HeaderUpper";
import ContentItinerary from "@/components/myexperience-trip/ContentItinerary";
import FooterButton from "@/components/myexperience-trip/FooterButton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
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
  const { tripid } = React.use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const { toast } = useToast();

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
        const tripData: TripData = {
          title: data.title || "",
          description: data.description || "",
          ...data,
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
    <div className="p-10 md:px-28 lg:px-36 xl:px-52 relative">
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
      <FooterButton id={tripid} trip={trip} />
      {!isLoading && <ContentItinerary trip={trip as any} />}
    </div>
  );
};

export default Page;
