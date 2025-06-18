import React from "react";
import { GripVertical } from "lucide-react";
import { TiDelete } from "react-icons/ti";
import { ActivityTodo, HotelTodo } from "../_utils/typings";
import { useRouter } from "next/navigation";

interface HotelTodoItemProps {
  hotelTodo: HotelTodo;
  dayId: number;
  todoId: number;
  todoIndex: number;
  updateActivity: (
    dayId: number,
    todoId: number,
    field: keyof ActivityTodo,
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
          <div className="flex flex-wrap  justify-end">
            <div className="px-2 text-[9px] md:text-[10px] rounded-full bg-gray-800 text-white flex flex-row gap-2 items-center justify-center">
              <div>Check-in: {hotelTodo.checkInTime}</div>
            </div>
          </div>
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
          <div className="w-full flex flex-row items-center justify-end gap-2">
            <div className="px-2 py-0 text-[8px] md:text-[10px] rounded-full bg-yellow-100 text-yellow-800 flex flex-row gap-2 items-center justify-center">
              <div>{"⭐".repeat(hotelTodo.starRating)}</div>
              <div>({hotelTodo.reviewScore})</div>
            </div>
            {hasCost && (
              <div className="px-2 py-0 text-[8px] md:text-[10px] rounded-full bg-green-100 text-green-800 flex flex-row gap-2 items-center justify-center">
                <div>Rp</div>
                <div>
                  {new Intl.NumberFormat("id-ID").format(hotelTodo.cost || 0)}
                </div>
              </div>
            )}
          </div>
          <div className="mb-1 flex flex-row  gap-2 items-center">
          <div
              className="text-[10px]  rounded-full  bg-gray-300 mb-2 flex w-4 h-4 flex  justify-center items-center text-white"
            >
              {todoIndex+1}
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

          <div className="">
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

          <div className="w-full items-center flex flex-row justify-end mt-1">
            <div
              onClick={() =>  (onClickPesanHotel(hotelTodo.landingURL))} 
              className="px-2 md:px-5 py-1 text-white bg-cyan-700 rounded-xl cursor-pointer hover:bg-gray-800">
              + Pesan Hotel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelTodoItem;
