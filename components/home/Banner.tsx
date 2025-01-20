// components/home/Banner.tsx

import React from "react";

export default function Banner() {
  return (
    <section
      className="relative flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/home-background.png')",
        height: "75vh",
      }}
    >
      {/* Overlay to darken background if needed */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-white md:text-5xl">
          Halo, mau ke mana?
        </h1>
        <p className="mt-2 text-lg text-white md:text-xl">
          Yuk lihat plan liburan orang lain!
        </p>

        {/* Main CTA Button */}
        <button className="px-4 py-2 mt-4 font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
          Buat Rencana Liburanmu
        </button>
      </div>
    </section>
  );
}
