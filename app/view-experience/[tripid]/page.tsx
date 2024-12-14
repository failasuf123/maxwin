'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@/app/service/firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderUpper from '@/components/myexperience-trip/HeaderUpper';
import ContentItinerary from '@/components/myexperience-trip/ContentItinerary';

interface TripData {
  title: string;
  description: string;
  [key: string]: any;
}

interface PageProps {
  params: {
    tripid: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { tripid } = params; 
  const [trip, setTrip] = useState<TripData | null>(null);
  
  useEffect(() => {
    if (tripid) {
      getTripData();
    }
  }, [tripid]);
  
  const getTripData = async () => {
    const docRef = doc(db, 'ShareTrips', tripid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const tripData: TripData = {
        title: data.title || '',
        description: data.description || '',
        ...data,
      };
      setTrip(tripData);
    } else {
      console.error("No Document");
      toast.error('Upss! Trip tidak ditemukan', {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="p-10 md:px-28">
      <HeaderUpper trip={trip} />
      {/* {trip ? <ContentItinerary trip={trip} /> : <p>Loading or no data available</p>} */}
      <ContentItinerary trip={trip as any} />


      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Page;
