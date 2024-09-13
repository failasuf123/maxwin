import React from 'react';

interface Place {
  geoCoordinates: string;
  placeDetails: string;
  placeImageUrl: string;
  placeName: string;
  rating: number;
  ticketPricing: string;
  timeTravel: string;
}

interface ItineraryDay {
  name: string;
  plan: Place[];
}

interface TripData {
  tripData?: {
    itinerary: {
      [key: string]: ItineraryDay;
    };
  };
}

function PlaceToVisit({ trip }: { trip: TripData | null }) {
  const itineraryArray = trip?.tripData?.itinerary
    ? Object.values(trip.tripData.itinerary)
    : [];

  return (
    <div>
      <h2 className="font-bold text-2xl mt-10 mb-3">Tempat untuk Anda Kunjungi</h2>

      {itineraryArray.map((day: ItineraryDay, dayIndex: number) => (
        <div key={dayIndex} className="">
          <h3 className="font-semibold text-xl mt-5 mb-3">hari ke-{dayIndex+1} - {day.name}</h3>

          <div className="grid grid-cols-2 md:grid-cols-1 ">
            {day.plan.map((place: Place, index: number) => (
                <div key={index} className="p-4 ">
                <p className="text-base font-semibold mt-1 text-cyan-600 mb-1 ml-1">{place.timeTravel}</p>
                <div className="border rounded-xl p-3  flex-row md:flex  gap-4 items-center">
                    <div>
                        <img src="/placeholder.png" className="rounded-lg w-[130px] h-[130px]"/>    
                    </div>
                    <div >
                        <h2 className="text-md:text-lg font-semibold">{place.placeName}</h2>
                        <p className="text-xs text-gray-500 md:text-sm mt-1">{place.placeDetails}</p>
                        <p className="text-xs md:text-sm mt-1 font-semibold text-green-600">{place.ticketPricing} (estimasi)</p>
                    </div>        
                </div>
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaceToVisit;
