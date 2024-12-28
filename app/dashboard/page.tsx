"use client";
import React, { useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { FaUsersViewfinder } from "react-icons/fa6";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function page() {
  const [modalCreateTrip, setModalCreateTrip] = useState(false);
  return (
    <div className="p-10 md:px-20 lg:px-32 flex flex-col items-center">
      {/* Upper Content */}
      <div className="w-full flex flex-row items-center justify-between">
        <h2>Rencana Perjalanan</h2>
        <div
          onClick={() => setModalCreateTrip(true)}
          className="flex flex-row gap-2 px-3 py-2 items-center bg-black text-white cursor-pointer hover:bg-gray-700 rounded-lg"
        >
          <IoAddCircleSharp /> Buat Trip
        </div>
      </div>
      {/* End Upper Content */}

      {/* Main Content */}
      <div></div>
      {/* End Main Content */}

      {/* Modal */}
      {modalCreateTrip && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-xl">
            <button
              onClick={() => setModalCreateTrip(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="text-md text-gray-500 mt-1 text-center">
              Dari mana kita mulai menyempurnakan rencana Trip Anda?
            </div>
            <div className="flex flex-row items-center justify-center gap-10 w-full px-4">
              <div className="flex flex-col items-center justify-center gap-4 cursor-pointer group">
                <div className="text-7xl transform transition-transform duration-300 group-hover:-rotate-12">
                  <GiNotebook />
                </div>
                <div>Buat Langsung</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 cursor-pointer group">
                <div className="text-7xl transform transition-transform duration-300 group-hover:animate-pulse">
                  <BsStars />
                </div>
                <div>Buat Dengan AI</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 cursor-pointer group">
                <div className="text-7xl transform transition-transform duration-300 group-hover:scale-90">
                  <FaUsersViewfinder />
                </div>
                <div>Trip Orang Lain</div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full mt-5">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-gray-500">
                  <div className="flex flex-row gap-2">
                    <GiNotebook /> Buat Langsung?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Rencanakan perjalanan Anda dengan mudah dan efisien! Eksplor
                  berbagai aktivitas menarik, pilihan hotel, dan destinasi
                  wisata. Anda juga dapat menambahkan tempat-tempat unik yang
                  belum tersedia di platform kami untuk menciptakan pengalaman
                  perjalanan yang sepenuhnya personal.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-gray-500">
                  <div className="flex flex-row gap-2">
                    <BsStars /> Buat Dengan AI?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Biarkan AI Mauliburan.com merancang rencana perjalanan seru
                  khusus untuk Anda. Setelah itu, Anda dapat dengan mudah
                  menyesuaikan rencana tersebut agar sesuai dengan preferensi
                  dan kebutuhan pribadi Anda.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-gray-500">
                  <div className="flex flex-row gap-2">
                    <FaUsersViewfinder /> Trip Orang Lain?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Temukan inspirasi dari pengalaman perjalanan orang lain yang
                  telah mencoba berbagai aktivitas seru! Pilih trip yang sesuai
                  dengan preferensi Anda, lalu sesuaikan detailnya untuk
                  menciptakan perjalanan yang sempurna bagi Anda.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
