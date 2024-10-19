'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, query, where, getDocs} from "firebase/firestore"; 
import { db } from '../service/firebaseConfig';
import CardUserTripItem from '@/components/mytrip/CardUserTripItem';

function page() {
  const router = useRouter();
  const [userTrips, setUserTrips] = useState<any[]>([]);
  
  useEffect(()=>{
    GetUserTrips();
  },[])
  
  const GetUserTrips=async()=> {
    const userLocalStorage = localStorage.getItem('user');
    console.log(userLocalStorage)
    
    if(userLocalStorage != null){
      setUserTrips([])
      const user = JSON.parse(userLocalStorage);
      const q = query(collection(db, 'AiTrips'),where('userEmail','==', `${user?.email}`))
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc:any) => {   
        setUserTrips(prevVal=>[...prevVal, doc.data()])
        console.log(doc.id,"=>", doc.data())
      });
    }else{
      router.push("/")
    }
  }
  return (
    <div className="p-10 md:px-20 lg:px-36">
      <h2 className="text-xl font-semibold mb-10">Daftar Trip oleh AI</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {userTrips.map((trip, index) => (
          <div>
            <CardUserTripItem trip={trip} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default page
