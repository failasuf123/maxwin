import React from "react";
import { GripVertical, Clock } from "lucide-react";
import { TbPigMoney } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ActivityTodo } from "../_utils/typings";

interface ActivityTodoItemProps {
  activityTodo: ActivityTodo;
  dayId: number;
  todoId: number;
  updateActivity: (dayId: number, todoId: number, field: keyof ActivityTodo, value: string | boolean | number) => void;
  confirmDelete: (dayId: number, todoId: number) => void;
  providedDraggableTodo: any;
}

const ActivityTodoItem: React.FC<ActivityTodoItemProps> = ({
  activityTodo,
  dayId,
  todoId,
  updateActivity,
  confirmDelete,
  providedDraggableTodo,
}) => {
  const hasTime = activityTodo.time_start || activityTodo.time_end;
  const hasCost = activityTodo.isPayable && activityTodo.cost;

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
        <div className="flex-1 p-1 md:p-4">
          <div className="flex flex-wrap mb-3 gap-3 justify-end">
            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <Clock className="w-3 h-3 text-gray-800 items-center" />
                  <p className="hidden md:block">Masukan Waktu</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex justify-evenly items-center gap-2 bg-white px-2 py-1 rounded-lg">
                  <input
                    type="time"
                    value={activityTodo.time_start || ""}
                    onChange={(e) => updateActivity(dayId, todoId, "time_start", e.target.value)}
                    className="bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                  />
                  <p className="items-center text-sm text-gray-800">s.d.</p>
                  <input
                    type="time"
                    value={activityTodo.time_end || ""}
                    onChange={(e) => updateActivity(dayId, todoId, "time_end", e.target.value)}
                    className="bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <TbPigMoney className="text-sm text-gray-800" />
                  <p className="hidden md:block">Estimasi Biaya</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activityTodo.isPayable}
                      onChange={(e) => updateActivity(dayId, todoId, "isPayable", e.target.checked)}
                    />
                    <label>Ada biaya?</label>
                  </div>
                  {activityTodo.isPayable && (
                    <div className="flex items-center gap-2">
                      <span>Rp</span>
                      <input
                        type="number"
                        value={activityTodo.cost || 0}
                        onChange={(e) => updateActivity(dayId, todoId, "cost", parseInt(e.target.value) || 0)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {(hasTime || hasCost) && (
            <div className="w-full mb-2 flex flex-row items-center justify-between">
              {hasTime && (
                <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-gray-800 text-white flex flex-row gap-1 items-center justify-center">
                  <FaRegClock />
                  <div>{activityTodo.time_start || "00:00"}</div>
                  <div>-</div>
                  <div>{activityTodo.time_end || "00:00"}</div>
                </div>
              )}
              {hasCost && (
                <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-green-100 text-green-800 flex flex-row gap-1 items-center justify-center">
                  <div>Rp</div>
                  <div>
                    {new Intl.NumberFormat("id-ID").format(activityTodo.cost || 0)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-2">
            <input
              value={activityTodo.nameTodo}
              onChange={(e) => updateActivity(dayId, todoId, "nameTodo", e.target.value)}
              placeholder="Tempat wisata"
              className="w-full text-xs md:text-base font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="">
            <textarea
              value={activityTodo.descriptionTodo || ""}
              onChange={(e) => updateActivity(dayId, todoId, "descriptionTodo", e.target.value)}
              placeholder="Tambahkan deskripsi..."
              className="w-full p-2 text-[10px] md:text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTodoItem;