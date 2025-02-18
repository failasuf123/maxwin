"use client";
import React, { useState, useRef, useEffect } from "react";
import { TbHandClick } from "react-icons/tb";
import { MdHotel } from "react-icons/md";


type Todo = {
  type: string;
  name: string;
  description: string;
  cost: number;
  timeStart: string;
  timeEnd: string;
  image: string;
  imageList: string[];
  date: string;
};

type ContentHotelProps = Todo & {
  allImageDetails: { image: string; name: string }[]; // Prop untuk menerima daftar semua gambar beserta nama lokasi
};

const ContentWisata = ({
  name,
  description,
  cost,
  timeStart,
  timeEnd,
  image,
  imageList,
  allImageDetails,
}: ContentHotelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Fungsi untuk menangani klik pada container (hanya untuk mode sm)
  const handleClick = () => {
    if (description) {
      setIsExpanded(!isExpanded);
    }
  };

  // Fungsi untuk menangani klik pada tombol "Selengkapnya" (hanya untuk mode md ke atas)
  const handleSelengkapnyaClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event bubbling ke container
    if (description) {
      setIsExpanded(!isExpanded);
    }
  };

  // Fungsi untuk membuka modal dan mengatur gambar yang diklik
  const handleImageClick = (e: React.MouseEvent, clickedImage: string) => {
    e.stopPropagation(); // Mencegah event bubbling ke container
    if (image !== "/placeholder.png") {
      const clickedIndex = allImageDetails.findIndex(
        (img) => img.image === clickedImage
      );
      setCurrentImageIndex(clickedIndex);
      setIsModalOpen(true);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fungsi untuk berpindah ke gambar sebelumnya
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : allImageDetails.length - 1
    );
  };

  // Fungsi untuk berpindah ke gambar berikutnya
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < allImageDetails.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Efek untuk memeriksa apakah deskripsi melebihi batas line-clamp
  useEffect(() => {
    if (descriptionRef.current) {
      const isTextClamped =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setIsClamped(isTextClamped);
    }
  }, [description]);

  return (
    // <div className="flex flex-col rounded-xl border-2 border-gray-200 rounded " onClick={handleClick}>
        <div className="relative flex flex-col rounded-xl border-2 border-gray-200"  onClick={handleClick}>
  {/* Teks "Menginap di" di tengah border atas */}
  <span className="absolute -top-3 right-5 -translate-x-1/2 bg-white px-3 text-gray-600 text-sm font-semibold flex flex-row gap-2 items-center">
  <MdHotel className="text-lg" /> Menginap di
  </span>
      <div className="p-3 rounded-lg flex flex-row items-start gap-4 relative ">
        {/* Thumbnail */}
        <div className="flex flex-col items-start justify-start gap-2 relative flex-shrink-0">
          <div className="inline-flex items-center bg-black text-white text-[9px] md:text-[10px] font-medium px-2 md:px-3 py-1 rounded-full">
            🕒 checkin: {timeStart} 
          </div>

          <div
            className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mt-1 rounded-lg overflow-hidden shadow-sm cursor-pointer group"
            onClick={(e) => handleImageClick(e, image)}
          >
            {/* Gambar */}
            <img
              src={image || "/placeholder.webp"}
              alt={name || "No Title"}
              className="w-full h-full object-cover m transition duration-300 group-hover:brightness-50"
            />

            {/* Overlay teks */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="text-white text-sm  font-semibold">View</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h4
            className={`font-semibold text-sm md:text-lg text-cyan-700 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {name || "No Title"}
          </h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Cost */}
            <span className="inline-flex items-center bg-green-200 text-green-800 text-[9px] md:text-[10px] font-medium px-2 md:px-3 py-1 rounded-full">
              💰{" "}
              {cost.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>

          {/* Deskripsi untuk Mode md/lg/xl */}
          <div className="mt-3 hidden md:block">
            <p
              ref={descriptionRef}
              className={`md:text-sm text-gray-700 overflow-hidden ${
                isExpanded ? "" : "md:line-clamp-4 lg:line-clamp-5"
              }`}
            >
              {description || "No description available."}
            </p>
            {description && isClamped && (
              <button
                onClick={handleSelengkapnyaClick}
                className="text-cyan-700 font-bold hover:underline mt-1"
              >
                {isExpanded ? "Sembunyikan" : "Selengkapnya"}
              </button>
            )}
          </div>

          {/* Kalimat "Tap to view description" atau "No description available." untuk Mode sm */}
          <div className="mt-3 block md:hidden">
            {description ? (
              !isExpanded && (
                <p className="text-xs text-gray-600 italic flex flex-row gap-1 items-center">
                  <TbHandClick /> Tap to view description
                </p>
              )
            ) : (
              <p className="text-xs text-gray-600">No description available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Deskripsi untuk Mode sm (Mobile) */}
      <div className="block md:hidden ml-2">
        {description && isExpanded && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Tutup modal saat klik di luar gambar
        >
          <div
            className="relative max-w-3xl w-full rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nama Lokasi & Tombol Close */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-10 px-4 bg-black bg-opacity-20 rounded-xl">
              <h2 className="text-lg font-bold truncate line-clamp-2">
                {allImageDetails[currentImageIndex]?.name ||
                  "Gambar tidak tersedia"}
              </h2>
              <button onClick={closeModal} className="text-white text-2xl">
                &times;
              </button>
            </div>

            {/* Gambar */}
            <div className="relative">
              <img
                src={
                  allImageDetails[currentImageIndex]?.image ||
                  "/placeholder.webp"
                }
                alt={allImageDetails[currentImageIndex]?.name || "Placeholder"}
                className="w-full h-96 object-cover"
              />

              {/* Tombol Navigasi */}
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white"
              >
                &lt;
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white"
              >
                &gt;
              </button>

              {/* Indikator Pagination */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black px-2 py-2 rounded-full bg-opacity-40">
                {allImageDetails.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentImageIndex === index
                        ? "bg-cyan-500 scale-110"
                        : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentWisata;
