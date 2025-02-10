"use client";

import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/app/service/firebaseConfig";
import UlasanForm from "@/components/share-trip/form/FormUlasan";
import ContentWisata from "@/components/share-trip/container/ContentWisata";
import ContentUlasan from "@/components/share-trip/container/ContentCatatan";
import WisataForm from "@/components/share-trip/form/FormWisata";
import ContentTransportasi from "@/components/share-trip/container/ContentTransportasi";
import { calculateTotalDays } from "@/components/service/calculateTotalDays";
import { generateDateList } from "@/components/service/generateDateList";
import { LuCalendarX, LuCalendarDays } from "react-icons/lu";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { serverTimestamp } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";

import {
  Todo,
  getTodoStyling,
  categories,
} from "@/components/create/utils/utility";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import convertTo24HourFormat from "@/components/service/convertTo24HourFormat";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { eachDayOfInterval, format } from "date-fns";
import HeaderUpper from "@/components/edit/HeaderUpper";
import HotelForm from "@/components/share-trip/form/FormHotel";
import TransportasiForm from "@/components/share-trip/form/FormTransportasi";
import LoadingAnimationBlack from "@/components/LoadingAnimationBlack";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "@/components/edit/DatePicker";
import ContentHotel from "../share-trip/container/ContentHotel";
import { updateTodosWithRange } from "@/components/service/updateTodosWithRange";

