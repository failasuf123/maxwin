'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@/app/service/firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';
import { ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfoSection from '@/components/view-trip/InfoSection';
import Hotels from '@/components/view-trip/Hotels';
import PlaceToVisit from '@/components/view-trip/PlaceToVisit';

interface PageProps {
  params: {
    tripid: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { tripid } = params; 
  const [trip, setTrip] = useState<{ [key: string]: any } | null>(null);

  
  useEffect(()=>{
    tripid&&getTripData();
  },[tripid])
  
  const getTripData = async() => {
    const docRef = doc(db,'AiTrips',tripid)
    const docSnap= await getDoc(docRef)

    if(docSnap.exists()){
        console.log("Document:", docSnap.data() )
        setTrip(docSnap.data())
    }else{
        console.log("No Document")
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
        })
    }}

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlaceToVisit trip={trip} />

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
