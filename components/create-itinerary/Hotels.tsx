import Link from 'next/link';
import React from 'react';
import HotelCardItem from './HotelCardItem';

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
                <HotelCardItem item={item} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
