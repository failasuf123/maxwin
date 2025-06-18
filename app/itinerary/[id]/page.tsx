"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Itinerary, City, BudgetItem, ExpendingItem } from "@/app/itinerary/[id]/_utils/typings";
import HeaderForm from "./_components/HeaderForm";
import ItineraryForm from "./_components/ItineraryForm";
import { motion, AnimatePresence } from "framer-motion";
import { GrPlan } from "react-icons/gr";
import { TbWorldPin } from "react-icons/tb";
import ManagementForm from "./_components/ManagementForm";
import { v4 as uuidv4 } from "uuid";

type ItineraryHeaderData = Pick<
  Itinerary,
  "title" | "description" | "imageCover" | "tag" | "Cities"
>;
type ItineraryDaysData = Itinerary["itineraries"];
type PageContent = "buat-trip" | "manajemen-perjalanan";

const EXAMPLE_INITIAL_DATA: Partial<ItineraryHeaderData> = {
  title: "",
  description: "",
  imageCover: "",
  tag: [],
  Cities: [],
};

const createActivityTodo = (id_order_todo: number) => ({
  id_order_todo,
  uniqueId: uuidv4(),
  nameTodo: "",
  typeTodo: "activity" as const,
  isPayable: false,
  descriptionTodo: "",
});


function CreateItineraryPage() {
  const [headerData, setHeaderData] =
    useState<Partial<ItineraryHeaderData>>(EXAMPLE_INITIAL_DATA);
  const [daysData, setDaysData] = useState<ItineraryDaysData>([
    {
      uniqueId: uuidv4(),
      id_order_day: 1,
      day: 1,
      todos: [createActivityTodo(1)],
    },
  ]);

  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [costData, setCostData] = useState<ExpendingItem[]>([]);

  const [pageContent, setPageContent] = useState<PageContent>("buat-trip");

  // State for scroll detection
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos && currentScrollPos > 100) {
      // Scroll up dan posisi scroll lebih dari 100px
      setShowSaveButton(true);
    } else {
      // Scroll down atau di posisi awal
      setShowSaveButton(false);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleHeaderDataChange = useCallback((newData: ItineraryHeaderData) => {
    setHeaderData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const handleDaysDataChange = useCallback((newData: ItineraryDaysData) => {
    setDaysData(newData);
  }, []);

  const handleSaveItinerary = () => {
    const budgetingData =  {
      budget: budgetData,
      expend: costData,
    }
    const completeItineraryData: Partial<Itinerary> = {
      ...headerData,
      itineraries: daysData,
      budgeting: budgetingData,
      // userOwner: 'currentUserId',
      // createdAt: new Date(),
      // totalCost: calculateTotalCost(daysData),
    };

    console.log("Saving Itinerary Data:", completeItineraryData);
    alert(
      `Itinerary "${
        completeItineraryData.title || "Tanpa Judul"
      }" siap disimpan!\nTotal hari: ${
        daysData.length
      }\nCek console log untuk detail datanya`
    );
    console.log(daysData);
  };

  // Fungsi untuk menghitung total biaya (opsional)
  const calculateTotalCost = (days: ItineraryDaysData): number => {
    return days.reduce((total, day) => {
      const dayCost = day.todos.reduce((dayTotal, todo) => {
        if (todo.isPayable && todo.cost) {
          return dayTotal + todo.cost;
        }
        return dayTotal;
      }, 0);
      return total + dayCost;
    }, 0);
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Floating Save Button (appears on scroll up) */}
      <AnimatePresence>
        {showSaveButton && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
          >
            <div className="flex flex-row justify-between items-center py-4 px-5 md:px-16 lg:px-20 xl:px-32 gap-4 md:gap-8">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-base md:text-lg line-clamp-1">
                  {headerData.title || "Tanpa Judul"}
                </div>
                <div className="text-light text-gray-400 text-xs md:text-sm line-clamp-1">
                  {headerData.description || "Tanpa Deskripsi"}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveItinerary}
                className="px-4 py-2 bg-gray-800 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                disabled={daysData.length === 0}
              >
                Save Itinerary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full flex-col p-2 px-5 md:px-36 lg:px-44 xl:px-52 2xl:px-96">
        <HeaderForm
          initialData={headerData}
          onDataChange={handleHeaderDataChange}
        />

        <hr className="w-full  bg-gray-200 text-gray-200 my-5" />
        <div className="w-full flex flex-row items-center justify-start gap-2 md:gap-3">
          {/* Buat Trip Button */}
          <div
            className={`flex flex-row gap-2 items-center justify-center text-sm md:text-base px-2 py-2 md:px-3 md:py-2 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              pageContent === "buat-trip"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setPageContent("buat-trip")}
          >
            <TbWorldPin />
            Buat Trip
          </div>

          {/* Manajemen Trip Button */}
          <div
            className={`flex flex-row gap-2 items-center justify-center text-sm md:text-base px-2 py-2 md:px-3 md:py-2 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              pageContent === "manajemen-perjalanan"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setPageContent("manajemen-perjalanan")}
          >
            <GrPlan />
            Manajemen Biaya
          </div>
        </div>

        <div className="mt-3 md:mt-1">
          {/* Conditional Rendering based on pageContent */}

          {pageContent === "buat-trip" ? (
            <ItineraryForm
              onDataChange={handleDaysDataChange}
              cities={headerData.Cities}
              // Teruskan daysData ke ItineraryForm
              initialDaysData={daysData}
            />
          ) : (
            <ManagementForm
              cities={headerData.Cities}
              daysData={daysData}
              budgetData={budgetData}
              setBudgetData={setBudgetData}
              costData={costData}
              setCostData={setCostData}
            />
          )}

          {/* {pageContent === "buat-trip" ? (
            <ItineraryForm
              onDataChange={handleDaysDataChange}
              cities={headerData.Cities}
            />
          ) : (
            <ManagementForm cities={headerData.Cities} daysData={daysData} />

          )} */}
        </div>
      </div>
    </div>
  );
}

export default CreateItineraryPage;
