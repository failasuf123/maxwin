'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuShrink, LuExpand } from "react-icons/lu";
import ContainerWisata from './ContainerType/ContainerWisata';
import ContainerHotel from './ContainerType/ContainerHotel';

interface TodoItem {
  id_order_todo: number;
  nameTodo: string;
  typeTodo: string;
  descriptionTodo: string;
  location?: string;
  cost: number;
  time_start?: string;
  time_end?: string;
  imgTodoUrl?: string;
  starRating?: number;
  reviewScore?: number;
  // ... tambahkan properti lain sesuai kebutuhan
}

interface DayItinerary {
  day: number;
  todos: TodoItem[];
  uniqueId: string;
  id_order_day: number;
}

interface TripData {
  title: string;
  description: string;
  itineraries: DayItinerary[];
  username: string;
  userPicture: string;
  // ... tambahkan properti lain sesuai data
}

function ContentItinerary({ trip }: { trip: TripData | null }) {
  const [allImageDetails, setAllImageDetails] = useState<{ image: string; name: string }[]>([]);
  const [openDays, setOpenDays] = useState<{ [day: number]: boolean }>({});
  const [allOpen, setAllOpen] = useState(true);

  useEffect(() => {
    if (trip?.itineraries) {
      // Mengumpulkan semua gambar
      const imageDetails: { image: string; name: string }[] = [];
      
      trip.itineraries.forEach((day) => {
        day.todos.forEach((todo) => {
          if (todo.imgTodoUrl && todo.imgTodoUrl !== "/placeholder.png") {
            imageDetails.push({ image: todo.imgTodoUrl, name: todo.nameTodo });
          }
        });
      });
      
      setAllImageDetails(imageDetails);

      // Inisialisasi status buka/tutup untuk setiap hari
      const initialOpenDays: { [day: number]: boolean } = {};
      trip.itineraries.forEach((day) => {
        initialOpenDays[day.day] = true;
      });
      setOpenDays(initialOpenDays);
    }
  }, [trip]);

  const toggleDay = (day: number) => {
    setOpenDays(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleAllDays = () => {
    const newAllOpen = !allOpen;
    setAllOpen(newAllOpen);

    const updatedOpenDays: { [day: number]: boolean } = {};
    Object.keys(openDays).forEach(day => {
      updatedOpenDays[parseInt(day)] = newAllOpen;
    });
    setOpenDays(updatedOpenDays);
  };

  const renderTodoComponent = (todo: TodoItem) => {
    // Mapping ke struktur yang diharapkan komponen
    const mappedTodo = {
      name: todo.nameTodo,
      description: todo.descriptionTodo || "",
      cost: todo.cost || 0,
      timeStart: todo.time_start || "",
      timeEnd: todo.time_end || "",
      image: todo.imgTodoUrl || "/placeholder.png",
      imageList: [], // Tidak ada data imageList di struktur baru
      type: todo.typeTodo.toLowerCase(),
    };

    switch (mappedTodo.type) {
      case "activity":
        return <ContainerWisata {...mappedTodo} allImageDetails={allImageDetails} />;
      case "hotel":
        return <ContainerHotel {...mappedTodo} allImageDetails={allImageDetails} />;
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-gray-700">Unknown Todo Type: {todo.typeTodo}</h4>
          </div>
        );
    }
  };

  return (
    <div className="mt-10">
      <button
        onClick={toggleAllDays}
        className="flex items-center gap-2 text-gray-500 text-base rounded-lg hover:text-gray-700"
      >
        {allOpen ? <LuShrink /> : <LuExpand />}
        {allOpen ? "Sembunyikan Semua Hari" : "Buka Semua Hari"}
      </button>

      {trip?.itineraries
        .sort((a, b) => a.day - b.day)
        .map((dayItinerary) => {
          const dayNumber = dayItinerary.day;
          return (
            <div key={dayItinerary.uniqueId} className="flex flex-col pt-2 mt-2 border-t-2">
              <div className="flex flex-col mb-5">
                <div className="flex items-center cursor-pointer" onClick={() => toggleDay(dayNumber)}>
                  <span className="mr-2">
                    {openDays[dayNumber] ? "▼" : "►"}
                  </span>
                  <h3 className="text-gray-700 font-semibold text-lg">
                    Hari ke-{dayNumber}
                  </h3>
                </div>
                <AnimatePresence>
                  {openDays[dayNumber] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        {dayItinerary.todos

                          .map((todo, index) => (
                            <div key={`${dayItinerary.uniqueId}-${index}`}>
                              {renderTodoComponent(todo)}
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ContentItinerary;