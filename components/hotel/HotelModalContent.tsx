import React, { useEffect, useState } from "react";
import { TbMapSearch } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { MdLocalHotel } from "react-icons/md";
import { VscDebugStart } from "react-icons/vsc";

interface HotelCardProps {
  hotel: {
    hotel_id: number;
    hotel_name: string;
    city: string;
    state: string;
    country: string;
    star_rating: number;
    photo1?: string | null;
    photo2?: string | null;
    photo3?: string | null;
    photo4?: string | null;
    photo5?: string | null;
    url: string;
    rating_average: number;
    overview: string;
    accommodation_type: string;
    addressline1: string;
  };
}

const HotelModalContent: React.FC<HotelCardProps> = ({ hotel }) => {
  const images = [
    hotel.photo1,
    hotel.photo2,
    hotel.photo3,
    hotel.photo4,
    hotel.photo5,
  ].filter((img): img is string => !!img);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mapsNameCity, setMapsNameCity] = useState("");

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const name = hotel.hotel_name;
    const city = hotel.city;
    const searchMaps = name + " " + city;
    setMapsNameCity(searchMaps);
  }, [hotel]);

  return (
    <div className="flex-1 py-4 md:py-2  px-2 md:px-4 lg:px-6 bg-white space-y-2 flex flex-col items-center justify-start lg:items-start overflow-y-scroll no-scrollbar h-full ">
      <div className="flex flex-col lg:flex-row gap-2 w-full">
        {/* Bagian Gambar */}
        <div className="px-4 flex flex-col items-center w-full lg:w-1/2">
          {/* Gambar Utama */}
          <div className="w-full max-w-lg md:h-64 overflow-hidden rounded-lg shadow-lg">
            <img
              src={
                images.length > 0 ? images[currentIndex] : "/default-hotel.jpeg"
              }
              alt="Hotel"
              className="w-full h-full object-cover aspect-[4/3] transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Navigasi Gambar Kecil */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto py-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`min-w-14 w-14 h-14 rounded-md cursor-pointer object-cover border-2 ${
                    currentIndex === index
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bagian Informasi Hotel dan Tombol */}
        <div className="flex flex-col gap-1 w-full lg:w-1/2">
          <div className="flex flex-col gap-2">
            <hr className="w-full bg-gray-200 md:hidden "/>
            <p className="font-semibold text-2xl lg:text-2xl">
              {hotel.hotel_name}
            </p>
            <div className="inline-block rounded-full text-gray-600 text-start">
              ~{hotel.city}~
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              {hotel.addressline1}
            </p>
            <div className="flex flex-row gap-2 text-xs md:text-sm text-gray-400">
              <span className="flex flex-row gap-1 items-center">
                <FaStar /> {hotel.rating_average}
              </span>
              <span>|</span>
              <span className="flex flex-row gap-1 items-center">
                <MdLocalHotel />
                <p className="line-clamp-1">{hotel.accommodation_type}</p>
              </span>
            </div>
          </div>

          <hr className="bg-gray-200 w-full my-4" />

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-2 w-full">
              <div
                className="flex flex-row gap-2 px-4 py-2 rounded-full items-center justify-center bg-gray-100 text-gray-600 cursor-pointer font-semibold hover:bg-gray-500 hover:text-white w-full"
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    mapsNameCity
                  )}`;
                  window.open(mapsUrl, "_blank");
                }}
              >
                <TbMapSearch /> Peta
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 rounded-full items-center justify-center bg-gray-700 text-gray-100 cursor-pointer font-semibold hover:bg-gray-500 hover:text-white w-full hidden">
                + Bucket List
              </div>
            </div>

            <div
              className="w-full text-center mt-7 px-4 py-2 font-bold text-lg bg-green-600 rounded-full text-white cursor-pointer hover:opacity-90"
              onClick={() => {
                const agodaUrl = hotel.url;
                window.open(agodaUrl, "_blank");
              }}
            >
              Pesan Kamar
            </div>
          </div>
        </div>
      </div>
      {/* Deskripsi Hotel */}
      <div className="px-4 mt-8 lg:mt-14 text-xs text-gray-600 whitespace-pre-line">
        <hr className="w-full my-4 bg-gray-200" />
        <p>{(hotel.overview || "").replace(/\. /g, `.\n\n`)}</p>
      </div>
    </div>
  );
};

export default HotelModalContent;
