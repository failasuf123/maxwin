"use client";

import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "@/components/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavUser } from "../sidebar/nav-user";
import { SidebarProvider } from "../ui/sidebar";
import { IoIosArrowDropdown } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsStars } from "react-icons/bs";
import { IoIosCreate } from "react-icons/io";
import Link from "next/link";
import LoadingAnimationBlack from "../LoadingAnimationBlack";
import { useRouter } from "next/navigation";

const NavBar: React.FC = ({renderPage} : {renderPage?:string}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  useEffect(()  => {
    setIsLoading(false)
  },[])

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = async (path: string) => {
    setIsLoading(true); // Aktifkan state loading
    router.push(path); // Navigasi ke halaman tujuan
    // Tunggu hingga halaman baru selesai dimuat
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Timeout opsional (sesuai UX)
    setIsLoading(false); // Matikan state loading setelah navigasi selesai
  };

  

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div>Mengarahkan Halaman...</div>
        </div>
      )}
      <nav className="flex items-center justify-between px-4 py-2 bg-white shadow md:px-8 overflow-y-hidden w-screen">
        <div className="flex items-center" onClick={() => handleLinkClick("/")}>
          <Logo />
        </div>

        <div className="hidden space-x-1 md:flex">
          <Popover>
            <PopoverTrigger asChild>
              <div className="text-gray-800 font-semibold hover:bg-gray-200 rounded-xl px-3 py-2 text-sm flex flex-row gap-1 items-center cursor-pointer">
                Buat Trip <IoIosArrowDropdown className="text-base" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 py-2">
              <div className="grid gap-1">
                  <div onClick={() => handleLinkClick("/create-itinerary/create")} className="text-base text-gray-600 hover:bg-gray-200 cursor-pointer px-1 py-3 rounded-lg flex flex-row gap-2 items-center justify-start px-3">
                    <BsStars />
                    <div>Buat menggunakan AI</div>
                  </div>
                  <div onClick={() => handleLinkClick("/share-trip/share")} className="text-base text-gray-600 hover:bg-gray-200 cursor-pointer px-1 py-3 rounded-lg flex flex-row gap-2 items-center justify-start px-3">
                    <IoIosCreate />
                    <div>Buat manual</div>
                  </div>
              </div>
            </PopoverContent>
          </Popover>
          <a
            href="/dashboard"
            className="text-gray-800 font-semibold hover:bg-gray-200 rounded-xl px-3 py-2 text-sm"
            onClick={() => handleLinkClick("/dashboard")}

            
          >
            Trip Saya
          </a>
          <a
            href="/explore/itinerary"
            className="text-gray-800 font-semibold hover:bg-gray-200 rounded-xl px-3 py-2 text-sm"
            onClick={() => handleLinkClick("/explore/itinerary")}

          >
            Trip Orang Lain
          </a>
          {/* <a href="#" className="text-gray-800 font-semibold hover:bg-gray-200 rounded-xl px-3 py-2 text-sm">
            Hotel
          </a>
          <a href="#" className="text-gray-800 font-semibold hover:bg-gray-200 rounded-xl px-3 py-2 text-sm">
            Wisata
          </a> */}
        </div>

        <div className="max-w-44 h-12 flex  items-center hidden md:block ">
          <SidebarProvider>
            <NavUser user={data.user} />
          </SidebarProvider>
        </div>
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={handleMenuToggle}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="flex flex-col px-4 py-2 bg-white shadow-md md:hidden">
          <a
            href="#"
            className="py-1 text-gray-700 hover:text-blue-600"
            onClick={() => handleLinkClick("#")}

          >
            Buat Trip
          </a>
          <a
            href="#"
            className="py-1 text-gray-700 hover:text-blue-600"
            onClick={() => handleLinkClick("#")}
          >
            Trip Saya
          </a>
          <a
            href="#"
            className="py-1 text-gray-700 hover:text-blue-600"
            onClick={() => handleLinkClick("#")}
          >
            Hotel
          </a>
          <a
            href="#"
            className="py-1 text-gray-700 hover:text-blue-600"
            onClick={() => handleLinkClick("#")}
          >
            Wisata
          </a>
          <button className="mt-2 w-full px-3 py-1  text-sm text-white bg-black rounded-md hover:bg-gray-800">
            Sign In
          </button>
        </div>
      )}
    </>
  );
};

export default NavBar;
