import React from 'react'

interface TripData {
  [key: string]: any;
}

function InfoSection({ trip }: { trip: TripData | null }) {
  return (
    <div>
      <img src="/placeholder.png" alt="Trip Image"  className="h-[340px] w-full object-cover rounded"/>

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
