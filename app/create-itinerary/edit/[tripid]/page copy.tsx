// create-itinerary/edit/[tripid]

"use client";

import HomeUpper from "@/components/share-trip/HomeUpper";
import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/app/service/firebaseConfig";
import { UploadDropzone } from "@/app/utils/uploadthing";
import UlasanForm from "@/components/share-trip/form/FormUlasan";
import { GetPlacesDetails, PHOTO_REF_URL } from "@/app/service/GlobalApi";
import { FaPen } from "react-icons/fa";
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
import { FaMagic } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import convertTo24HourFormat from "@/components/service/convertTo24HourFormat";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


interface PageProps {
  params: {
    tripid: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  // State untuk judul dan status editing
  const [title, setTitle] = useState("Judul Statis"); // Judul default
  const [isEditing, setIsEditing] = useState(false); // Status pop-up edit
  const [tempTitle, setTempTitle] = useState(""); // Judul sementara di pop-up

  // Fungsi untuk membuka pop-up edit
  const handleEdit = () => {
    setTempTitle(title); // Set tempTitle dengan judul saat ini
    setIsEditing(true); // Tampilkan pop-up
  };

  // Fungsi untuk menyimpan perubahan
  const handleSave = () => {
    setTitle(tempTitle); // Simpan judul baru
    setIsEditing(false); // Tutup pop-up
  };

  // Fungsi untuk membatalkan perubahan
  const handleCancel = () => {
    setIsEditing(false); // Tutup pop-up tanpa menyimpan
  };



  // KOTA
  const [selectedCity, setSelectedCity] = useState<string | null>(null); // Kota yang dipilih
  const [city, setCity] = useState<string>("Pilih Kota"); // Kota statis
  const [isEditingCity, setIsEditingCity] = useState(false); // Status pop-up kota

  // Fungsi untuk menyimpan kota
  const handleSaveCity = () => {
    if (selectedCity) {
      setCity(selectedCity); // Simpan kota yang dipilih
    }
    setIsEditingCity(false);
  };





  const [showPopup, setShowPopup] = useState(false);

  const { tripid } = params;
  const [trip, setTrip] = useState<{ [key: string]: any } | null>(null);
  
  
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [category, setCategory] = useState("");
  const [publicState, setPublicState] = useState(false);
  const [publishState, setPublishState] = useState(false);
  const [description, setDescription] = useState(
    ""
  );
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
  const userid = user?.id || "noid";
  const nanoFirst = nanoid(6);
  const nanoLast = nanoid(6);
  const generateDocId = nanoFirst + Date.now().toString() + nanoLast;
  const [docId, setDocId] = useState(generateDocId);
  const [imageUrlCover, setImageUrlCover] = useState("");
  const [imageKeyCover, setImageKeyCover] = useState("");
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
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoType, setTodoType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
  }, []);

  useEffect(() => {
    tripid && getTripData();
  }, [tripid]);

  const getTripData = async () => {
    const docRef = doc(db, "Trips", tripid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No Document");
      toast.error("Upss! Trip tidak ditemukan", {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    if (trip && trip.tripData) {
      const tripData = trip.tripData;

      // Set the simple states
      setDocId(trip.id || generateDocId);
      setTitle(tripData.title || "");
      setImageUrlCover(tripData.imageCover);
      setCity(tripData.city || "");
      setDateStart(tripData.dateStart || "");
      setDateEnd(tripData.dateEnd || "");
      setCategory(tripData.category || "");
      setDescription(tripData.description || description);
      setTotalDays(tripData.totalDays || 0);

      let totalCost = 0; // Variable to store the sum of all costs

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

      // Set the total price
      setTotalPrice(totalCost);
    }
  }, [trip]);

  const dateList =
    dateStart && dateEnd ? generateDateList(dateStart, dateEnd) : [];

  useEffect(() => {
    const days = calculateTotalDays(dateStart, dateEnd);
    setTotalDays(days);
  }, [dateList]);

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
    if (newTodo) {
      setTodos((prevTodos) => {
        const updatedTodos = { ...prevTodos };
        const date = newTodo.date;

        if (!updatedTodos[date]) {
          updatedTodos[date] = [];
        }

        const isDuplicate = updatedTodos[date].some(
          (todo) =>
            todo.name === newTodo.name &&
            todo.type === newTodo.type &&
            todo.timeStart === newTodo.timeStart
        );

        if (!isDuplicate) {
          updatedTodos[date].push(newTodo);
        }

        return updatedTodos;
      });

      setTotalPrice(
        (prevPrice) =>
          prevPrice +
          (typeof newTodo.cost === "string"
            ? parseFloat(newTodo.cost)
            : newTodo.cost)
      );
      setShowTodoModal(false);
      setNewTodo(null);
    }
  };

  const handleDeleteTodo = (dateKey: string, index: number) => {
    let costToReduce = 0;

    setTodos((prevTodos) => {
      const updatedTodos = { ...prevTodos };
      const todoToDelete = updatedTodos[dateKey][index];

      costToReduce =
        typeof todoToDelete.cost === "string"
          ? parseFloat(todoToDelete.cost) || 0
          : todoToDelete.cost;

      updatedTodos[dateKey] = updatedTodos[dateKey].filter(
        (_, i) => i !== index
      );

      if (updatedTodos[dateKey].length === 0) {
        delete updatedTodos[dateKey];
      }

      return updatedTodos;
    });

    // Perbarui total price setelah state `todos` diperbarui
    setTotalPrice((prevPrice) => {
      console.log("perhitungan", prevPrice, "-", costToReduce, "=");
      const newPrice = prevPrice - costToReduce;
      console.log(newPrice);
      return newPrice >= 0 ? newPrice : 0; // Pastikan tidak negatif
    });
  };

  const submitExperiance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      totalDays,
      totalPrice,
      totalHotelPricePayAble: 0,
      totalActivitiesPricePayAble: 0,
      totalPayAblePrice: 0,
      todos: cleanedTodos,
      title,
      username,
    };

    console.log("Response: ", response);
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


  const renderTodoForm = () => {
    console.log("todoType:", todoType, "newTodo:", newTodo);
    if (!todoType || !newTodo) return null;

    switch (todoType) {
      case "wisata":
        return (
          <>
            <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />
          </>
        );

      case "transportasi":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "kuliner":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "pengalaman":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "belanjasewa":
        return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
      case "catatan":
        return <UlasanForm newTodo={newTodo} setNewTodo={setNewTodo} />;

      case "hotel":
        return <p className="text-center text-gray-500">Coming Soon!</p>;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between p-5 px-5 md:px-20 lg:px-32">
      {/* Display itinerary details */}
      <div className="flex flex-col w-full items-center py-8 px-5">
        {/* Header Upper */}
        <div className="w-full">
          <div>
            {imageUrlCover ? (
              <img
                src={imageUrlCover}
                alt="Trip Image"
                className="h-[340px] w-full object-cover rounded"
              />
            ) : (
              <div className="w-full">
                {/* Note above the upload drop zone */}
                <p className="text-xl text-gray-500 font-bold text-center mb-2">
                  Drag and drop atau klik di bawah ini untuk menambahkan gambar itinerary (opsional)
                </p>
                <UploadDropzone
                  className="border-4 border-dashed border-blue-400 h-[210px] w-full"
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    console.log(res[0].url);
                    console.log(res[0].key);

                    setImageUrlCover(res[0].url);
                    setImageKeyCover(res[0].key);
                    console.log("Files: ", res);
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error.message);
                  }}
                />
            </div>
            )}

            <br />
            {/* Judul Statis dengan Tombol Edit */}
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-2xl">{title}</h1>
              <button
                className="flex items-center text-gray-500 hover:text-gray-700"
                onClick={handleEdit}
              >
                <FaPen className="text-xl" />
              </button>
            </div>

            {/* Pop-up Edit */}
            {isEditing && (
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
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="text-base text-gray-400 mt-2 ">
              - dibuat oleh: {username} -
            </p>

            <div className="flex flex-row flex-wrap gap-2 mt-3">
              {/* Total Price Input */}
              {/* Total Price Input */}
              <h2
                className="bg-gray-200 cursor-pointer items-center text-center text-sm md:text-base px-3 py-2 border rounded-full"
                onClick={() => setShowPopup(true)}
              >
                💰{" "}
                {totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h2>

              {/* Total Days Input */}
              <div onClick={() => setShowDateModal(true)}>
                <h2 className="bg-cyan-400 hover:bg-cyan-600 cursor-pointer items-center text-center text-sm md:text-base px-3 py-2 border rounded-full">
                  {totalDays > 0 ? `🗓️ ${totalDays} Hari` : "🗓️ Pilih Tanggal"}
                </h2>
                
              </div>

              {/* Category Input */}
              <div className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-sm md:text-base  px-2 border rounded-full">
                🏝️
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-2 rounded bg-cyan-400 hover:bg-cyan-600 cursor-pointer"
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2 */}
              <div onClick={() => setShowStateModal(true)}>
                <h2 className="bg-cyan-500 hover:bg-gray-900 text-white flex flex-row gap-2 cursor-pointer items-center text-center text-sm md:text-base px-3 py-2 border rounded-full">
                  <FaMagic />
                  <div>
                    {publicState
                      ? publishState
                        ? "Publish"
                        : "Public"
                      : "Private"}
                  </div>
                </h2>
              </div>
            </div>
            <div className="flex flex-col mt-3">
              <div className="font-semibold text-lg md:text-xl mt-3 text-black-700 flex flex-row  justify-start items-center">
              <h2 className="font-semibold text-lg md:text-xl">🏙️ Kota: {city}</h2>
              <button
                className="flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditingCity(true)}
              >
                <FaPen className="text-xl" />
              </button>
              </div>




              {/* Pop-up Edit Kota */}
              {/* Pop-up Edit Kota */}
              {isEditingCity && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 className="text-lg font-bold mb-4">Pilih Kota</h2>
                    <GooglePlacesAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                      selectProps={{
                        onChange: (value: any) => setSelectedCity(value?.label || null),
                        placeholder: "Pilih kota tujuan...",
                      }}
                      autocompletionRequest={{
                        componentRestrictions: { country: ["ID", "SG", "MY", "TH", "VN", "PH"] },
                        types: ["(cities)"],
                      }}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setIsEditingCity(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveCity}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}




              <h2 className="font-semibold text-lg md:text-xl">Deskripsi perjalanan:</h2>
              <div className="bg-gray-100 relative px-3 py-2 md:px-5 rounded-2xl mt-3 flex flex-col gap-3 ">
                {/* <p>{description}</p> */}
                <BsStars className="absolute top-5 left-3 text-gray-400" />
                
                <textarea
                  placeholder=" Deskripsikan Perjalanan Kamu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2 px-3 rounded bg-gray-100 outline-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        {/* End Header Upper */}

        {/* Display Dates */}
        <div className="space-y-4 mt-10 w-full">
          {dateList.map((date, index) => {
            const dateKey = date.toISOString().split("T")[0];

            return (
              <div
                key={index}
                className="flex flex-col pt-2 mt-5 border-t-2 w-full"
              >
                <div className="flex justify-between items-center w-full">
                  {/* Tanggal */}
                  <div>
                    <h3 className="text-gray-500 text-base text-start">
                      {date.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                  </div>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="btn">
                      + Destinasi
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Pilih Destinasi</DropdownMenuLabel>
                      {[
                        { label: "🏝️ Tempat wisata", value: "wisata" },
                        { label: "🛏️ Hotel", value: "hotel" },
                        // { label: "💡 Pengalaman", value: "pengalaman" },
                        // { label: "🍗 Kuliner", value: "kuliner" },
                        // { label: "🚕 Transportasi", value: "transportasi" },
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
                    .sort((a, b) => a.timeStart.localeCompare(b.timeStart)) // Urutkan berdasarkan waktu
                    .map((todo, i) => {
                      if (todo.type === "wisata") {
                        return (
                          <ContentWisata
                            date={""}
                            key={i}
                            {...todo}
                            onDelete={() => handleDeleteTodo(dateKey, i)}
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
                              onClick={() => handleDeleteTodo(dateKey, i)}
                            >
                              x
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

        {/*Submit Button*/}
        <div className="mt-10">
          <button
            onClick={submitExperiance}
            className="w-full p-2 bg-green-500 text-white rounded-2xl cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
            ) : (
              <>Submit</>
            )}
          </button>
        </div>
        {/* End Submit Button */}
      </div>

      {/* Todo Form Modal */}
      {showTodoModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            <button
              onClick={() => setShowTodoModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>
            <form onSubmit={handleTodoSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold">Tambah Aktivitas</h3>
              {renderTodoForm()}
              <button type="submit">Simpan</button>
            </form>
          </div>
        </div>
      )}

      {/* Date Form Modal */}
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
            <div className="text-sm text-gray-500 mt-1">Deskripsikan Trip</div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-col items-start gap-1">
                <div className="text-sm text-gray-500">Memulai Trip</div>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="text-sm text-gray-500">Trip Berakhir</div>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set State Form Modal */}
      {showStateModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            {/* Tombol untuk menutup modal */}
            <button
              onClick={() => setShowStateModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Header Modal */}
            <h3 className="text-lg font-bold">Set State</h3>
            <div className="text-sm text-gray-500 mt-1">
              Atur status untuk trip Anda:
            </div>

            {/* Menu untuk mengganti state */}
            <div className="flex flex-row gap-1">
              {/* Tombol untuk "Private" */}
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

              {/* Tombol untuk "Public" */}
              {/* <button
              onClick={() => {
                setPublicState(true);
                setPublishState(false);
                setShowStateModal(false);
              }}
              className="w-full bg-gray-200 hover:bg-cyan-400 text-gray-800 hover:text-white py-2 px-4 rounded"
            >
              Public
            </button> */}

              {/* Tombol untuk "Publish" */}
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

      {/* Modal untuk informasi harga */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-gray-700">
              Harga akan terhitung otomatis setelah Anda memasukkan aktivitas Anda
            </p>
            <button
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              onClick={() => setShowPopup(false)}
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
