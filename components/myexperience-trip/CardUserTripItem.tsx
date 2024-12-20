import React, { useEffect, useState } from 'react'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';
import Link from 'next/link'

  
  interface UserTripCreated {
      id:string;
      tripData: {
        title: string;
        city: string;
        dateStart: string;
        dateEnd: string;
        category: string;
        description: string;
        totalDays: number;
        totalPrice: number;
        imageCover: string;
        todos: {
          [date: string]: Array<{
            name: string; // Nama tempat wisata
            type: string; // Jenis aktivitas, contoh: "wisata"
            description: string; // Deskripsi aktivitas
            cost: number; // Biaya aktivitas
            image: string; // Gambar aktivitas
            imageList: string[]; // Daftar gambar tambahan
            tag: string[]; // Tag terkait aktivitas
            timeStart: string; // Waktu mulai
            timeEnd: string; // Waktu selesai
          }>;
        };
      };
  }
  function CardUserTripItem({ trip }: { trip: UserTripCreated }) {
      

    return (
    <Link href={`/view-experience/${trip?.id}`}>
      <div>
        <img
          src={trip?.tripData?.imageCover || '/placeholder.png'}
          className="h-44 w-full object-cover rounded-xl"
          alt={trip?.tripData?.city || 'Image'}
          />
          <div className="mt-2">
          <h2 className="font-bold text-lg">{trip?.tripData?.city}</h2>
          <h2 className="text-gray-500 text-xs">{trip?.tripData?.totalDays} days with {trip?.tripData?.totalPrice} budget</h2>
        </div>
      </div>
    </Link>
    );
  }
  
  export default CardUserTripItem;
  
