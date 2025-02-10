'use client'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import React, { useEffect, useState } from 'react'


interface TripData {
  [key: string]: any;
}

function HeaderUpper({ trip }: { trip: TripData | null }) {

  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
  useEffect(() => {
    // trip&&GetPlacePhoto();
    trip;
  },[trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.city,
    };
    try {
      const response = await GetPlacesDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',response.data.places[0].photos[3].name)
      setPhotoUrl(PhotoUrl)
    } catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div >
      <div>
        <img 
          src={trip?.tripData?.imageCover? trip.tripData.imageCover: '/placeholder.png'} 
          className="h-[340px] w-full object-cover rounded" 
        />
          <h2 className="font-bold text-2xl md:text-3xl mt-3">{trip?.tripData?.title}</h2>
          <p className="text-base text-gray-400 mt-2">- dibuat oleh: {trip?.username} -</p>
        <div className="flex flex-row flex-wrap gap-2 mt-3">
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">💰 {trip?.tripData?.totalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h2>
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🗓️ {trip?.tripData?.totalDays} Hari</h2>
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🏝️ Kategori {trip?.tripData?.category}</h2>
        </div>
        <div className="flex flex-col mt-3">
          <h2 className="font-semibold text-lg md:text-xl mt-3 text-gray-700">🏙️ Kota {trip?.tripData?.city[0]}</h2>
          <div className="bg-gray-100 px-3 py-2 md:px-5 rounded-2xl mt-3 ">
            <p>{trip?.tripData?.description}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HeaderUpper;
