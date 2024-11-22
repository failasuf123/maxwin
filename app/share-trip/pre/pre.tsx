"use client";
import HomeUpper from "@/components/share-trip/HomeUpper";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  time: string;
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
  time: new Date().toISOString().substr(11, 5),
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
  const username = "I Made Vivaldi"
  const [todos, setTodos] = useState<Record<string, Array<{
    type: string;
    name: string;
    description: string;
    cost: number;
    time: string;
    image: string;
    imageList: string[];
  }>>>({});
  

  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showTodoModal, setShowTodoModal] = useState(false);
  // const [todo, setTodo] = useState<typeof initialTodoState[]>([]);
  const [todo, setTodo] = useState<Todo[]>([]);

  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [todoType, setTodoType] = useState<string | null>(null);

  const handleAddTodo = (type: string, date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
  
    setNewTodo({
      type,
      name: "",
      description: "",
      cost: 0,
      time: new Date().toISOString().substr(11, 5),
      image: "",
      imageList: [],
      date: date.toString(),
    });
  
    setShowTodoModal(true);
  };
  
  

  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo) {
      setTodos((prevTodos) => {
        const updatedTodos = { ...prevTodos };
        const date = newTodo.date;
  
        // Pastikan tidak ada duplikasi
        if (!updatedTodos[date]) {
          updatedTodos[date] = [];
        }
  
        // Cek apakah todo dengan detail yang sama sudah ada
        const isDuplicate = updatedTodos[date].some(
          (todo) => 
            todo.name === newTodo.name && 
            todo.type === newTodo.type && 
            todo.time === newTodo.time
        );
  
        if (!isDuplicate) {
          updatedTodos[date].push(newTodo);
        }
  
        return updatedTodos;
      });
  
      setTotalPrice((prevPrice) => prevPrice + newTodo.cost);
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

  const handleDeleteTodo = (index: number) => {
    setTodo((prevTodos) => prevTodos.filter((_, i) => i !== index));
  };

  const submitExperiance = (e: React.FormEvent) => {
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
              time: todo.time,
              
            })
          )
        )
      ).map((task) => JSON.parse(task));
      acc[date] = uniqueTasks;
      return acc;
    }, {} as typeof todos);
  
    const response = {
      title,
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
  };
  

  
  const renderTodoForm = () => {
    if (!todoType || !newTodo) return null;

    switch (todoType) {
      case "wisata":
        return (
          <>
            <input
              type="text"
              placeholder="Nama Tempat Wisata"
              value={newTodo.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Deskripsi (Opsional)"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            {/* Other inputs */}
          </>
        );
      case "transportasi":
        return <>{/* Inputs for transportasi */}</>;
      case "kuliner":
        return <>{/* Inputs for kuliner */}</>;
      case "pengalaman":
        return <>{/* Inputs for pengalaman */}</>;
      case "ulasan":
        return (
          <>
            <input
              type="text"
              placeholder="Judul"
              value={newTodo.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Deskripsi"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
          </>
        );
      case "hotel":
        return <p className="text-center text-gray-500">Coming Soon!</p>;
    }
  };
  
  const renderTodosByDate = (date: string) => {
    const filteredTodos = todo.filter((t) => t.date === date);
    return (
      <div className="mt-4">
        {filteredTodos.map((t, index) => (
          <div
            key={index}
            className={`border p-4 rounded-lg ${getTodoStyling(t.type)}`}
          >
            <h4 className="font-bold">{t.name}</h4>
            <p className="text-sm">{t.description || "No description"}</p>
            <p className="text-sm">Harga: {t.cost}</p>
          </div>
        ))}
      </div>
    );
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

            <div className="text-sm text-gray-500 mt-1">Deskripsikan Trip</div>
            <textarea
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />

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
            city={city}
            days={totalDays}
            category={category}
            cost={totalPrice}
          />
          {title}

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
                        + Add Todo
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Pilih Aktivitas</DropdownMenuLabel>
                        {[
                          { label: "Wisata", value: "wisata" },
                          { label: "Hotel", value: "hotel" },
                          { label: "Transportasi", value: "transportasi" },
                          { label: "Pengalaman", value: "pengalaman" },
                          { label: "Kuliner", value: "kuliner" },
                          { label: "Ulasan", value: "ulasan" },
                        ].map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleAddTodo(option.value, date)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Hasil input todo berdasarkan dateList */}
                  <div>{renderTodosByDate(dateKey)}</div>
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
