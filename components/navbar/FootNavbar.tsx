"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCompass,
  FiShoppingBag,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { RiAddCircleFill } from "react-icons/ri";

const FooterNavbar = () => {
  const pathname = usePathname();

  // Daftar menu navbar
  const menus = [
    {
      name: "Home",
      icon: FiHome,
      path: "/",
    },
    {
      name: "Explore",
      icon: FiCompass,
      path: "/explore",
    },
    {
      name: "Create",
      icon: RiAddCircleFill,
      path: "/itinerary",
    },
    {
      name: "Trip",
      icon: FiUser,
      path: "/trip",
    },
    {
      name: "Bucket",
      icon: FiShoppingBag,
      path: "/bucket",
    },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-3">
        {menus.map((menu, index) => {
          // const isActive = pathname === menu.path; // Ganti ini
          const isActive =
            menu.path === "/"
              ? pathname === "/"
              : pathname.startsWith(menu.path);

          return (
            <Link
              key={index}
              href={menu.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-300 ${
                isActive ? "text-gray-900 font-bold" : "text-gray-500"
              }`}
            >
              <menu.icon className={`text-xl ${isActive ? "scale-110" : ""}`} />
              <span className={`text-xs mt-1 ${isActive ? "font-bold" : ""}`}>
                {menu.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterNavbar;
