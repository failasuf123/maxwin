"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { TiDelete } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa6";
import {
  ActivityTodo,
  City,
  ItineraryPerDay,
  HotelTodo,
  HotelAgodaAPI,
} from "../_utils/typings";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatePresence, motion } from "framer-motion";
import Hotel from "./hotel/Hotel";
import ActivityTodoItem from "./ActivityTodoItem";
import HotelTodoItem from "./HotelTodoItem";
import { MdPlace, MdHotel } from "react-icons/md";

interface ItineraryFormProps {
  onDataChange: (data: ItineraryPerDay[]) => void;
  cities: City[] | undefined;
  initialDaysData: ItineraryPerDay[]; 
}

// Helper function to create properly typed ActivityTodo
const createActivityTodo = (id_order_todo: number): ActivityTodo => ({
  id_order_todo,
  uniqueId: uuidv4(),
  nameTodo: "",
  typeTodo: "activity",
  isPayable: false,
  descriptionTodo: "",
});

export default function ItineraryForm({
  onDataChange,
  cities,
  initialDaysData,
}: ItineraryFormProps) {
  const [days, setDays] = useState<ItineraryPerDay[]>(initialDaysData);
    const [isClient, setIsClient] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [listCityId, setListCityId] = useState<number[]>([]);
  const [currentDayId, setCurrentDayId] = useState<number | null>(null);
  const [totalEstimatedCost, setTotalEstimatedCost] = useState<number> (0);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    dayId: number;
    todoId: number;
  } | null>(null);
  const [accordionState, setAccordionState] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const calculateTotalCost = () => {
      let total = 0;
      
      days.forEach(day => {
        day.todos.forEach(todo => {
          // Only include payable todos with valid cost
          if (todo.isPayable && typeof todo.cost === 'number' && !isNaN(todo.cost)) {
            total += todo.cost;
          }
        });
      });
      
      setTotalEstimatedCost(total);
    };

    calculateTotalCost();
  }, [days]); // Recalculate when days change

  useEffect(() => {
    if (cities) {
      const ids = cities.map((city) => city.cityId);
      setListCityId(ids);
    }
  }, [cities]);

  useEffect(() => {
    if (isClient && days.length > 0) {
      onDataChange(days);
      // Set semua accordion terbuka saat pertama kali load
      setAccordionState(days.map((day) => day.uniqueId));
    }
  }, [days, onDataChange, isClient]);

  const toggleAllAccordions = () => {
    if (accordionState.length === days.length) {
      // Jika semua terbuka, tutup semua
      setAccordionState([]);
    } else {
      // Jika ada yang tertutup, buka semua
      setAccordionState(days.map((day) => day.uniqueId));
    }
  };

  const addActivity = (dayId: number) => {
    setDays(
      days.map((day) =>
        day.id_order_day === dayId
          ? {
              ...day,
              todos: [
                ...day.todos,
                createActivityTodo(
                  day.todos.length > 0
                    ? Math.max(...day.todos.map((t) => t.id_order_todo)) + 1
                    : 1
                ),
              ],
            }
          : day
      )
    );
  };

  const addHotelToDay = (dayId: number, hotel: HotelAgodaAPI) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.id_order_day !== dayId) return day;

        const nextTodoId =
          day.todos.length > 0
            ? Math.max(...day.todos.map((t) => t.id_order_todo)) + 1
            : 1;

        const newHotelTodo: HotelTodo = {
          id_order_todo: nextTodoId,
          nameTodo: hotel.hotelName,
          descriptionTodo: `Hotel bintang ${hotel.starRating} dengan rating ${hotel.reviewScore}`,
          isPayable: true,
          cost: hotel.dailyRate,
          imgTodoUrl: hotel.imageURL,

          uniqueId: uuidv4(),
          typeTodo: "hotel",
          checkInTime: "14:00",
          checkOutTime: "12:00",

          hotelId: hotel.hotelId,
          currency: hotel.currency,
          landingURL: hotel.landingURL,
          starRating: hotel.starRating,
          reviewCount: hotel.reviewCount,
          reviewScore: hotel.reviewScore,
          crossedOutRate: hotel.crossedOutRate,
          discountPercentage: hotel.discountPercentage,
          includeBreakfast: hotel.includeBreakfast,
          freeWifi: hotel.freeWifi,
        };

        return {
          ...day,
          todos: [...day.todos, newHotelTodo],
        };
      })
    );
  };

  

  const updateActivity = (
    dayId: number,
    todoId: number,
    field: keyof ActivityTodo,
    value: string | boolean | number
  ) => {
    setDays(
      days.map((day) => {
        if (day.id_order_day !== dayId) return day;
        
        return {
          ...day,
          todos: day.todos.map((todo) =>
            todo.id_order_todo === todoId ? { ...todo, [field]: value } : todo
          ),
        };
      })
    );
  };

  const removeTodo = (dayId: number, todoId: number) => {
    setDays(
      days.map((day) => {
        if (day.id_order_day !== dayId) return day;
        return {
          ...day,
          todos: day.todos.filter((todo) => todo.id_order_todo !== todoId),
        };
      })
    );
    setDeleteConfirmation(null);
  };

  const confirmDelete = (dayId: number, todoId: number) => {
    setDeleteConfirmation({ dayId, todoId });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "day") {
      const reorderedDays = Array.from(days);
      const [removedDay] = reorderedDays.splice(source.index, 1);
      reorderedDays.splice(destination.index, 0, removedDay);
      const newDays = reorderedDays.map((d, index) => ({
        ...d,
        day: index + 1,
      }));
      setDays(newDays);

      // Perbarui state accordion untuk mempertahankan yang terbuka
      const openAccordions = accordionState.filter((id) =>
        newDays.some((day) => day.uniqueId === id)
      );
      setAccordionState(openAccordions);
    } else if (type === "todo") {
      const sourceDayIdParts = source.droppableId.split("-");
      const destDayIdParts = destination.droppableId.split("-");
      const sourceParentDayId = parseInt(
        sourceDayIdParts[sourceDayIdParts.length - 1]
      );
      const destParentDayId = parseInt(
        destDayIdParts[destDayIdParts.length - 1]
      );

      let newDays = [...days];
      const sourceDayIndex = newDays.findIndex(
        (d) => d.id_order_day === sourceParentDayId
      );
      const destDayIndex = newDays.findIndex(
        (d) => d.id_order_day === destParentDayId
      );

      if (sourceDayIndex === -1 || destDayIndex === -1) return;

      const sourceDay = { ...newDays[sourceDayIndex] };
      const destDay =
        source.droppableId === destination.droppableId
          ? sourceDay
          : { ...newDays[destDayIndex] };

      const sourceTodos = Array.from(sourceDay.todos);
      const [movedTodo] = sourceTodos.splice(source.index, 1);
      if (!movedTodo) return;

      if (source.droppableId === destination.droppableId) {
        sourceTodos.splice(destination.index, 0, movedTodo);
        sourceDay.todos = sourceTodos;
        newDays[sourceDayIndex] = sourceDay;
      } else {
        const destTodos = Array.from(destDay.todos);
        destTodos.splice(destination.index, 0, movedTodo);
        sourceDay.todos = sourceTodos;
        destDay.todos = destTodos;
        newDays[sourceDayIndex] = sourceDay;
        newDays[destDayIndex] = destDay;
      }

      setDays(newDays);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="w-full pb-24 pt-1 md:pb-6 md:pt-6 w-full md:w-3/4 lg:w-3/4 justify-start items-start">
        {/* Tombol untuk membuka/tutup semua accordion */}
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={toggleAllAccordions}
            variant="outline"
            className="flex items-center gap-2"
          >
            {accordionState.length === days.length ? (
              <>
                <ChevronUp size={16} />
                <span>Tutup Semua Hari</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Buka Semua Hari</span>
              </>
            )}
          </Button>

          <div className="flex text-[10px] md:text-sm gap-2 md:gap-3">
            <div>Total biaya:</div>
            <div className="font-semibold">Rp {totalEstimatedCost.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="itinerary-days" type="day">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                <Accordion
                  type="multiple"
                  value={accordionState}
                  onValueChange={setAccordionState}
                  className="w-full"
                >
                  {days.map((day, dayIndex) => (
                    <Draggable
                      key={`day-${day.uniqueId}`}
                      draggableId={`day-${day.uniqueId}`}
                      index={dayIndex}
                    >
                      {(providedDraggableDay) => (
                        <div
                          ref={providedDraggableDay.innerRef}
                          {...providedDraggableDay.draggableProps}
                          className="bg-white rounded-lg overflow-hidden transition-all hover:shadow-md mb-4"
                        >
                          <AccordionItem
                            value={day.uniqueId}
                            className="border-0"
                          >
                            <div className="flex justify-between items-center p-3 md:p-4 border-b bg-gray-50 rounded-t-lg">
                              <div className="flex justify-start items-center gap-3">
                                <div {...providedDraggableDay.dragHandleProps}>
                                  <GripVertical className="text-gray-400 cursor-grab hover:text-gray-600 transition-colors" />
                                </div>
                                <div className="flex items-center gap-3">
                                  <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                    Hari ke-{day.day}
                                  </h3>
                                </div>
                                <AccordionTrigger className="hover:no-underline p-0 text-gray-800"></AccordionTrigger>
                              </div>

                              <div className="flex items-center gap-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      className="text-[10px] md:text-sm bg-gray-800 hover:bg-gray-700 text-white rounded px-2 py-2 md:px-3 md:py-2 rounded"
                                    >
                                      + Aktivitas
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-48">
                                    <div className="flex flex-col gap-1 items-start justify-start">
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() =>
                                          addActivity(day.id_order_day)
                                        }
                                      >
                                        <MdPlace className="mr-2" /> Wisata
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                          setShowTodoModal(true);
                                          setCurrentDayId(day.id_order_day);
                                        }}
                                      >
                                        <MdHotel className="mr-2" /> Hotel
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>

                            <AccordionContent className="p-0">
                              <Droppable
                                droppableId={`day-todos-${day.id_order_day}`}
                                type="todo"
                              >
                                {(providedDroppableTodos) => (
                                  <div
                                    ref={providedDroppableTodos.innerRef}
                                    {...providedDroppableTodos.droppableProps}
                                    className="p-2 md:p-4 space-y-3 min-h-[100px]"
                                  >
                                    {day.todos.map((todo, todoIndex) => (
                                      <Draggable
                                        key={`todo-${todo.uniqueId}`}
                                        draggableId={`todo-${todo.uniqueId}`}
                                        index={todoIndex}
                                      >
                                        {(providedDraggableTodo) => {
                                          if (todo.typeTodo === "activity") {
                                            return (
                                              <ActivityTodoItem
                                                activityTodo={todo as ActivityTodo}
                                                dayId={day.id_order_day}
                                                todoId={todo.id_order_todo}
                                                updateActivity={updateActivity}
                                                confirmDelete={confirmDelete}
                                                providedDraggableTodo={providedDraggableTodo}
                                                todoIndex = {todoIndex}
                                                />
                                                );
                                              } else if (todo.typeTodo === "hotel") {
                                                return (
                                                  <HotelTodoItem
                                                  hotelTodo={todo as HotelTodo}
                                                  dayId={day.id_order_day}
                                                  todoId={todo.id_order_todo}
                                                  updateActivity={updateActivity}
                                                  confirmDelete={confirmDelete}
                                                  providedDraggableTodo={providedDraggableTodo}
                                                  todoIndex = {todoIndex}
                                              />
                                            );
                                          }
                                          return null;
                                        }}
                                      </Draggable>
                                    ))}
                                    {providedDroppableTodos.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </AccordionContent>
                          </AccordionItem>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </Accordion>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                const newDayOrder =
                  days.length > 0
                    ? Math.max(...days.map((d) => d.id_order_day)) + 1
                    : 1;
                const newDayNumber =
                  days.length > 0 ? Math.max(...days.map((d) => d.day)) + 1 : 1;
                const newDay = {
                  uniqueId: uuidv4(),
                  id_order_day: newDayOrder,
                  day: newDayNumber,
                  todos: [createActivityTodo(1)],
                };

                setDays([...days, newDay]);
                // Buka accordion untuk hari baru
                setAccordionState([...accordionState, newDay.uniqueId]);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Tambah Hari Baru</span>
            </Button>
          </div>
        </DragDropContext>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deleteConfirmation}
          onOpenChange={(open) => !open && setDeleteConfirmation(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus Aktivitas</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini
                tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation(null)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirmation) {
                    removeTodo(
                      deleteConfirmation.dayId,
                      deleteConfirmation.todoId
                    );
                  }
                }}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showTodoModal && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => {
              setShowTodoModal(false);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.div>

          <AnimatePresence>
            <motion.div
              className={`fixed inset-y-0 z-50 bg-white ${
                window.innerWidth >= 1024
                  ? "right-0 w-3/5 max-h-screen"
                  : "inset-x-0 bottom-0 h-screen"
              }`}
              initial={
                window.innerWidth >= 1024
                  ? { x: "100%" }
                  : { y: "100%" }
              }
              animate={
                window.innerWidth >= 1024
                  ? { x: 0 }
                  : { y: 0 }
              }
              exit={
                window.innerWidth >= 1024
                  ? { x: "100%" }
                  : { y: "100%" }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative flex flex-col h-full justify-start items-start px-4 my-2">
                <div className="flex mt-3 w-full">
                  <button
                    onClick={() => setShowTodoModal(false)}
                    className="items-start text-sm md:text-base text-gray-500 px-3 cursor-pointer flex items-center flex-row gap-3 "
                  >
                    <FaArrowLeft /> tutup
                  </button>
                </div>

                <hr className="w-full bg-gray-200 mt-2" />

                <Hotel
                  city=""
                  cityId={listCityId}
                  startDate=""
                  endDate=""
                  onHotelSelect={(hotel: HotelAgodaAPI) => {
                    if (currentDayId) {
                      addHotelToDay(currentDayId, hotel);
                    }
                    setShowTodoModal(false);
                  }}
                />

                <hr className="w-full bg-gray-500 my-2" />
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}