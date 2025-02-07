import Link from 'next/link';
import React from 'react';

function Logo() {
  return (
    <div className="flex justify-center items-center relative">
      {/* Logo Panjang (Desktop) */}
      <Link href="/" className="hidden md:flex relative">
        <div className="relative">
          <img src="/malib-logo-long.png" height={55} width={150} alt="Logo Panjang" />
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-1 py-0.1 text-center font-semibold
                          text-[8px]  text-white bg-black rounded-sm mb-1">
            Beta
          </div>
        </div>
      </Link>

      {/* Logo Pendek (Mobile) */}
      <Link href="/" className="flex md:hidden relative">
      <div className="relative scale-90 origin-left">
          <img src="/malib-logo-long.png" height={35} width={140} alt="Logo Panjang" />
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-1 py-0.1 text-center font-semibold
                          text-[8px]  text-white bg-black rounded-sm mb-1">
            Beta
          </div>
        </div>
      </Link>
      {/* <Link href="/" className="flex md:hidden relative">
        <div className="relative">
          <img src="/malib-logo-short.png" height={40} width={40} alt="Logo Pendek" />
          <div className="absolute top-0 right translate-x-1/2 -translate-y-1/2 px-2 py-0.1 text-center font-semibold
                          text-[7px]  text-white bg-black rounded-sm mb-1">
            Beta
          </div>
        </div>
      </Link> */}
    </div>
  );
}

export default Logo;
