import React, { useEffect, useState } from 'react'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import Link from 'next/link'

interface HotelOption {
    description: string;
    geoCoordinates: string;
    hotelAddress: string;
    hotelImageUrl: string;
    hotelName: string;
    price: string;
    rating: number;
  }

  function HotelCardItem({ item }: { item: HotelOption }) {
      
    const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
    useEffect(() => {
      item&&GetPlacePhoto();
    },[item])
  
    const GetPlacePhoto = async () => {
      const data = {
        textQuery: item?.hotelName,
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
          <Link href={"https://www.google.com/maps/search/?api=1&query="+item.hotelAddress} target="_blank">
              <div key={item.hotelName} className=" hover:scale-105 transition-all">
                  <img src={photoUrl} className="rounded-lg"/>            
                  <div className="my-2 flex flex-col gap-1 px-1">
                      <h3 className="font-medium text-xl">{item.hotelName}</h3>
                      <p className="text-xs text-gray-500">📍 {item.hotelAddress}</p>
                      <p className="text-gray-800 font-medium text-sm">{item.price}</p>
                      <p className="text-yellow-500">{'⭐'.repeat(item.rating)}</p>
                  </div>
              </div>
          </Link>
      </div>
    )
  }
  
export default HotelCardItem
