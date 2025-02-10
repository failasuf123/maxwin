import Link from 'next/link';
import React from 'react';

function Logo() {
  return (
    <div>
      <Link
        href="/"
        className="hidden md:block font-bold text-xl bg-gradient-to-r from-red-400 to-blue-400 text-transparent bg-clip-text hover:cursor-pointer"
      >
        <img src="/malib-logo-long.png" height={55} width={150} alt="Logo Panjang" />
      </Link>

      <Link
        href="/"
        className="block md:hidden font-bold text-xl bg-gradient-to-r from-red-400 to-blue-400 text-transparent bg-clip-text hover:cursor-pointer"
      >
        <img src="/malib-logo-short.png" height={40} width={40} alt="Logo Pendek" />
      </Link>
    </div>
  );
}

export default Logo;
