"use client"

import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from '../Logo';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-4 bg-white shadow-md md:px-8">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          {/* Replace the below with an Image component if you have a logo file */}
          <Logo/>
          {/* <div className="text-xl font-bold text-blue-600">Mau Liburan</div> */}
        </div>

        {/* Middle Section: Menu Links (hidden on mobile unless isMenuOpen) */}
        <div className="hidden space-x-6 md:flex">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Buat Trip
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Trip Saya
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Hotel
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Wisata
          </a>
        </div>

        {/* Right Section: Sign In button (hidden on mobile unless isMenuOpen) */}
        <div className="hidden md:block">
          <button className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
            Sign In
          </button>
        </div>

        {/* Hamburger Menu Icon (visible on mobile) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={handleMenuToggle}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="flex flex-col px-4 py-2 bg-white shadow-md md:hidden">
          <a href="#" className="py-1 text-gray-700 hover:text-blue-600">
            Buat Trip
          </a>
          <a href="#" className="py-1 text-gray-700 hover:text-blue-600">
            Trip Saya
          </a>
          <a href="#" className="py-1 text-gray-700 hover:text-blue-600">
            Hotel
          </a>
          <a href="#" className="py-1 text-gray-700 hover:text-blue-600">
            Wisata
          </a>
          <button className="mt-2 w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
            Sign In
          </button>
        </div>
      )}
    </>
  );
};

export default NavBar;
