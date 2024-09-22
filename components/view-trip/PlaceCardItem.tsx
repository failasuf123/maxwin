import React, { useEffect, useState } from 'react'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import Link from 'next/link'

interface Place {
    geoCoordinates: string;
    placeDetails: string;
    placeImageUrl: string;
    placeName: string;
    rating: number;
    ticketPricing: string;
    timeTravel: string;
  }

  
function PlaceCardItem({ item, index }: { item: Place, index:number }) {
    const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
    useEffect(() => {
      item&&GetPlacePhoto();
    },[item])
  
    const GetPlacePhoto = async () => {
      const data = {
        textQuery: item?.placeName,
      };
      try {
        const response = await GetPlacesDetails(data);
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',response.data.places[0].photos[3].name)
        console.log(response)
        setPhotoUrl(PhotoUrl)
      } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    };
  return (
    <div>
        <div key={index} className="p-4 ">
            <p className="text-base font-semibold mt-1 text-cyan-600 mb-1 ml-1">{item.timeTravel}</p>
            <div className="border rounded-xl p-3  flex-row md:flex  gap-4 items-center">
                <div>
                    <img src={photoUrl} className="rounded-lg w-[130px] h-[130px]"/>    
                </div>
                <div >
                    <h2 className="text-md:text-lg font-semibold">{item.placeName}</h2>
                    <p className="text-xs text-gray-500 md:text-sm mt-1">{item.placeDetails}</p>
                    <p className="text-xs md:text-sm mt-1 font-semibold text-green-600">{item.ticketPricing} (estimasi)</p>
                </div>        
            </div>
        </div>
      
    </div>
  )
}

export default PlaceCardItem
