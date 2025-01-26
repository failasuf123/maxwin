import React from 'react'
import { BsStars } from "react-icons/bs";


function BannerAIBeta() {
  return (
    <div className="relative">
      <img className="w-full rounded-xl" src="/banner-ai/banner-ai-beta-lg.webp" alt="AI Banner" />
      {/* <div className="absolute bottom-52 left-28 bg-black px-4 py-3 rounded-2xl text-white text-xl cursor-pointer"> */}
      {/* left-28 */}
      <div className="absolute top-2/3 left-4 md:left-28 bg-black scale-75 md:scale-100  px-4 py-3 rounded-2xl text-white text-md md:text-2xl cursor-pointer font-semibold flex flex-row items-center gap-2 hover:bg-white hover:text-black">
        <BsStars /> Buat trip dengan AI
      </div>
    </div>
  );
}

export default BannerAIBeta;
