import React from "react";
import { GripVertical, Clock } from "lucide-react";
import { TbPigMoney } from "react-icons/tb";
import { TiDelete } from "react-icons/ti";
import { FaRegClock } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HotelTodo } from "../_utils/typings";

interface HotelTodoItemProps {
  hotelTodo: HotelTodo;
  dayId: number;
  todoId: number;
  todoIndex: number;
  updateActivity: (
    dayId: number,
    todoId: number,
    field: string,
    value: string | boolean | number
  ) => void;
  confirmDelete: (dayId: number, todoId: number) => void;
  providedDraggableTodo: any;
}

const HotelTodoItem: React.FC<HotelTodoItemProps> = ({
  hotelTodo,
  dayId,
  todoId,
  todoIndex,
  updateActivity,
  confirmDelete,
  providedDraggableTodo,
}) => {
  const hasCost = hotelTodo.isPayable && hotelTodo.cost;
  const hasCheckIn = !!hotelTodo.time_start;

  const onClickPesanHotel = (hotelLink: string) => {
    window.open(hotelLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={providedDraggableTodo.innerRef}
      {...providedDraggableTodo.draggableProps}
      className="bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
    >
      <div className="flex border-t border-gray-200">
        <div className="flex flex-col justify-evenly items-center justify-center pr-3 md:px-3 bg-white">
          <div className="flex items-center justify-center ml-1">
            <div
              onClick={() => confirmDelete(dayId, todoId)}
              className="text-xl px-0 py-0 bg-red-200 text-red-700 rounded-full hover:cursor-pointer hover:bg-red-300 hover:text-white"
            >
              <TiDelete />
            </div>
          </div>
          <div
            {...providedDraggableTodo.dragHandleProps}
            className="text-gray-400 hover:text-gray-600 cursor-grab"
          >
            <GripVertical />
          </div>
        </div>

        {/* Gambar hotel */}
        <div className="flex flex-col justify-evenly items-center justify-center  bg-white">
          {hotelTodo.imgTodoUrl ? (
            <img
              src={hotelTodo.imgTodoUrl}
              alt={hotelTodo.nameTodo}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl"
            />
          ) : (
            <div className="text-gray-400 text-2xl">🏨</div>
          )}
        </div>

        <div className="flex-1 p-1 md:p-4">
          {/* Tombol popover untuk waktu dan biaya */}
          <div className="flex flex-wrap mb-3 gap-3 justify-end">
            {/* Popover waktu check-in */}
            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <Clock className="w-3 h-3 text-gray-800 items-center" />
                  <p className="hidden md:block">Waktu Check-in</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2 p-2">
                  <label className="text-sm text-gray-700">Waktu Check-in:</label>
                  <input
                    type="time"
                    value={hotelTodo.time_start || ""}
                    onChange={(e) =>
                      updateActivity(
                        dayId,
                        todoId,
                        "time_start",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
   
                </div>
              </PopoverContent>
            </Popover>

            {/* Popover biaya */}
            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <TbPigMoney className="text-sm text-gray-800" />
                  <p className="hidden md:block">Biaya Per Malam</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-3 p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hotelTodo.isPayable}
                      onChange={(e:any) =>
                        updateActivity(
                          dayId,
                          todoId,
                          "isPayable",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                    <label className="text-sm">Tampilkan biaya?</label>
                  </div>
                  
                  {hotelTodo.isPayable && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Rp</span>
                        <input
                          type="number"
                          value={hotelTodo.cost || 0}
                          onChange={(e) =>
                            updateActivity(
                              dayId,
                              todoId,
                              "cost",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Biaya per malam"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Biaya ini akan ditampilkan sebagai biaya per malam
                      </p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Badge informasi */}
          <div className="w-full flex flex-wrap justify-between mb-2">
            {/* Badge waktu check-in */}
            {hasCheckIn && (
              <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-gray-800 text-white flex flex-row gap-1 items-center justify-center">
                <FaRegClock className="text-xs" />
                <span>checkin: {hotelTodo.time_start}</span>
              </div>
            )}
            
            {/* Badge biaya */}
            {hasCost && (
              <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-green-100 text-green-800 flex flex-row gap-1 items-center justify-center">
                <span>Rp</span>
                <span>{new Intl.NumberFormat("id-ID").format(hotelTodo.cost || 0)}</span>
              </div>
            )}
          </div>

          {/* Input nama hotel */}
          <div className="mb-1 flex flex-row gap-2 items-center">
            <div className="text-[10px] rounded-full bg-gray-300 mb-2 flex w-4 h-4 justify-center items-center text-white">
              {todoIndex + 1}
            </div>

            <input
              value={hotelTodo.nameTodo}
              onChange={(e) =>
                updateActivity(dayId, todoId, "nameTodo", e.target.value)
              }
              placeholder="Nama hotel"
              className="w-full text-xs md:text-base font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Textarea deskripsi */}
          <div className="mb-2">
            <textarea
              value={hotelTodo.descriptionTodo || ""}
              onChange={(e) =>
                updateActivity(dayId, todoId, "descriptionTodo", e.target.value)
              }
              placeholder="Tambahkan catatan..."
              className="w-full p-1 md:p-2 text-[10px] md:text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              rows={2}
            />
          </div>

          {/* Tombol pesan hotel */}
          <div className="w-full flex flex-row justify-end mt-1">
            <div
              onClick={() => onClickPesanHotel(hotelTodo.landingURL)} 
              className="px-2 md:px-5 py-1 text-white bg-cyan-700 rounded-xl cursor-pointer hover:bg-gray-800 text-xs md:text-sm"
            >
              + Pesan Hotel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelTodoItem;