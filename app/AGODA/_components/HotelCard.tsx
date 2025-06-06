import React from "react";

interface Hotel {
  hotelId: number;
  hotelName: string;
  dailyRate: number;
  currency: string;
  imageURL: string;
  landingURL: string;
  roomTypeName: string | undefined;
  starRating: number;
  reviewCount: number;
  reviewScore: number;
  crossedOutRate: number;
  discountPercentage: number;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="rounded-lg overflow-hidden transition-shadow relative cursor-pointer">
      <div className="relative">
        {" "}
        {/* Container relatif untuk gambar */}
        <img
          src={hotel.imageURL}
          alt={hotel.hotelName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < Math.floor(hotel.starRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
          {hotel.discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white  rounded">
            <div className="flex items-center">
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                {hotel.discountPercentage}% OFF
              </span>
            </div>
        </div>
          )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-gray-500 ml-1 flex items-center">
            {hotel.reviewScore.toFixed(1)}
            <svg
              className="w-4 h-4 ml-1 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-3">{hotel.reviewCount} reviews</span>
          </span>
        </div>

        <div className="mt-2">
          {hotel.discountPercentage > 0 && (
            <div className="flex items-center">
              <span className="text-gray-500 line-through mr-2">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(hotel.crossedOutRate)}
              </span>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                {hotel.discountPercentage}% OFF
              </span>
            </div>
          )}
          <p className="text-xl font-bold text-gray-800">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(hotel.dailyRate)}
            <span className="text-sm font-normal text-gray-500"> / malam</span>
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {hotel.includeBreakfast && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Sarapan
            </span>
          )}
          {hotel.freeWifi && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              WiFi Gratis
            </span>
          )}
        </div>
        
        <a
          href={hotel.landingURL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}

export default HotelCard;
