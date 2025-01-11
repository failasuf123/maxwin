"use client";

import HomeUpper from "@/components/share-trip/HomeUpper";
import React, { useEffect, useState } from "react";
import ContentWisata from "@/components/share-trip/container/ContentWisata";
import ContentUlasan from "@/components/share-trip/container/ContentCatatan";
import WisataForm from "@/components/share-trip/form/FormWisata";
import ContentTransportasi from "@/components/share-trip/container/ContentTransportasi";
import { doc, setDoc } from "firebase/firestore"; 
import { nanoid } from 'nanoid';
import { db } from '@/app/service/firebaseConfig';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadDropzone } from "@/app/utils/uploadthing";
import UlasanForm from "@/components/share-trip/form/FormUlasan";

interface VacationPlan {
  title: string;
  city: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  cost: number;
  days: number;
  listTodo: ListTodo[];
}

interface ListTodo {
  day: string;
  tasks: Todo[];
}

type Todo = {
  type: string;
  name: string;
  description: string;
  cost: number;
  timeStart: string;
  timeEnd: string;
  tag: string[];
  image: string;
  imageList: string[];
  date: string;
};

const calculateTotalDays = (start: string, end: string): number => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const timeDifference = endDate - startDate;
  return timeDifference >= 0
    ? Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1
    : 0;
};

