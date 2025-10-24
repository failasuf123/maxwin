import React from "react";
import { GripVertical, Clock } from "lucide-react";
import { TbPigMoney } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { LuImagePlus } from "react-icons/lu";
import { UploadDropzone } from "@/app/utils/uploadthing";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActivityTodo } from "../_utils/typings";

interface ActivityTodoItemProps {
  activityTodo: ActivityTodo;
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

const ActivityTodoItem: React.FC<ActivityTodoItemProps> = ({
  activityTodo,
  dayId,
  todoIndex,
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
      <div className="flex flex-col items-center  border-t border-gray-200">
        <div className="flex flex-row items-center justify-between pr-3 pl-8 md:pl-10 pt-2 w-full">
          {hasTime && (
            <div className="w-full mb-2 flex flex-row items-center justify-between">
              {hasTime && (
                <div className="px-2 scale-90 py-0 md:py-1  text-[8px] md:text-[10px] rounded-full bg-gray-800 text-white flex flex-row gap-1 items-center justify-center">
                  <FaRegClock />
                  <div>{activityTodo.time_start || "00:00"}</div>
                  <div>-</div>
                  <div>{activityTodo.time_end || "00:00"}</div>
                </div>
              )}
            </div>
          )}
          <div className="flex  gap-3 justify-end w-full">
            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <Clock className="w-3 h-3 text-gray-800 items-center" />
                  <p className="hidden lg:block">Masukan Waktu</p>
                  <p className="hidden md:block lg:hidden">Waktu</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex justify-evenly items-center gap-2 bg-white px-2 py-1 rounded-lg">
                  <input
                    type="time"
                    value={activityTodo.time_start || ""}
                    onChange={(e) =>
                      updateActivity(
                        dayId,
                        todoId,
                        "time_start",
                        e.target.value
                      )
                    }
                    className="bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                  />
                  <p className="items-center text-sm text-gray-800">s.d.</p>
                  <input
                    type="time"
                    value={activityTodo.time_end || ""}
                    onChange={(e) =>
                      updateActivity(dayId, todoId, "time_end", e.target.value)
                    }
                    className="bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-0 md:py-1 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <TbPigMoney className="text-sm text-gray-800" />
                  <p className="hidden lg:block">Estimasi Biaya</p>
                  <p className="hidden md:block lg:hidden">Biaya</p>
                  <p className="md:hidden text-sm">+</p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activityTodo.isPayable}
                        onChange={(e) =>
                          updateActivity(
                            dayId,
                            todoId,
                            "isPayable",
                            e.target.checked
                          )
                        }
                      />
                      <label>Ada biaya?</label>
                    </div>
                    <div className="w-full py-1 px-1 bg-yellow-50 text-[10px] text-gray-500 rounded flex gap-1 items-center justify-center">
                      <div className="px-2  rounded-full bg-yellow-300 text-gray-600 ">
                        i
                      </div>{" "}
                      Perkiraan biaya yang dihabiskan di tempat ini
                    </div>
                  </div>
                  {activityTodo.isPayable && (
                    <div className="flex items-center gap-2">
                      <span>Rp</span>
                      <input
                        type="number"
                        value={activityTodo.cost || 0}
                        onChange={(e) =>
                          updateActivity(
                            dayId,
                            todoId,
                            "cost",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <div className="ml-auto text-gray-800 text-[10px] px-2 md:px-3 py-1 md:py-2 bg-white border border-gray-800 hover:border-dashed rounded-full cursor-pointer flex flex-row gap-1 items-center">
                  <LuImagePlus className="text-sm text-gray-800" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                {!activityTodo.imgTodoUrl ? (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        // handleImageChange(res[0].url);
                        updateActivity(dayId, todoId, "imgTodoUrl", res[0].url);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error("Upload error:", error.message);
                      alert(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                      container:
                        "border-2 border-dashed border-blue-400 cursor-pointer",
                      uploadIcon: "text-blue-500",
                      label: "text-blue-600 font-medium",
                      button:
                        "bg-blue-600 text-white px-4 py-2 rounded-md mt-2 ut-ready:bg-blue-600 ut-uploading:bg-blue-400",
                      allowedContent: "text-gray-500 text-sm",
                    }}
                  />
                ) : (
                  <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div
                      onClick={() =>
                        updateActivity(dayId, todoId, "imgTodoUrl", "")
                      }
                      className="bg-red-600 w-full text-white hover:bg-red-500 cursor-pointer items-center text-center rounded-xl py-1"
                    >
                      Hapus Gambar
                    </div>
                    <p className="text-gray-500 text-[9px] md:text-[10px]">
                      *gambar yang dihapus tidak dapat dipulihkan
                    </p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex ">
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

        {activityTodo.imgTodoUrl && (
          <div className="flex flex-col justify-evenly items-center justify-center  bg-white">
            <img
              src={activityTodo.imgTodoUrl}
              alt={activityTodo.nameTodo}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl"
            />
          </div>
        )}

        <div className="flex-1 p-1 md:p-4">
          {/* end */}

          <div className="mb-2 flex gap-2 items-center">
            <div className="text-[10px]  rounded-full  bg-gray-300 mb-2 flex w-4 h-4 flex  justify-center items-center text-white">
              {todoIndex + 1}
            </div>

            <input
              value={activityTodo.nameTodo}
              onChange={(e) =>
                updateActivity(dayId, todoId, "nameTodo", e.target.value)
              }
              placeholder="Tempat wisata"
              className="w-full text-xs md:text-base font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full flex flex-wrap justify-start gap-3 md:gap-4 my-2">
            {hasCost && (
              <div className="px-2  text-[8px] md:text-[10px] rounded-full bg-green-100 text-green-800 flex flex-row gap-1 items-center justify-center">
                <div>Rp</div>
                <div>
                  {new Intl.NumberFormat("id-ID").format(
                    activityTodo.cost || 0
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="">
            <textarea
              value={activityTodo.descriptionTodo || ""}
              onChange={(e) =>
                updateActivity(dayId, todoId, "descriptionTodo", e.target.value)
              }
              placeholder="Tambahkan catatan..."
              className="w-full p-1 md:p-2 text-[10px] md:text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTodoItem;