interface Props {
  tripidProps: string;
  typeProps: string;
}
function EditMain({ tripidProps, typeProps }: Props) {
  const searchParams = useSearchParams();
  const selectedStartDate = searchParams.get("startDate");
  const selectedEndDate = searchParams.get("endDate");
  const [tripid, setTripid] = useState("");
  const [typeContent, setTypeContent] = useState(""); // NOTE: terdapat 4 tipe yaitu [AItrip, manualTrip, editTrip, implementTrip]
  const [trip, setTrip] = useState<{ [key: string]: any } | null>(null);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState([""]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [category, setCategory] = useState("");
  const [publicState, setPublicState] = useState(false);
  const [publishState, setPublishState] = useState(false);
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState<{
    name?: string;
    picture?: string;
    id?: string;
    email?: string;
  } | null>(null);
  const username = user?.name || "no name";
  const userpicture = user?.picture || "/default-picture.png";
  const generateDocId = nanoid(16);
  const [docId, setDocId] = useState(generateDocId);
  const [imageUrlCover, setImageUrlCover] = useState("");
  const [imageKeyCover, setImageKeyCover] = useState("");
  const [todos, setTodos] = useState<
    Record<
      string,
      Array<{
        id: string;
        type: string;
        name: string;
        description: string;
        cost: number;
        timeStart: string;
        timeEnd: string;
        tag: string[];
        image: string;
        imageList: string[];
      }>
    >
  >({});
  const { toast } = useToast();
  const router = useRouter();

  const [showTodoModal, setShowTodoModal] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoType, setTodoType] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingRender, setIsLoadingRender] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWisataIndex, setEditingWisataIndex] = useState<string | null>(
    null
  );
  const [editingWisataDate, setEditingWisataDate] = useState<string | null>(
    null
  );

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }

    if (!tripidProps || !typeProps) {
      router.push("/404");
    } else {
      setTripid(tripidProps);
      setTypeContent(typeProps);
    }
  }, []);

  useEffect(() => {
    if (tripid != "manualTrip" && typeContent != "manualTrip") {
      tripid && getTripData();
    }
    setIsLoadingRender(false);
  }, [tripid]);

  const getTripData = async () => {
    const docRef = doc(db, "Trips", tripid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTrip(docSnap.data());
    } else {
      toast({
        title: "Uh oh! Trip tidak ditemukan.",
      });
    }
  };

  useEffect(() => {
    if (trip && trip.tripData) {
      const tripData = trip.tripData;

      if (typeContent === "implementTrip") {
        setCity(tripData.city || "");
        if (selectedStartDate != null && selectedEndDate != null) {
          setDateStart(selectedStartDate);
          setDateEnd(selectedEndDate);
        } else {
          setDateStart(tripData.dateStart || "");
          setDateEnd(tripData.dateEnd || "");
        }
        setCategory(tripData.category || "");
        setTotalDays(tripData.totalDays || 0);
      } else if (typeContent === "AITrip") {
        setDocId(trip.id || generateDocId);
        setTitle(tripData.title || "");
        setImageUrlCover(tripData.imageCover);
        setCity(tripData.city || "");
        setDateStart(tripData.dateStart || "");
        setDateEnd(tripData.dateEnd || "");
        setCategory(tripData.category || "");
        setDescription(tripData.description || description);
        setTotalDays(tripData.totalDays || 0);
      } else if (typeContent === "editTrip") {
        setDocId(trip.id || generateDocId);
        setTitle(tripData.title || "");
        setImageUrlCover(tripData.imageCover);
        setCity(tripData.city || "");
        setDateStart(tripData.dateStart || "");
        setDateEnd(tripData.dateEnd || "");
        setCategory(tripData.category || "");
        setDescription(tripData.description || description);
        setTotalDays(tripData.totalDays || 0);
        setPublishState(tripData.publish);
        setPublicState(tripData.public);
        console.log(trip.public);
        console.log(trip.publish);
      } else if (typeContent === "manualTrip") {
        return;
      }

      let totalCost = 0;

      const mappedTodos = Object.fromEntries(
        Object.entries(tripData.todos || {}).map(([date, activities]) => [
          date,
          (activities as Array<any>).map((activity: any) => {
            const cost =
              typeof activity.cost === "number"
                ? activity.cost
                : Number(String(activity.cost || "").replace(/[^0-9.]/g, "")) ||
                  0;

            totalCost += cost; // Add the current activity cost to totalCost
            return {
              id: activity.id || nanoid(14),
              type: activity.type,
              name: activity.name,
              description: activity.description,
              cost,
              timeStart: convertTo24HourFormat(activity.timeStart),
              timeEnd: convertTo24HourFormat(activity.timeEnd),
              tag: activity.tag || [],
              image: activity.image,
              imageList: activity.imageList || [],
            };
          }),
        ])
      );

      const todosWithRange = updateTodosWithRange(
        mappedTodos,
        selectedStartDate,
        selectedEndDate
      );

      // setTodos(mappedTodos);
      setTodos(todosWithRange);
      setTotalPrice(totalCost);
      setIsLoadingRender(false);
    }
  }, [trip]);

  const dateList =
    dateStart && dateEnd ? generateDateList(dateStart, dateEnd) : [];

  useEffect(() => {
    const days = calculateTotalDays(dateStart, dateEnd);
    setTotalDays(days);
  }, [dateList]);

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

    setTotalDays(data.totalDays);
    setDateStart(formattedStartDate ?? "");
    setDateEnd(formattedEndDate ?? "");
  };

  const handleAddTodo = (type: string, date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];

    setNewTodo({
      id: nanoid(14),
      type,
      name: "",
      description: "",
      cost: 0,
      timeStart: new Date().toISOString().substr(11, 5),
      timeEnd: "",
      tag: [],
      image: "",
      imageList: [],
      date: formattedDate,
    });
    setTodoType(type);
    setShowTodoModal(true);
  };

  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo) return;

    const dateKey = newTodo.date;
    const updated = structuredClone(todos);

    if (!updated[dateKey]) {
      updated[dateKey] = [];
    }

    if (editingWisataIndex === null) {
      const isDuplicate = updated[dateKey].some(
        (todo) =>
          todo.name === newTodo.name &&
          todo.type === newTodo.type &&
          todo.timeStart === newTodo.timeStart
      );

      if (!isDuplicate) {
        updated[dateKey].push({ ...newTodo, id: crypto.randomUUID() });
      }
    } else {
      const indexToUpdate = updated[editingWisataDate!]?.findIndex(
        (todo) => todo.id === editingWisataIndex
      );

      if (indexToUpdate !== -1) {
        updated[editingWisataDate!][indexToUpdate] = { ...newTodo };
      } else {
        console.error("Item wisata tidak ditemukan untuk diedit.");
      }
    }

    let costSum = 0;
    Object.values(updated).forEach((arr) =>
      arr.forEach(
        (t) =>
          (costSum += typeof t.cost === "string" ? parseFloat(t.cost) : t.cost)
      )
    );

    setTodos(updated);
    setTotalPrice(costSum);
    setShowTodoModal(false);
    setNewTodo(null);
    setEditingWisataIndex(null);
    setEditingWisataDate(null);
  };

  const handleEditWisata = (dateKey: string, id: string) => {
    const item = todos[dateKey]?.find((todo) => todo.id === id);

    if (!item) {
      console.error("Item wisata tidak ditemukan.");
      return;
    }

    setEditingWisataDate(dateKey);
    setEditingWisataIndex(item.id);
    setNewTodo({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      cost: item.cost,
      timeStart: item.timeStart,
      timeEnd: item.timeEnd,
      tag: item.tag,
      image: item.image,
      imageList: item.imageList,
      date: dateKey,
    });

    setTodoType(item.type);
    setShowTodoModal(true);
  };

  const handleDeleteTodo = (dateKey: string, id: string) => {
    let costToReduce = 0;

    setTodos((prevTodos) => {
      const updatedTodos = { ...prevTodos };
      const todoToDelete = updatedTodos[dateKey].find((todo) => todo.id === id);

      if (todoToDelete) {
        costToReduce =
          typeof todoToDelete.cost === "string"
            ? parseFloat(todoToDelete.cost) || 0
            : todoToDelete.cost;

        updatedTodos[dateKey] = updatedTodos[dateKey].filter(
          (todo) => todo.id !== id
        );

        if (updatedTodos[dateKey].length === 0) {
          delete updatedTodos[dateKey];
        }
      }

      setTotalPrice(totalPrice - costToReduce);
      return updatedTodos;
    });
  };

  const deleteTrip = async () => {
    if (!docId) {
      return;
    }

    try {
      const docRef = doc(db, "Trips", docId);
      setIsLoadingDelete(true);

      await deleteDoc(docRef);
      toast({
        description: "Trip berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Terjadi kesalahan saat menghapus trip.",
      });
    } finally {
      router.push("/dashboard");
      setIsLoadingDelete(false);
    }
  };

  const submitExperiance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSubmit(true);

    const cleanedTodos = Object.keys(todos).reduce((acc, date) => {
      const uniqueTasks = Array.from(
        new Set(
          todos[date].map((todo) =>
            JSON.stringify({
              name: todo.name,
              type: todo.type,
              description: todo.description,
              cost: todo.cost,
              image: todo.image,
              imageList: todo.imageList,
              tag: todo.tag,
              timeStart: todo.timeStart,
              timeEnd: todo.timeEnd,
            })
          )
        )
      ).map((task) => JSON.parse(task));
      acc[date] = uniqueTasks;
      return acc;
    }, {} as typeof todos);
    const imageCover = imageUrlCover;

    const response = {
      activitiesOptions: [],
      category,
      city,
      dateEnd,
      dateStart,
      description,
      imageCover,
      public: publicState,
      publish: publishState,
      totalDays,
      totalPrice,
      totalHotelPricePayAble: 0,
      totalActivitiesPricePayAble: 0,
      totalPayAblePrice: 0,
      todos: cleanedTodos,
      title,
      // username,
      lastUpdate: serverTimestamp(),
    };

    await setDoc(doc(db, "Trips", docId), {
      id: docId,
      contributor: [],
      userId: user?.id,
      // userPicture: userpicture,
      // userEmail: user?.email,
      tripData: response,
    });
    console.log("after submit: ",response)
    router.push("/dashboard");
  };

  const renderTodoForm = () => {
    if (!todoType || !newTodo) return null;

    switch (todoType) {
      case "wisata":
        return (
          <>
            <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />
          </>
        );

      case "transportasi":
        return <TransportasiForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "kuliner":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "pengalaman":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "belanjasewa":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "catatan":
        return <UlasanForm newTodo={newTodo} setNewTodo={setNewTodo} />;

      case "hotel":
        return <HotelForm newTodo={newTodo} setNewTodo={setNewTodo} />;
    }
  };

  const handleUpdate = (
    newTitle: string,
    newCity: string[],
    newDescription: string,
    newCategory: string,
    newDateStart: string,
    newDateEnd: string,
    newImageUrlCover: string,
    newPublicState: boolean,
    newPublishState: boolean
  ) => {
    setTitle(newTitle);
    setCity(newCity);
    setDescription(newDescription);
    setCategory(newCategory);
    setDateStart(newDateStart);
    setDateEnd(newDateEnd);
    setImageUrlCover(newImageUrlCover);
    setPublicState(newPublicState);
    setPublishState(newPublishState);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between p-2 px-5 md:px-36 lg:px-44 xl:px-52 2xl:px-96">
      {isLoadingDelete && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div className="font-semibold text-lg md:text-xl text-black">
            Menghapus Data
          </div>
        </div>
      )}
      {isLoadingRender && (
        <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingAnimationBlack />
          <div className="font-semibold text-lg md:text-xl text-black">
            Memuat...
          </div>
        </div>
      )}
      {/* Display itinerary details */}
      <div className="flex flex-col w-full items-center py-8 ">
        {/* Header Upper */}
        <div className="w-full">
          <HeaderUpper
            onUpdate={handleUpdate}
            data={{
              title,
              imageUrlCover,
              description,
              username,
              city,
              dateStart,
              dateEnd,
              totalDays,
              category,
              publicState,
              publishState,
              totalPrice,
            }}
          />
        </div>
        {/* End Header Upper */}

        <div className="w-full">
          {dateList.length > 0 ? (
            <></>
          ) : (
            <div className="mt-10 mb-10">
              <div className="relative w-full flex flex-col justify-center items-center px-5 bg-gray-100  rounded-xl py-5 px-3 mx-3 ">
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <div className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-600 animate-ping"></div>
                    <div className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-600"></div>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-3 text-4xl md:text-5xl font-semibold">
                  <LuCalendarX className=" text-4xl md:text-5xl font-semibold animate-pulse" />
                  <PiArrowBendDownRightBold className=" text-4xl md:text-5xl font-semibold animate-pulse" />

                  <LuCalendarDays className=" text-4xl md:text-5xl font-semibold animate-pulse" />
                </div>
                <div className="my-3 text-sm font-semibold text-center mx-10">
                  "Masukkan rentang tanggal liburan Anda agar Anda dapat memulai
                  perencanaan aktivitas."
                </div>
                <DatePicker onDateChange={handleDateChange} />
                <div className="my-2">
                  <p className="text-xs text-gray-500 mb-3 md:mb-4 text-center">
                    Pilih rentang waktu liburan kamu{" "}
                    <span className="text-gray-600 font-semibold">
                      Maksimal 21 Hari
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Display Dates */}
        <div className="space-y-4  w-full">
          {dateList.map((date, index) => {
            const dateKey = date.toISOString().split("T")[0];

            return (
              <div
                key={index}
                className="flex flex-col pt-2 mt-5 border-t-2 w-full"
              >
                <div className="flex justify-between items-center w-full">
                  {/* Tanggal */}
                  <div className="text-start">
                    <h3 className="text-gray-700 font-semibold text-base">
                      Hari ke-{index + 1}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {date.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="btn">
                      <div className="px-2 py-1 md:px-3 md:py-2 bg-black hover:bg-cyan-500 text-white text-base md:text-lg rounded-lg">
                        + Aktivitas
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Pilih Aktivitas</DropdownMenuLabel>
                      {[
                        { label: "🏝️ Wisata", value: "wisata" },
                        { label: "🛏️ Hotel", value: "hotel" },
                        // { label: "💡 Pengalaman", value: "pengalaman" },
                        // { label: "🍗 Kuliner", value: "kuliner" },
                        { label: "🚕 Transportasi", value: "transportasi" },
                        // { label: "🛍️ Belanja/Sewa", value: "belanjasewa" },
                        // { label: "🖋️ Catatan", value: "catatan" },
                      ].map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => handleAddTodo(option.value, date)}
                          className="cursor-pointer"
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {todos[dateKey]
                    ?.slice()
                    .sort((a, b) => a.timeStart.localeCompare(b.timeStart))
                    .map((todo, i) => {
                      if (todo.type === "wisata") {
                        return (
                          <ContentWisata
                            date={""}
                            key={i}
                            {...todo}
                            onDelete={() => handleDeleteTodo(dateKey, todo.id)}
                            onEdit={() => handleEditWisata(dateKey, todo.id)}
                          />
                        );
                      } else if (todo.type === "catatan") {
                        return (
                          <ContentUlasan
                            date={""}
                            key={i}
                            onDelete={() => handleDeleteTodo(dateKey, todo.id)}
                            onEdit={() => handleEditWisata(dateKey, todo.id)}
                            {...todo}
                          />
                        );
                      } else if (todo.type === "transportasi") {
                        return (
                          <ContentTransportasi
                            date={""}
                            key={i}
                            onDelete={() => handleDeleteTodo(dateKey, todo.id)}
                            onEdit={() => handleEditWisata(dateKey, todo.id)}
                            {...todo}
                          />
                        );
                      } else if (todo.type === "hotel") {
                        return (
                          <ContentHotel
                            date={""}
                            key={i}
                            onDelete={() => handleDeleteTodo(dateKey, todo.id)}
                            onEdit={() => handleEditWisata(dateKey, todo.id)}
                            {...todo}
                          />
                        );
                      } else {
                        return (
                          <div
                            key={i}
                            className={`border p-4 flex flex-row justify-between rounded-lg ${getTodoStyling(
                              todo.type
                            )}`}
                          >
                            <div>
                              <h4 className="font-bold">
                                {todo.name || "No Title"}
                              </h4>
                              <p className="text-sm">
                                {todo.description || "No description"}
                              </p>
                              <p className="text-sm">Biaya: {todo.cost}</p>
                              <p className="text-sm">Waktu: {todo.timeStart}</p>
                            </div>

                            <div
                              className="text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
                              onClick={() => handleDeleteTodo(dateKey, todo.id)}
                            >
                              x
                            </div>
                            <div
                              onClick={() => handleEditWisata(dateKey, todo.id)}
                            >
                              edit
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-10 w-full flex flex-row gap-2">
          {/* Tombol Simpan */}
          <button
            type="button"
            onClick={submitExperiance}
            className={`w-full p-2 rounded-lg flex justify-center items-center text-white  ${
              isLoadingSubmit
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-cyan-500"
            }`}
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
            ) : (
              "Simpan"
            )}
          </button>

          {/* Tombol Hapus Trip */}
          {typeContent === "editTrip" && (
            <div>
              {/* Tombol Hapus Trip */}
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => setIsDialogOpen(open)}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="p-2 w-10 h-10 bg-red-600 text-white rounded-lg cursor-pointer flex justify-center items-center hover:bg-red-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <FaTrash />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col justify-center">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Peringatan! Menghapus Keseluruhan Rencana Perjalanan
                    </DialogTitle>
                    <DialogDescription className="flex justify-center items-center mt-5">
                      <div>
                        <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-xl">
                          <input
                            type="checkbox"
                            id="confirmationCheckbox"
                            className="w-7 h-7 mt-1 cursor-pointer rounded border-gray-300 focus:ring-red-500"
                            onChange={(e) => setIsChecked(e.target.checked)} // State untuk checkbox
                          />
                          <span className="text-sm text-gray-700">
                            Saya mengerti bahwa penghapusan ini bersifat
                            permanen dan tidak dapat dibatalkan.
                          </span>
                        </label>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-center items-center">
                    <button
                      type="button"
                      onClick={() => {
                        deleteTrip(); // Panggil fungsi penghapusan
                        setIsDialogOpen(false); // Tutup dialog
                      }}
                      className={`px-3 py-2 rounded-lg flex justify-center items-center text-white ${
                        isChecked
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isChecked} // Tombol dinonaktifkan jika checkbox belum dicentang
                    >
                      Hapus Permanen
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* End Submit Button */}
      </div>

      <Drawer
        open={showTodoModal}
        onClose={() => {
          setShowTodoModal(false);
          setEditingWisataIndex(null);
          setEditingWisataDate(null);
        }}
      >
        <DrawerContent className="h-[100vh] md:h-[90vh]">
          <form onSubmit={handleTodoSubmit} className="relative  flex flex-col">
            {/* Konten yang bisa di-scroll */}
            <div className="flex-1">
              <div className="px-2 bg-white space-y-2 flex flex-col items-center justify-center">
                {renderTodoForm()}
              </div>
            </div>

            {/* Footer dengan tombol Simpan */}
            <DrawerFooter className="flex items-center justify-center mb-5">
              <button
                type="submit"
                className="w-1/2 px-4 py-1 bg-black hover:bg-cyan-500 text-white rounded-lg mb-2"
              >
                Simpan
              </button>
            </DrawerFooter>

            {/* Tombol Close */}
            <DrawerClose asChild>
              <button className="absolute top-0 right-5 sm:text-lg md:text-xl text-gray-600">
                x
              </button>
            </DrawerClose>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default EditMain;