const generateDateList = (start: string, end: string): Date[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: Date[] = [];
  while (startDate <= endDate) {
    dates.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
};

const initialTodoState = {
  type: "",
  name: "",
  description: "",
  cost: 0,
  // timeStart: new Date().toISOString().substr(11, 5),
  timeStart: "",
  timeEnd:"",
  tag: [] as string[],
  image: "",
  imageList: [] as string[],
};
const getTodoStyling = (type: string) => {
  switch (type) {
    case "wisata":
      return "bg-blue-50";
    case "transportasi":
      return "bg-yellow-50";
    case "kuliner":
      return "bg-green-50";
    case "pengalaman":
      return "bg-purple-50";
    case "ulasan":
      return "bg-gray-50";
    default:
      return "bg-white";
  }
};

const categories = [
  "Solo Trip",
  "Family",
  "Friends",
  "Date",
  "Honey Moon",
  "Hidden Gem",
  "Hangout",
  "Hiking",
  "Adventure",
  "Explore",
];



const Page: React.FC = () => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  // const userItem = localStorage.getItem('user');
  const [user, setUser] = useState<{ name?: string; picture?: string; id?: string; email?:string } | null>(null);
  // const user = userItem ? JSON.parse(userItem) : null;    
  const username = user?.name || "no name";
  const userpicture = user?.picture || "/default-picture.png";
  const userid = user?.id || "noid";
  const nanoFirst = nanoid(3);
  const nanoLast = nanoid(4);
  const docId = nanoFirst + Date.now().toString() + nanoLast
  const [imageUrlCover,setImageUrlCover] = useState("/placeholder.png")
  const [imageKeyCover,setImageKeyCover] = useState("")
  const [todos, setTodos] = useState<
    Record<
      string,
      Array<{
        type: string;
        name: string;
        description: string;
        cost: number;
        timeStart: string;
        timeEnd:string;
        tag:string[];
        image: string;
        imageList: string[];
      }>
    >
  >({});

  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoType, setTodoType] = useState<string | null>(null);


  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
  }, []);


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
    setTodoType(type); // Perbarui todoType
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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateTotalDays(dateStart, dateEnd);
    setTotalDays(days);
    setShowInitialModal(false);
  };

  const handleDeleteTodo = (dateKey: string, index: number) => {
    let costToReduce = 0;

    setTodos((prevTodos) => {
      const updatedTodos = { ...prevTodos };

      // Ambil todo yang akan dihapus
      const todoToDelete = updatedTodos[dateKey][index];

      // Hitung costToReduce
      costToReduce =
        typeof todoToDelete.cost === "string"
          ? parseFloat(todoToDelete.cost) || 0
          : todoToDelete.cost;

      // Hapus todo berdasarkan indeks
      updatedTodos[dateKey] = updatedTodos[dateKey].filter(
        (_, i) => i !== index
      );

      // Hapus key jika tidak ada todo lagi pada tanggal tersebut
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
              tag:todo.tag,
              timeStart: todo.timeStart,
              timeEnd: todo.timeEnd,
            })
          )
        )
      ).map((task) => JSON.parse(task));
      acc[date] = uniqueTasks;
      return acc;
    }, {} as typeof todos);
    const imageCover = imageUrlCover

    const response = {
      title,
      imageCover,
      city,
      dateStart,
      dateEnd,
      category,
      description,
      username,
      totalPrice,
      totalDays,
      todos: cleanedTodos, // gunakan data yang sudah dibersihkan
    };

    console.log("Response: ", response);
    await setDoc(doc(db, "ShareTrips", docId), {
      tripData: response,
      userPicture: userpicture,
      userEmail:user?.email,
      userId: user?.id,
      id:docId,
    });
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
        case "ulasan":
         
          return <UlasanForm newTodo={newTodo} setNewTodo={setNewTodo} />;

        
      case "hotel":
        return <p className="text-center text-gray-500">Coming Soon!</p>;
    }
  };

  const dateList =
    dateStart && dateEnd ? generateDateList(dateStart, dateEnd) : [];

  return (
    <div className="p-4">
      {/* Initial Modal */}
      {showInitialModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <form
            onSubmit={handleInitialSubmit}
            className="bg-white p-6 rounded-md shadow-lg space-y-4"
          >
            <h2 className="text-xl font-semibold text-center">
              Isi Itinerary Anda
            </h2>
            <div className="flex flex-row items-center gap-2 px-2">
              <div>
                <div className="text-sm text-gray-500 mt-5">Judul</div>
                <input
                  type="text"
                  placeholder="Judul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500 mt-1">Pilih Kota</div>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
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

                <div className="text-sm text-gray-500 mt-5">Pilih Kategori</div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center flex-col justify-center">
                <div className="text-sm text-gray-500 mt-1">Deskripsikan Trip</div>
                <textarea
                  placeholder="Deskripsi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />

                <UploadDropzone
                  className="border-gray-600 "
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    console.log(res[0].url)
                    console.log(res[0].key)

                    setImageUrlCover(res[0].url);
                    setImageKeyCover(res[0].key);
                    console.log("Files: ", res);
    
                  }}
                  onUploadError={(error: Error) => {
                      console.error("Upload error:", error.message);
                  }}
                />
              </div>
            </div>
 

            <button
              type="submit"
              className="w-full p-2 bg-cyan-500 text-white rounded-2xl mt-5 cursor-pointer hover:bg-black "
            >
              Buat Pengalaman Trip
            </button>
          </form>
        </div>
      )}

      {/* Display itinerary details */}
      {!showInitialModal && (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56">
          <HomeUpper
            title = {title}
            description = {description}
            city={city}
            days={totalDays}
            category={category}
            cost={totalPrice}
            author={username}
            image={imageUrlCover}
          />

          {/* Display Dates */}
          <div className="space-y-4 mt-10">
            {dateList.map((date, index) => {
              const dateKey = date.toISOString().split("T")[0];

              return (
                <div key={index} className="flex flex-col pt-2 mt-5 border-t-2">
                  <div className="flex justify-between items-center">
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
                        + Aktivitas
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Pilih Aktivitas</DropdownMenuLabel>
                        {[
                          { label: "🏝️ Wisata", value: "wisata" },
                          { label: "🛏️ Hotel", value: "hotel" },
                          { label: "💡 Pengalaman", value: "pengalaman" },
                          { label: "🍗 Kuliner", value: "kuliner" },
                          { label: "🚕 Transportasi", value: "transportasi" },
                          { label: "🛍️ Belanja/Sewa", value: "belanjasewa" },
                          { label: "🖋️ Ulasan", value: "ulasan" },
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
                      ?.slice() // Salin array untuk menghindari mutasi state langsung
                      .sort((a, b) => a.timeStart.localeCompare(b.timeStart)) // Urutkan berdasarkan waktu
                      .map((todo, i) => {
                        if (todo.type === "wisata") {
                          return (
                            <ContentWisata
                              date={""}
                              key={i}
                              {...todo} // Mengirim seluruh `todo` sebagai props
                              onDelete={() => handleDeleteTodo(dateKey, i)}
                            />
                          );
                        } else if (todo.type === "ulasan") {
                          return (
                            <ContentUlasan
                              date={""}
                              key={i}
                              onDelete={() => handleDeleteTodo(dateKey, i)}
                              {...todo} // Mengirim seluruh `todo` sebagai props
                            />
                          );
                        } else if(todo.type === "transportasi"){
                          return(
                              <ContentTransportasi 
                                date={""}
                                key={i}
                                onDelete={() => handleDeleteTodo(dateKey, i)}
                                {...todo} // Mengirim seluruh `todo` sebagai props
                              />
                          )

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

          {/* Tombol Submit */}
          <div className="mt-10">
            <button
              onClick={submitExperiance}
              className="w-full p-2 bg-green-500 text-white rounded-2xl cursor-pointer"
            >
              Submit dan Lihat Console
            </button>
          </div>
        </div>
      )}

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
              <h3 className="text-xl font-semibold">Tambah Todo</h3>
              {renderTodoForm()}
              <button type="submit">Simpan</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Page;
