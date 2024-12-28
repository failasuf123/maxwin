'use client'
import React, { useEffect, useState } from 'react'
import { GetPlacesDetails, PHOTO_REF_URL } from '@/app/service/GlobalApi';


function HomeUpper({ title, description, city, days, category, cost, author, image}: { title:string, description:string, city: string, days: number, category: string, cost:number, author:string, image:string}) {

  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
  const [date, setDate] = useState("")
  useEffect(() => {
    city&&GetPlacePhoto();
  },[city])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: city,
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
    <div >
      <div>
        {/* <img src={photoUrl} alt="Trip Image"  className="h-[340px] w-full object-cover rounded"/> */}
        <img src={image} alt="Trip Image"  className="h-[340px] w-full object-cover rounded"/>

          <h2 className="font-bold text-2xl md:text-3xl mt-3">{title}</h2>
          <p className="text-base text-gray-400 mt-2">- dibuat oleh: {author} -</p>
        <div className="flex flex-row flex-wrap gap-2 mt-3">
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">💰 {cost.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h2>
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🗓️ {days} Hari</h2>
          <h2 className="bg-gray-200 cursor-default text-sm md:text-base px-3 py-2 border rounded-full">🏝️ Kategori {category}</h2>
        </div>
        <div className="flex flex-col mt-3">
          <h2 className="font-semibold text-lg md:text-xl mt-3 text-gray-700">🏙️ Kota {city}</h2>
          <div className="bg-gray-100 px-3 py-2 md:px-5 rounded-2xl mt-3 ">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )

}
export default HomeUpper
