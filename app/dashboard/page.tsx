"use client";
import React, { useEffect, useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { FaUsersViewfinder } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Privat from "@/components/dashboard/Privat";
import Link from "next/link";
import Publish from "@/components/dashboard/Publish";

function page() {
  const [modalCreateTrip, setModalCreateTrip] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [switchMenu, setSwitchMenu] = useState("Privat");

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log("user is:", user);

    if (!user) {
      setOpenDialog(true);
      return;
    }
    return;
  });

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
        setOpenDialog(false);
      });
  };

  return (
    <div className="p-10 md:px-20 lg:px-32 flex flex-col items-center">
      {/* Upper Content */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-start md:justify-between gap-3 md:gap-0">
        <h2 className="text-2xl font-semibold">Rencana Perjalanan</h2>
        <div
          onClick={() => setModalCreateTrip(true)}
          className="flex flex-row gap-2 px-3 py-2 items-center justify-center bg-black text-white cursor-pointer hover:bg-gray-700 rounded-lg"
        >
          <IoAddCircleSharp />   Buat Trip
        </div>
      </div>
      {/* End Upper Content */}


      {/* Switch Button */}
      <div className="flex flex-col w-full items-center md:items-start w-full gap-2 mt-8 md:mt-2">
        <div className="flex flex-row w-full gap-2">
          {/* Button Privat */}
          <div
            onClick={() => setSwitchMenu("Privat")}
            className={`md:px-2 md:py-1 px-4 py-2 w-full md:w-auto rounded-lg cursor-pointer text-center ${
              switchMenu === "Privat"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Privat
          </div>
          {/* Button Publish */}
          <div
            onClick={() => setSwitchMenu("Publish")}
            className={`md:px-2 md:py-1 px-4 py-2 w-full md:w-auto rounded-lg cursor-pointer text-center ${
              switchMenu === "Publish"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Publish
          </div>
        </div>


        {/* Keterangan */}
        <div className="text-gray-400 text-sm ">
          {switchMenu === "Privat" ? (
            <div>
              Merupakan perjalanan yang Anda buat tanpa diketahui orang lain.
            </div>
          ) : (
            <div>
              Orang lain dapat mengetahui dan mengimplementasikan perjalanan
              Anda.
            </div>
          )}
        </div>
      </div>
      {/* End Switch Button */}

      <hr className="w-full my-1 md:my-2"/>

      {/* Main Content */}
      <div className="mt-2 md:mt-4 w-full">
        {switchMenu === "Publish" ? (
          <Publish/>
        ) : (
          <Privat/>
        )}

      </div>
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
              <Link href="/share-trip/share">
                <div className="flex flex-col items-center justify-center gap-4 cursor-pointer group">
                  <div className="text-7xl transform transition-transform duration-300 group-hover:-rotate-12">
                    <GiNotebook />
                  </div>
                  <div>Buat Langsung</div>
                </div>
              </Link>
              <Link  href="/create-itinerary/create">
                <div className="flex flex-col items-center justify-center gap-4 cursor-pointer group">
                  <div className="text-7xl transform transition-transform duration-300 group-hover:animate-pulse group-hover:scale-105">
                    <BsStars />
                  </div>
                  <div>Buat Dengan AI</div>
                </div>
              </Link>
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
      {/* End Modal */}

      {/* Signin Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <h2 className="font-bold  text-lg mt-7">Sign In With Google</h2>
              <p className=" mt-1">
                Sign In dengan aman menggunakan google authentication
              </p>
              <Button
                disabled={loading}
                className="w-full mt-5"
                onClick={() => login()}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <FcGoogle className="mr-3 h-6 w-6" /> Sign In With Google
                  </>
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* End Signin Dialog */}
    </div>
  );
}

export default page;
