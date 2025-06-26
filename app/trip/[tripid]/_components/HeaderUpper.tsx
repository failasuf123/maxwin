'use client'
import React from 'react';

interface TripData {
  [key: string]: any;
}

function HeaderUpper({ trip }: { trip: TripData | null }) {
  // Hitung total harga dari budgeting.expend
  const totalPrice = trip?.budgeting?.expend?.reduce(
    (sum: number, item: any) => sum + (item.budget || 0),
    0
  ) || 0;

  // Hitung total hari dari itineraries
  const totalDays = trip?.itineraries?.length || 0;

  // Format kategori dari tag array
  const categories = trip?.tag?.join(', ') || null;

  // Format nama kota
  const cities = trip?.Cities?.map((city: any) => city.cityName).join(', ') || '';

  return (
    <div>
      <div>
        <img 
          src={trip?.imageCover || '/itinerary-bg-default.webp'} 
          className="h-[340px] w-full object-cover rounded" 
          alt="Cover trip"
        />
        <h2 className="font-bold text-2xl md:text-3xl mt-3">{trip?.title}</h2>
        <p className="text-base text-gray-400 mt-2">- dibuat oleh: {trip?.username} -</p>
        
        <div className="flex flex-row flex-wrap gap-2 mt-3">
          {/* Total Harga */}
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">
            💰 {totalPrice.toLocaleString("id-ID", { 
              style: "currency", 
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </h2>
          
          {/* Total Hari */}
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">
            🗓️ {totalDays} Hari
          </h2>
          
          {/* Kategori - hanya ditampilkan jika ada */}
          {categories && (
            <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">
              🏝️ {categories}
            </h2>
          )}
        </div>
        
        <div className="flex flex-col mt-3">
          {/* Daftar Kota */}
          {cities && (
            <h2 className="font-semibold text-lg md:text-xl mt-3 text-gray-700">
              🏙️ Kota {cities}
            </h2>
          )}
          
          {/* Deskripsi */}
          <div className="bg-gray-100 px-3 py-2 md:px-5 rounded-2xl mt-3">
            <p>{trip?.description || "Tidak ada deskripsi"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderUpper;