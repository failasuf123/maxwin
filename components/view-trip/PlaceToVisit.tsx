import React from 'react';
import PlaceCardItem from './PlaceCardItem';

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
                <PlaceCardItem item={place} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaceToVisit;
