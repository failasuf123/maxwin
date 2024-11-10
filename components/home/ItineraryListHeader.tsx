import React from 'react';

function ItineraryListHeader() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full mt-10">

      {/* Search Bar */}
      <div className="w-full md:w-auto flex flex-col items-center">
        <div className="pt-2 relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full md:w-auto"
            type="search"
            name="search"
            placeholder="Cari Kota"
          />
          <button type="submit" className="absolute right-0 mt-5 top-0 mr-4">
            <svg
              className="text-gray-600 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 56.966 56.966"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Daftar Kota */}
      <div className="flex flex-wrap md:flex-row items-center gap-2">
        {["Jakarta", "Bali", "Bandung", "Surabaya", "Malang"].map((city) => (
          <div
            key={city}
            className="flex items-center py-1 px-1 text-sm md:py-2 md:px-3 md:text-base rounded-md bg-cyan-400 text-white cursor-pointer hover:bg-black"
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItineraryListHeader;
