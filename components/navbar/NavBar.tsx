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

const NavBar: React.FC = ({ renderPage }: { renderPage?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
                <div
                  onClick={() => handleLinkClick("/create-itinerary/create")}
                  className="text-base text-gray-600 hover:bg-gray-200 cursor-pointer px-1 py-3 rounded-lg flex flex-row gap-2 items-center justify-start px-3"
                >
                  <BsStars />
                  <div>Buat menggunakan AI</div>
                </div>
                <div
                  onClick={() => handleLinkClick("/share-trip/share")}
                  className="text-base text-gray-600 hover:bg-gray-200 cursor-pointer px-1 py-3 rounded-lg flex flex-row gap-2 items-center justify-start px-3"
                >
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
        </div>

        <div className="max-w-44 h-12 flex  items-center block md:block ">
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
        <div className="flex flex-col gap-1 px-4 py-2 bg-white shadow-md md:hidden">
          {/* State untuk mengontrol sub-menu */}
          <div>
            <div
              className="py-2 text-gray-700 hover:bg-gray-200 px-3 rounded-lg font-semibold cursor-pointer flex justify-between items-center"
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
            >
              Buat Trip
              <IoIosArrowDropdown
                className={`transform ${
                  isSubMenuOpen ? "rotate-180" : "rotate-0"
                } transition-transform`}
              />
            </div>
            {/* Sub-menu untuk Buat Trip */}
            {isSubMenuOpen && (
              <div className="ml-4 flex flex-col gap-1">
                <div
                  onClick={() => handleLinkClick("/create-itinerary/create")}
                  className="py-2 text-gray-700 hover:bg-gray-200 px-3 rounded-lg cursor-pointer flex justify-start gap-3  items-center"
                >
                  <BsStars />
                  <div>Buat menggunakan AI</div>
                </div>
                <hr className="w-full bg-gray-400" />
                <div
                  onClick={() => handleLinkClick("/share-trip/share")}
                  className="py-2 text-gray-700 hover:bg-gray-200 px-3 rounded-lg cursor-pointer flex justify-start gap-3  items-center"
                >
                  <IoIosCreate />
                  <div>Buat manual</div>
                </div>
              </div>
            )}
          </div>
          <hr className="w-full bg-gray-400" />
          <a
            href="#"
            className="py-2 text-gray-700 hover:bg-gray-200 px-3 rounded-lg font-semibold"
            onClick={() => handleLinkClick("/dashboard")}
          >
            Trip Saya
          </a>
          <hr className="w-full bg-gray-400" />
          <a
            href="#"
            className="py-2 text-gray-700 hover:bg-gray-200 px-3 rounded-lg font-semibold"
            onClick={() => handleLinkClick("/explore/itinerary")}
          >
            Trip Orang Lain
          </a>

          <hr className="w-full bg-gray-400" />

          <div className="overflow-hidden max-h-14 py-1 bg-gray-100 mt-1 rounded-lg">
            <SidebarProvider>
              <NavUser user={data.user} />
            </SidebarProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
