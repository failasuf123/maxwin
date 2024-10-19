import React, { useEffect, useState } from 'react'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import Link from 'next/link'

interface UserTrip {
    id:string;
    userSelection: {
      city: string;
      budget: string;
      days: number;
      travelwith: string;
    };
  }
  
  function CardUserTripItem({ trip }: { trip: UserTrip }) {
      
    const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
    useEffect(() => {
      trip&&GetPlacePhoto();
    },[trip])
  
    const GetPlacePhoto = async () => {
      const data = {
        textQuery: trip?.userSelection?.city,
      };
      console.log("data >>", data)
      try {
        const response = await GetPlacesDetails(data);
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',response.data.places[0].photos[3].name)
        setPhotoUrl(PhotoUrl)
    } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
    };
console.log("PhotoURL",photoUrl)

    return (
    <Link href={`view-trip/${trip?.id}`}>
      <div>
        <img
          src={photoUrl}
          className="h-44 w-full object-cover rounded-xl"
          alt={trip?.userSelection?.city || 'Image'}
          />
          <div className="mt-2">
          <h2 className="font-bold text-lg">{trip?.userSelection?.city}</h2>
          <h2 className="text-gray-500 text-xs">{trip?.userSelection?.days} days with {trip?.userSelection?.budget} budget</h2>
        </div>
      </div>
    </Link>
    );
  }
  
  export default CardUserTripItem;
  
