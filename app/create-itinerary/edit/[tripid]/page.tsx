"use client";

import HomeUpper from "@/components/share-trip/HomeUpper";
import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/app/service/firebaseConfig";
import { UploadDropzone } from "@/app/utils/uploadthing";
import UlasanForm from "@/components/share-trip/form/FormUlasan";
import { GetPlacesDetails, PHOTO_REF_URL } from "@/app/service/GlobalApi";
import { FaPen, FaMagic } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentWisata from "@/components/share-trip/container/ContentWisata";
import ContentUlasan from "@/components/share-trip/container/ContentCatatan";
import WisataForm from "@/components/share-trip/form/FormWisata";
import ContentTransportasi from "@/components/share-trip/container/ContentTransportasi";
import { calculateTotalDays } from "@/components/service/calculateTotalDays";
import { generateDateList } from "@/components/service/generateDateList";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  Todo,
  getTodoStyling,
  categories,
} from "@/components/create/utils/utility";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import convertTo24HourFormat from "@/components/service/convertTo24HourFormat";

interface PageProps {
  params: {
    tripid: string;
  };
}


const Page: React.FC<PageProps> = ({ params }) => {
  const { tripid } = params;
  const router = useRouter();

  // ---------- State for Trip Data ----------
  const [trip, setTrip] = useState<{ [key: string]: any } | null>(null);

  // Title
  const [title, setTitle] = useState("Judul Statis");
  const [tempTitle, setTempTitle] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);

  // City
  const [city, setCity] = useState("Pilih Kota");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  // Basic Info
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // State / Publish
  const [publicState, setPublicState] = useState(false);
  const [publishState, setPublishState] = useState(false);

  // Image Cover
  const [imageUrlCover, setImageUrlCover] = useState("");
  const [imageKeyCover, setImageKeyCover] = useState("");

  // Todos / Activities
  const [todos, setTodos] = useState<
    Record<
      string,
      Array<{
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

  const [showTodoModal, setShowTodoModal] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoType, setTodoType] = useState<string | null>(null);

  // For editing an existing wisata item
  const [editingWisataIndex, setEditingWisataIndex] = useState<number | null>(null);
  const [editingWisataDate, setEditingWisataDate] = useState<string | null>(null);

  // Additional UI states
  const [showPopup, setShowPopup] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // user info
  const [user, setUser] = useState<{
    name?: string;
    picture?: string;
    id?: string;
    email?: string;
  } | null>(null);
  const username = user?.name || "no name";
  const userpicture = user?.picture || "/default-picture.png";
  const userid = user?.id || "noid";

  // Generate doc ID if needed
  const nanoFirst = nanoid(6);
  const nanoLast = nanoid(6);
  const generateDocId = nanoFirst + Date.now().toString() + nanoLast;
  const [docId, setDocId] = useState(generateDocId);

  // -------------------- Effects --------------------
  // Load local user
  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
  }, []);

  // Fetch existing trip from Firestore
  useEffect(() => {
    tripid && getTripData();
  }, [tripid]);

  const getTripData = async () => {
    const docRef = doc(db, "Trips", tripid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTrip(docSnap.data());
    } else {
      toast.error("Upss! Trip tidak ditemukan", {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Populate local state from trip data
  useEffect(() => {
    if (trip && trip.tripData) {
      const tripData = trip.tripData;
      setDocId(trip.id || generateDocId);

      // Title & Image
      setTitle(tripData.title || "");
      setImageUrlCover(tripData.imageCover);

      // City & Date
      setCity(tripData.city || "");
      setDateStart(tripData.dateStart || "");
      setDateEnd(tripData.dateEnd || "");

      // Category & Description
      setCategory(tripData.category || "");
      setDescription(tripData.description || "");

      // Days & Price
      setTotalDays(tripData.totalDays || 0);

      // Recalculate total cost
      let totalCost = 0;
      const mappedTodos = Object.fromEntries(
        Object.entries(tripData.todos || {}).map(([date, activities]) => [
          date,
          (activities as Array<any>).map((activity: any) => {
            const cost =
              typeof activity.cost === "number"
                ? activity.cost
                : Number(String(activity.cost || "").replace(/[^0-9.]/g, "")) || 0;

            totalCost += cost;

            return {
              type: activity.type,
              name: activity.name,
              description: activity.description,
              cost,
              timeStart: convertTo24HourFormat(activity.timeStart),
              timeEnd: convertTo24HourFormat(activity.timeEnd),
              tag: activity.tag || [],
              image: "",
              imageList: activity.imageList || [],
            };
          }),
        ])
      );
      setTodos(mappedTodos);
      setTotalPrice(totalCost);
    }
  }, [trip]);

  // Recalculate total days
  const dateList = dateStart && dateEnd ? generateDateList(dateStart, dateEnd) : [];
  useEffect(() => {
    const days = calculateTotalDays(dateStart, dateEnd);
    setTotalDays(days);
  }, [dateList]);

  // -------------------- Edit Title & City --------------------
  const openTitleModal = () => {
    setTempTitle(title);
    setShowTitleModal(true);
  };
  const saveTitle = () => {
    setTitle(tempTitle);
    setShowTitleModal(false);
  };

  const openCityModal = () => {
    setSelectedCity(null);
    setShowCityModal(true);
  };
  const saveCity = () => {
    if (selectedCity) setCity(selectedCity);
    setShowCityModal(false);
  };

  // -------------------- Add / Delete Todo --------------------
  const handleAddTodo = (type: string, date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setNewTodo({
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
  
    // 1) Make a local copy of `todos`
    //    So we can modify it and see the result right away
    const updated = structuredClone(todos); 
    // or: const updated = JSON.parse(JSON.stringify(todos));
    // or, if you know the shape well: { ...todos } + manually copy deeper arrays
  
    // 2) Make sure the dateKey array exists
    if (!updated[dateKey]) {
      updated[dateKey] = [];
    }
  
    // 3) Either edit or add
    if (editingWisataIndex !== null) {
      // We are editing an existing item
      updated[dateKey][editingWisataIndex] = { ...newTodo };
    } else {
      // We are adding a brand-new item
      const isDuplicate = updated[dateKey].some(
        (todo) =>
          todo.name === newTodo.name &&
          todo.type === newTodo.type &&
          todo.timeStart === newTodo.timeStart
      );
      if (!isDuplicate) {
        updated[dateKey].push(newTodo);
      }
    }
  
    // 4) Recalculate totalPrice by iterating the updated structure
    let costSum = 0;
    Object.values(updated).forEach((arr) =>
      arr.forEach((t) => (costSum += t.cost))
    );
  
    // 5) Now set the new state in ONE call
    setTodos(updated);
    setTotalPrice(costSum);
  
    // 6) Reset states
    setShowTodoModal(false);
    setNewTodo(null);
    setEditingWisataIndex(null);
    setEditingWisataDate(null);
  };
  
  

  const handleDeleteTodo = (dateKey: string, index: number) => {
    let costToReduce = 0;
    setTodos((prev) => {
      const updated = { ...prev };
      const todoToDelete = updated[dateKey][index];
      costToReduce = Number(todoToDelete.cost) || 0;
      updated[dateKey] = updated[dateKey].filter((_, i) => i !== index);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
    });

    setTotalPrice((prev) => {
      const newPrice = prev - costToReduce;
      return newPrice >= 0 ? newPrice : 0;
    });
  };

  // -------------------- Edit an Existing Wisata --------------------
  // Opens a modal with the wisata data pre-filled
  const handleEditWisata = (dateKey: string, index: number) => {
    setEditingWisataDate(dateKey);
    setEditingWisataIndex(index);

    const item = todos[dateKey][index];
    setNewTodo({
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

  // TIDAK DIBUTUHKAN
  useEffect(() => {
    if (!showTodoModal && editingWisataIndex !== null && newTodo) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTodoModal]);

  // -------------------- Final Submit --------------------
  const submitExperiance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Remove duplicates if needed
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

    const response = {
      category,
      city,
      dateEnd,
      dateStart,
      description,
      imageCover: imageUrlCover,
      totalDays,
      totalPrice,
      todos: cleanedTodos,
      title,
      username,
    };

    await setDoc(doc(db, "Trips", docId), {
      id: docId,
      lastUpdate: Date.now(),
      public: publicState,
      publish: publishState,
      contributor: [],
      userId: user?.id,
      userPicture: userpicture,
      userEmail: user?.email,
      tripData: response,
    });
    router.push("/dashboard");
  };

  // -------------------- UI Helpers --------------------
  const handleAllPriceInfo = () => setShowPopup(false);
  const handleCloseTitleModal = () => setShowTitleModal(false);
  const handleCloseCityModal = () => setShowCityModal(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-5 md:px-20 lg:px-32">
      <ToastContainer />
      <div className="w-full max-w-5xl">
        {/* Header / Cover Image */}
        <div>
          {imageUrlCover ? (
            <img
              src={imageUrlCover}
              alt="Trip Image"
              className="h-[340px] w-full object-cover rounded"
            />
          ) : (
            <div className="w-full mb-4">
              <p className="text-xl text-gray-500 font-bold text-center mb-2">
                Upload Gambar Itinerary (Opsional)
              </p>
              <UploadDropzone
                className="border-4 border-dashed border-blue-400 h-[210px] w-full rounded-md"
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  setImageUrlCover(res[0].url);
                  setImageKeyCover(res[0].key);
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error.message);
                }}
              />
            </div>
          )}
        </div>

        {/* Title + Edit Button */}
        <div className="mt-4 flex items-center gap-2">
          <h1 className="font-bold text-lg md:text-2xl">{title}</h1>
          {/* Button: Edit Judul */}
          <button
            onClick={openTitleModal}
            className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
          >
            Edit Judul
          </button>
        </div>
        <p className="text-sm text-gray-500">Dibuat oleh: {username}</p>

        {/* Row of Tag-Like Buttons */}
        <div className="flex flex-row flex-wrap gap-2 mt-3">
          {/* Total Price: Show a FaPen icon to indicate possible editing (though we auto-calc) */}
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-1 bg-gray-200 text-sm md:text-base px-3 py-2 border rounded-full cursor-pointer hover:bg-gray-300"
          >
            💰
            {totalPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
            {/* (Auto) */}
          </button>

          {/* Total Days: clickable to open date modal, with FaPen */}
          <button
            onClick={() => setShowDateModal(true)}
            className="flex items-center gap-1 bg-cyan-400 hover:bg-cyan-600 text-sm md:text-base px-3 py-2 border rounded-full text-white"
          >
            <FaPen />
            {totalDays > 0 ? `${totalDays} Hari` : "Pilih Tanggal"}
          </button>

          {/* Category Input with FaPen */}
          <div className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-sm md:text-base px-2 border rounded-full text-white">
            <FaPen className="mr-1" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="bg-cyan-400 hover:bg-cyan-600 cursor-pointer p-1 outline-none"
            >
              <option value="" disabled>
                Kategori
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Type */}
          <button
            onClick={() => setShowStateModal(true)}
            className="flex flex-row gap-2 items-center text-sm md:text-base bg-cyan-500 hover:bg-gray-900 text-white px-3 py-2 border rounded-full"
          >
            <FaPen />
            {publicState ? (publishState ? "Publish" : "Public") : "Private"}
          </button>
        </div>

        {/* City + Edit Button */}
        <div className="mt-3 flex flex-row items-center gap-2">
          <h2 className="font-semibold text-lg md:text-xl">
            Kota: {city}
          </h2>
          <button
            onClick={openCityModal}
            className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
          >
            Edit Kota
          </button>
        </div>

        {/* Deskripsi Perjalanan (with label) */}
        <label className="block mt-3 text-sm font-semibold text-gray-700">
          Deskripsi Perjalanan:
        </label>
        <div className="bg-gray-100 relative px-3 py-2 md:px-5 rounded-2xl mt-1 flex flex-col gap-3">
          <textarea
            placeholder="Deskripsikan Perjalanan Kamu..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 px-3 bg-gray-100 outline-none"
          />
        </div>

        {/* Date Sections */}
        <div className="space-y-4 mt-10 w-full">
          {dateList.map((date, index) => {
            const dateKey = date.toISOString().split("T")[0];
            const formatted = date.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <div key={index} className="pt-2 mt-5 border-t-2 w-full">
                {/* Date Heading */}
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-gray-700 text-base md:text-lg font-semibold">
                    {formatted}
                  </h3>
                  {/* + Destinasi Button - more clickable styling */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                        + Destinasi
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Pilih Destinasi</DropdownMenuLabel>
                      {[
                        { label: "🏝️ Tempat wisata", value: "wisata" },
                        { label: "🛏️ Hotel (Coming Soon)", value: "hotel" },
                        // Add your other types if needed
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

                {/* Activities */}
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
                            onDelete={() => handleDeleteTodo(dateKey, i)}
                            onEdit={() => handleEditWisata(dateKey, i)}
                          />
                        );
                      } else if (todo.type === "catatan") {
                        return (
                          <ContentUlasan
                            date={""}
                            key={i}
                            onDelete={() => handleDeleteTodo(dateKey, i)}
                            {...todo}
                          />
                        );
                      } else if (todo.type === "transportasi") {
                        return (
                          <ContentTransportasi
                            date={""}
                            key={i}
                            onDelete={() => handleDeleteTodo(dateKey, i)}
                            {...todo}
                          />
                        );
                      } else {
                        // fallback
                        return (
                          <div
                            key={i}
                            className={`border p-4 flex flex-row justify-between rounded-lg ${getTodoStyling(
                              todo.type
                            )}`}
                          >
                            <div>
                              <h4 className="font-bold">{todo.name || "No Title"}</h4>
                              <p className="text-sm">{todo.description}</p>
                              <p className="text-sm">Biaya: {todo.cost}</p>
                              <p className="text-sm">Waktu: {todo.timeStart}</p>
                            </div>
                            <button
                              className="text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full hover:bg-black"
                              onClick={() => handleDeleteTodo(dateKey, i)}
                            >
                              Hapus
                            </button>
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
        <div className="mt-10">
          <button
            onClick={submitExperiance}
            className="w-full p-2 bg-green-500 text-white rounded-2xl cursor-pointer hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin inline" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      {/* ====== TITLE Modal ====== */}
      {showTitleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Edit Judul</h2>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseTitleModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={saveTitle}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== CITY Modal ====== */}
      {showCityModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Edit Kota</h2>
            <GooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
              selectProps={{
                onChange: (value: any) => setSelectedCity(value?.label || null),
                placeholder: "Pilih kota tujuan...",
              }}
              autocompletionRequest={{
                componentRestrictions: {
                  country: ["ID", "SG", "MY", "TH", "VN", "PH"],
                },
                types: ["(cities)"],
              }}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseCityModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={saveCity}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Todo Form Modal (Add / Edit Wisata) ====== */}
      {showTodoModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            <button
              onClick={() => {
                setShowTodoModal(false);
                setEditingWisataIndex(null);
                setEditingWisataDate(null);
              }}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>
            <form onSubmit={handleTodoSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold">
                {editingWisataIndex !== null ? "Edit" : "Tambah"} Aktivitas
              </h3>
              {/* Render Form Wisata or Ulasan depending on type */}
              {todoType === "wisata" || todoType === "transportasi" ? (
                <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />
              ) : (
                <p className="text-gray-500">Coming Soon!</p>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====== Date Form Modal ====== */}
      {showDateModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            <button
              onClick={() => setShowDateModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold">Atur Tanggal Perjalanan</h3>
            <label className="text-sm text-gray-600">Tgl Mulai</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              required
              className="w-full p-2 border rounded mb-2"
            />

            <label className="text-sm text-gray-600">Tgl Berakhir</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      )}

      {/* ====== State Form Modal (Private / Public / Publish) ====== */}
      {showStateModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            <button
              onClick={() => setShowStateModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold">Set State</h3>
            <p className="text-sm text-gray-500">
              Atur status untuk trip Anda:
            </p>
            <div className="flex flex-row gap-2">
              <button
                onClick={() => {
                  setPublicState(false);
                  setPublishState(false);
                  setShowStateModal(false);
                }}
                className="w-full bg-gray-200 hover:bg-cyan-400 text-gray-800 hover:text-white py-2 px-4 rounded"
              >
                Private
              </button>
              <button
                onClick={() => {
                  setPublicState(true);
                  setPublishState(true);
                  setShowStateModal(false);
                }}
                className="w-full bg-gray-200 hover:bg-cyan-400 text-gray-800 hover:text-white py-2 px-4 rounded"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Popup for Price Info ====== */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-gray-700">
              Harga terhitung otomatis setelah Anda menambahkan aktivitas.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              onClick={handleAllPriceInfo}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
