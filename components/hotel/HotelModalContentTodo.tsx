import React, { useEffect, useState } from "react";
import { TbMapSearch } from "react-icons/tb";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { MdAccessTime, MdLocalHotel } from "react-icons/md";
import { VscDebugStart } from "react-icons/vsc";
import { GiMoneyStack } from "react-icons/gi";

interface HotelFormProps {
  newTodo: {
    type: string;
    name: string;
    description?: string;
    cost: number;
    timeStart?: string;
    timeEnd?: string;
    tag?: string[];
    image?: string;
    imageList?: string[];
    date?: string;
  };
  setNewTodo: (todo: any) => void;
}

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

interface HotelModalProps extends HotelCardProps, HotelFormProps {}

const HotelModalContentTodo: React.FC<HotelModalProps> = ({
  hotel,
  newTodo,
  setNewTodo,
}) => {
  const images = [
    hotel.photo1,
    hotel.photo2,
    hotel.photo3,
    hotel.photo4,
    hotel.photo5,
  ].filter((img): img is string => !!img);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mapsNameCity, setMapsNameCity] = useState("");
  const [isInput, setIsInput] = useState(false);

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const name = hotel.hotel_name;
    const city = hotel.city;
    const searchMaps = name + " " + city;
    setMapsNameCity(searchMaps);
  }, [hotel]);

  useEffect(() => {
    setNewTodo({ ...newTodo,name:hotel.hotel_name, timeStart: "14:00", timeEnd: "23:59", image:hotel.photo1, description:hotel.overview,  });
  }, [])

  return (
    <>
      {!isInput ? (
        <div className="flex-1 py-4 md:py-2  px-2 md:px-4 lg:px-6 bg-white space-y-2 flex flex-col items-center justify-start lg:items-start overflow-y-scroll no-scrollbar h-full ">
          <div>
            <div className="flex flex-col lg:flex-row gap-2 w-full">
              {/* Bagian Gambar */}
              <div className="px-4 flex flex-col items-center w-full lg:w-1/2">
                {/* Gambar Utama */}
                <div className="w-full max-w-lg md:h-64 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={
                      images.length > 0
                        ? images[currentIndex]
                        : "/default-hotel.jpeg"
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
                  <hr className="w-full bg-gray-200 md:hidden " />
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
                    <div
                      className="flex flex-row gap-2 px-4 py-2 rounded-full items-center justify-center bg-green-600 text-white cursor-pointer font-semiboldh over:opacity-90 w-full "
                      onClick={() => {
                        const agodaUrl = hotel.url;
                        window.open(agodaUrl, "_blank");
                      }}
                    >
                      Pesan Kamar
                    </div>
                  </div>

                  <div
                    className="w-full text-center mt-7 px-4 py-2 font-bold text-lg bg-gray-800 text-gray-100 rounded-full  cursor-pointer hover:bg-cyan-600 hover:text-white hover:opacity-90"
                    onClick={() => setIsInput(true)}
                  >
                    + Tambahkan Ke Trip
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
          <div className="w-full bg-white p-6 ">
            {/* Input Waktu Check-In */}
            <div className="w-full mb-6">
              <label
                htmlFor="timeStart"
                className="block text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
              >
                <MdAccessTime /> Check In
              </label>
              <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs">
                <p>*check in hotel</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="timeStart"
                  type="time"
                  value={newTodo.timeStart || ""}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, timeStart: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Input Biaya */}
            <div className="w-full mb-6">
              <label
                htmlFor="cost"
                className="block mb-3 text-sm font-medium flex flex-row gap-1 md:gap-2 items-center"
              >
                <GiMoneyStack className="md:text-base" /> Biaya
              </label>
              <div className="my-2 flex justify-start w-full text-gray-400 text-[9.5px] md:text-xs">
                <p>*lakukan estimasi biaya</p>
              </div>
              <div className="w-full">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <span className="flex items-center rounded-l px-3 font-bold text-gray-600">
                      Rp
                    </span>
                    <input
                      type="text"
                      name="cost"
                      value={new Intl.NumberFormat("id-ID").format(
                        newTodo.cost || 0
                      )}
                      onChange={(e) => {
                        let rawValue = e.target.value.replace(/\D/g, "");
                        let numericValue = Math.min(
                          Math.abs(parseInt(rawValue) || 0),
                          100000000
                        );
                        setNewTodo({ ...newTodo, cost: numericValue });
                      }}
                      className="p-2 flex-1 bg-gray-100 text-gray-800 py-2 font-normal border border-gray-300 rounded-none font-bold w-full"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let newValue = Math.min(newTodo.cost * 1000, 100000000);
                        setNewTodo({ ...newTodo, cost: newValue });
                      }}
                      disabled={newTodo.cost >= 100000000}
                      className={`px-3 py-2 rounded-r font-bold ${
                        newTodo.cost >= 100000000
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      +000
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full text-gray-400 text-[9.5px] md:text-xs mt-1">
                min Rp 0 maks Rp 100 juta
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 items-center justify-center mt-12">
              {/* Tombol Simpan*/}
              <button
                type="submit"
                className="px-8 py-2 w-1/2 text-base font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                + Tambahkan Ke Trip
              </button>

              {/* Tombol Kembali */}
              <button
                onClick={() => setIsInput(false)}
                className="px-6 py-2 w-1/2 text-base font-medium text-gray-600 bg-gray-100 rounded-full flex flex-row gap-2 items-center justify-center "
              >
               <FaArrowLeft /> kembali
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelModalContentTodo;
