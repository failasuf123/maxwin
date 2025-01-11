'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimationBlack from '../LoadingAnimationBlack';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";


function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleGenerateByAI = () => {
    setIsLoading(true);

    setTimeout(() => {
      router.push('/create-itinerary/create');
      setIsLoading(false); 
    }, 100); // Jeda 1 detik
  };
  const handleCreateManual = () => {
    setIsLoading(true);
    const user = localStorage.getItem("user");
    console.log("User from localStorage:", user);

    if (!user) {
      setOpenDialog(true)
      setIsLoading(false)
    }
    else {
      setTimeout(() => {
        router.push('/share-trip/share');
        setIsLoading(false); 
      }, 100); // Jeda 1 detik
    }

  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => getUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const getUserProfile = (tokenInfo: any) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data));
        // setIsLoggedIn(false);
        setOpenDialog(false)

      });
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
              className="flex items-center justify-center text-xs md:text-sm md:text-base rounded-lg px-3 md:px-8 py-2 md:py-2 bg-black text-white cursor-pointer hover:scale-95"
            >
              Generate by AI
            </div>
          </div>
          <div>
            <div
              onClick={handleCreateManual}
              className="flex items-center justify-center text-xs md:text-sm md:text-base rounded-lg px-3 md:px-8 py-2 md:py-2 border-2 text-gray-700 cursor-pointer hover:scale-95"
            >
              Buat Manual
            </div>
          </div>
        </div>
      )}

{openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white w-96 p-6 rounded-lg shadow-lg">
            {/* Tombol X di pojok kanan atas */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenDialog(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">Sign In With Google</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sign In dengan aman menggunakan Google Authentication.
            </p>
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-gray-900 rounded hover:bg-blue-600"
              onClick={() => login()}
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Sign In With Google
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

export default Banner;
