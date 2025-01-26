"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast"; // Import toast shadcn
import DatePicker from "@/components/myexperience-trip/DatePicker";

interface TripData {
  [key: string]: any;
}

function FooterButton({ id, trip }: { id: string; trip: TripData | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast(); // Inisialisasi toast

  const handleDateChange = (data: {
    startDate: Date | null;
    endDate: Date | null;
    totalDays: number;
  }) => {
    const formattedStartDate = data.startDate
      ? format(data.startDate, "yyyy-MM-dd")
      : null;
    const formattedEndDate = data.endDate
      ? format(data.endDate, "yyyy-MM-dd")
      : null;

    setSelectedStartDate(formattedStartDate);
    setSelectedEndDate(formattedEndDate);
  };

  const directToEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(
        `/view-experience/${id}/edit?startDate=${selectedStartDate}&endDate=${selectedEndDate}`
      );
    }, 500);
  };

  const handleCreateTrip = () => {
    if (!selectedStartDate || !selectedEndDate) {
      toast({
        description: "‼️ Harap isi tanggal terlebih dahulu sebelum mengimplementasikan Trip ini.",
      });
      return;
    }
    setModalOpen(false);
    directToEdit();
  };

  return (
    <div className="mt-5 md:mt-8 w-full">
      <hr className="mb-2 w-full text-gray-200" />
      <div
        className={`w-full py-2 text-base md:text-lg lg:text-xl cursor-pointer text-center bg-black text-white rounded-xl hover:bg-gray-800 flex items-center justify-center ${
          isLoading ? "cursor-not-allowed bg-gray-700" : ""
        }`}
        onClick={!isLoading ? () => setModalOpen(true) : undefined}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
        ) : (
          "+ Implementasikan Trip"
        )}
      </div>
      <div className="text-gray-400 mt-1 text-xs md:text-sm text-center">
        *Buat rencana perjalanan anda, berdasarkan trip ini
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[520px]">
            <h2 className="text-lg font-semibold mb-1">Pilih Tanggal</h2>
            <div className="text-sm text-gray-500">
              <p>
                *Trip {trip?.tripData.totalDays} hari ini, berakhir pada{" "}
                {trip?.tripData.dateEnd}, tentukan waktu trip anda sendiri!
              </p>
            </div>
            <hr className="text-gray-500 w-full my-3" />
            <DatePicker
              onDateChange={handleDateChange}
              totalDays={trip?.tripData?.totalDays}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleCreateTrip}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-cyan-600"
              >
                Buat Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FooterButton;
