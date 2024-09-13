import Link from 'next/link';
import React from 'react';

interface HotelOption {
  description: string;
  geoCoordinates: string;
  hotelAddress: string;
  hotelImageUrl: string;
  hotelName: string;
  price: string;
  rating: number;
}

interface TripData {
  tripData?: {
    hotelOptions?: HotelOption[];
  };
}

function Hotels({ trip }: { trip: TripData | null }) {
  return (
    <div>
      <h2 className="font-bold text-2xl mt-10 mb-3">Rekomendasi Hotel</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer">
        {trip?.tripData?.hotelOptions?.map((item: HotelOption) => (
          <Link href={"https://www.google.com/maps/search/?api=1&query="+item.hotelAddress} target="_blank">
            <div key={item.hotelName} className=" hover:scale-105 transition-all">
                <img src="/placeholder.png" className="rounded-lg"/>            
                <div className="my-2 flex flex-col gap-1 px-1">
                    <h3 className="font-medium text-xl">{item.hotelName}</h3>
                    <p className="text-xs text-gray-500">📍 {item.hotelAddress}</p>
                    <p className="text-gray-800 font-medium text-sm">{item.price}</p>
                    {/* <p className="text-gray-600 font-light text-sm">{item.description}</p> */}
                    <p className="text-yellow-500">{'⭐'.repeat(item.rating)}</p>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
