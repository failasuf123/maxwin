'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimationBlack from '../LoadingAnimationBlack';

function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGenerateByAI = () => {
    handleCloseModal();
    setIsLoading(true);

    setTimeout(() => {
      router.push('/create-itinerary');
      setIsLoading(false); 
    }, 1000); // Jeda 1 detik
  };

  return (
    <div className="flex items-center flex-col gap-5">
      <h2 className="text-2xl md:text-4xl font-semibold text-center">
        Buat Rencana Berwisata, Booking Hotel, dan <span className="text-red-400">Lihat Pengalaman Wisata Orang Lain</span>
      </h2>

      {isLoading ? (
        <div>
          <LoadingAnimationBlack />
          <h2 className="mt-1 text-gray-500 font-light">Mengarahkan halaman</h2>
        </div>
        
      ) : (
        <div className="flex flex-row gap-3 md:gap-4">
          <div>
            <div
              onClick={handleGenerateByAI}
              className="flex items-center justify-center rounded-lg px-8 py-1 md:py-2 bg-black text-white cursor-pointer hover:scale-95"
            >
              Generate by AI
            </div>
          </div>
          <div>
            <div
              onClick={handleOpenModal}
              className="flex items-center justify-center rounded-lg px-8 py-1 md:py-2 border-2 text-gray-700 cursor-pointer hover:scale-95"
            >
              Buat Manual
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="relative bg-white rounded-lg p-5 w-80 md:w-96">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Coming Soon</h3>
              <p className="mt-2 text-sm text-gray-600">
                Fitur Buat Manual akan segera tersedia.
              </p>
              <div
                onClick={handleGenerateByAI} 
                className="mt-5 px-4 py-2 rounded-lg bg-black text-white cursor-pointer hover:scale-95"
              >
                Generate by AI
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
