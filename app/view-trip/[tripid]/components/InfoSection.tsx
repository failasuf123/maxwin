import React from 'react'

interface TripData {
    [key: string]: any;
  }
  
  function InfoSection({ trip }: { trip: TripData | null }) {
    return (
      <div>
        {trip ? (
          <div>
              {trip.id}
            <p>Name: {trip.userEmail}</p>
            <p>Location: {trip.location}</p>
          </div>
        ) : (
          <p>No trip data available</p>
        )}
      </div>
    );
  }
  
  export default InfoSection;
  
