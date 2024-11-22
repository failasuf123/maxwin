'use client'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import React, { useEffect, useState } from 'react'


interface TripData {
  [key: string]: any;
}

function InfoSection({ trip }: { trip: TripData | null }) {

  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
  useEffect(() => {
    trip&&GetPlacePhoto();
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
    <div>
      <img src={photoUrl} alt="Trip Image"  className="h-[340px] w-full object-cover rounded"/>

        <h2 className="font-bold text-2xl md:text-3xl mt-3">{trip?.userSelection?.city}</h2>
      <div className="flex flex-row flex-wrap gap-2 mt-3">
        <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">💰 {trip?.userSelection?.budget} Budget</h2>
        <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🗓️ {trip?.userSelection?.days} Days</h2>
        <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🏝️ {trip?.userSelection?.travelWith}</h2>
      </div>

    </div>
  );
}

export default InfoSection;
