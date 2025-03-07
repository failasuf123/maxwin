"use client";

import EditMain from "@/components/edit/EditMain";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { saveUserToFirestore } from "@/components/service/signin/saveUserToFirestore";
import { updateUserProfilePictureIfChanged } from "@/components/service/signin/updateUserProfilePictureIfChanged";
import { FcGoogle } from "react-icons/fc";

function Page() {
  const tripid = "manualTrip";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log("User from localStorage:", user);

    if (!user) {
      console.log("User not found, opening dialog");
      setIsLoggedIn(true);
    } else {
      console.log("User found:", user);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => getUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const getUserProfile = (tokenInfo: any) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        const userData = response.data;

        // Simpan data user ke localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Simpan data user ke Firestore (jika belum ada)
        saveUserToFirestore(userData);
        console.log("User Data", userData);

        // Perbarui URL foto profil di Firestore jika berbeda
        updateUserProfilePictureIfChanged(userData.id, userData.picture);

        setIsLoggedIn(false);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  return (
    <Suspense>
      {isLoggedIn ? ( // Cek apakah user login
        <div className="flex flex-col item-center justify-center h-screen px-16 md:px-32 lg:px-36">
          <div>
            <h2 className="text-lg font-bold mb-2">Sign In With Google</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sign In dengan aman menggunakan Google Authentication.
            </p>
          </div>
          <div>
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-gray-900 rounded hover:bg-blue-600"
              onClick={() => login()}
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Sign Up dengan Google
            </button>
          </div>
        </div>
      ) : (
        <EditMain tripidProps={tripid} typeProps={"manualTrip"} />
      )}
    </Suspense>
  );
}

export default Page;

// "use client";

// import HomeUpper from "@/components/share-trip/HomeUpper";
// import React, { useEffect, useState } from "react";
// import { doc, setDoc } from "firebase/firestore";
// import { nanoid } from "nanoid";
// import { db } from "@/app/service/firebaseConfig";
// import { UploadDropzone } from "@/app/utils/uploadthing";
// import UlasanForm from "@/components/share-trip/form/FormUlasan";
// import { GetPlacesDetails, PHOTO_REF_URL } from "@/app/service/GlobalApi";
// import { FaPen } from "react-icons/fa";
// import { CiCalendarDate } from "react-icons/ci";
// import { BsStars } from "react-icons/bs";

// import ContentWisata from "@/components/share-trip/container/ContentWisata";
// import ContentUlasan from "@/components/share-trip/container/ContentCatatan";
// import WisataForm from "@/components/share-trip/form/FormWisata";
// import ContentTransportasi from "@/components/share-trip/container/ContentTransportasi";
// import { calculateTotalDays } from "@/components/service/calculateTotalDays";
// import { generateDateList } from "@/components/service/generateDateList";
// import {
//   Todo,
//   getTodoStyling,
//   categories,
// } from "@/components/create/utils/utility";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { useRouter } from "next/navigation";

// const Page: React.FC = () => {
//   const [title, setTitle] = useState("");
//   const [city, setCity] = useState("");
//   const [dateStart, setDateStart] = useState("");
//   const [dateEnd, setDateEnd] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState(
//     "Deskripsi akan menarik perhatian orang lain terhadap pengalaman liburan anda, Deskripsikan perjalanan anda disini"
//   );
//   const [totalDays, setTotalDays] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [user, setUser] = useState<{
//     name?: string;
//     picture?: string;
//     id?: string;
//     email?: string;
//   } | null>(null);
//   const username = user?.name || "no name";
//   const userpicture = user?.picture || "/default-picture.png";
//   const userid = user?.id || "noid";
//   const nanoFirst = nanoid(3);
//   const nanoLast = nanoid(4);
//   const docId = nanoFirst + Date.now().toString() + nanoLast;
//   const [imageUrlCover, setImageUrlCover] = useState("");
//   const [imageKeyCover, setImageKeyCover] = useState("");
//   const [todos, setTodos] = useState<
//     Record<
//       string,
//       Array<{
//         type: string;
//         name: string;
//         description: string;
//         cost: number;
//         timeStart: string;
//         timeEnd: string;
//         tag: string[];
//         image: string;
//         imageList: string[];
//       }>
//     >
//   >({});

//   const [showTodoModal, setShowTodoModal] = useState(false);
//   const [showDateModal, setShowDateModal] = useState(false);
//   const [newTodo, setNewTodo] = useState<Todo | null>(null);
//   const [todoType, setTodoType] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter(); // Import dari next/navigation

//   useEffect(() => {
//     const userItem = localStorage.getItem("user");
//     if (userItem) {
//       setUser(JSON.parse(userItem));
//     }
//   }, []);

//   const dateList =
//     dateStart && dateEnd ? generateDateList(dateStart, dateEnd) : [];

//   useEffect(() => {
//     const days = calculateTotalDays(dateStart, dateEnd);
//     setTotalDays(days);
//   }, [dateList]);

//   const handleAddTodo = (type: string, date: Date) => {
//     const formattedDate = date.toISOString().split("T")[0];

//     setNewTodo({
//       type,
//       name: "",
//       description: "",
//       cost: 0,
//       timeStart: new Date().toISOString().substr(11, 5),
//       timeEnd: "",
//       tag: [],
//       image: "",
//       imageList: [],
//       date: formattedDate,
//     });
//     setTodoType(type);
//     setShowTodoModal(true);
//   };

//   const handleTodoSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newTodo) {
//       setTodos((prevTodos) => {
//         const updatedTodos = { ...prevTodos };
//         const date = newTodo.date;

//         if (!updatedTodos[date]) {
//           updatedTodos[date] = [];
//         }

//         const isDuplicate = updatedTodos[date].some(
//           (todo) =>
//             todo.name === newTodo.name &&
//             todo.type === newTodo.type &&
//             todo.timeStart === newTodo.timeStart
//         );

//         if (!isDuplicate) {
//           updatedTodos[date].push(newTodo);
//         }

//         return updatedTodos;
//       });

//       setTotalPrice(
//         (prevPrice) =>
//           prevPrice +
//           (typeof newTodo.cost === "string"
//             ? parseFloat(newTodo.cost)
//             : newTodo.cost)
//       );
//       setShowTodoModal(false);
//       setNewTodo(null);
//     }
//   };

//   const handleDeleteTodo = (dateKey: string, index: number) => {
//     let costToReduce = 0;

//     setTodos((prevTodos) => {
//       const updatedTodos = { ...prevTodos };
//       const todoToDelete = updatedTodos[dateKey][index];

//       costToReduce =
//         typeof todoToDelete.cost === "string"
//           ? parseFloat(todoToDelete.cost) || 0
//           : todoToDelete.cost;

//       updatedTodos[dateKey] = updatedTodos[dateKey].filter(
//         (_, i) => i !== index
//       );

//       if (updatedTodos[dateKey].length === 0) {
//         delete updatedTodos[dateKey];
//       }

//       return updatedTodos;
//     });

//     // Perbarui total price setelah state `todos` diperbarui
//     setTotalPrice((prevPrice) => {
//       console.log("perhitungan", prevPrice, "-", costToReduce, "=");
//       const newPrice = prevPrice - costToReduce;
//       console.log(newPrice);
//       return newPrice >= 0 ? newPrice : 0; // Pastikan tidak negatif
//     });
//   };

//   const submitExperiance = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const cleanedTodos = Object.keys(todos).reduce((acc, date) => {
//       const uniqueTasks = Array.from(
//         new Set(
//           todos[date].map((todo) =>
//             JSON.stringify({
//               name: todo.name,
//               type: todo.type,
//               description: todo.description,
//               cost: todo.cost,
//               image: todo.image,
//               imageList: todo.imageList,
//               tag: todo.tag,
//               timeStart: todo.timeStart,
//               timeEnd: todo.timeEnd,
//             })
//           )
//         )
//       ).map((task) => JSON.parse(task));
//       acc[date] = uniqueTasks;
//       return acc;
//     }, {} as typeof todos);
//     const imageCover = imageUrlCover;

//     const response = {
//       activitiesOptions: [],
//       category,
//       city,
//       dateEnd,
//       dateStart,
//       description,
//       imageCover,
//       totalDays,
//       totalPrice,
//       totalHotelPricePayAble: 0,
//       totalActivitiesPricePayAble: 0,
//       totalPayAblePrice: 0,
//       todos: cleanedTodos,
//       title,
//       username,
//     };

//     console.log("Response: ", response);
//     await setDoc(doc(db, "Trips", docId), {
//       id: docId,
//       lastUpdate: Date.now(),
//       public: false,
//       publish: false,
//       contributor: [],
//       userId: user?.id,
//       userPicture: userpicture,
//       userEmail: user?.email,
//       tripData: response,
//     });
//     router.push("/dashboard");
//   };

//   const renderTodoForm = () => {
//     console.log("todoType:", todoType, "newTodo:", newTodo);
//     if (!todoType || !newTodo) return null;

//     switch (todoType) {
//       case "wisata":
//         return (
//           <>
//             <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />
//           </>
//         );

//       case "transportasi":
//         return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
//       case "kuliner":
//         return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
//       case "pengalaman":
//         return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
//       case "belanjasewa":
//         return <WisataForm newTodo={newTodo} setNewTodo={setNewTodo} />;
//       case "catatan":
//         return <UlasanForm newTodo={newTodo} setNewTodo={setNewTodo} />;

//       case "hotel":
//         return <p className="text-center text-gray-500">Coming Soon!</p>;
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full flex-col items-center justify-between p-5 px-5 md:px-20 lg:px-32">
//       {/* Display itinerary details */}
//       <div className="flex flex-col w-full items-center py-8 px-5">
//         {/* Header Upper */}
//         <div className="w-full">
//           <div>
//             {imageUrlCover ? (
//               <img
//                 src={imageUrlCover}
//                 alt="Trip Image"
//                 className="h-[340px] w-full object-cover rounded"
//               />
//             ) : (
//               <UploadDropzone
//                 className="border-4 border-dashed border-blue-400 h-[340px] w-full"
//                 endpoint="imageUploader"
//                 onClientUploadComplete={async (res) => {
//                   console.log(res[0].url);
//                   console.log(res[0].key);

//                   setImageUrlCover(res[0].url);
//                   setImageKeyCover(res[0].key);
//                   console.log("Files: ", res);
//                 }}
//                 onUploadError={(error: Error) => {
//                   console.error("Upload error:", error.message);
//                 }}
//               />
//             )}

//             {/* <h2 className="font-bold text-2xl md:text-3xl mt-3">{title}</h2> */}
//             <div className="flex flex-row items-center gap-2">
//               <div className="flex justify-center items-center text-center text-gray-400 text-xl">
//                 <FaPen className="text-xl text-center mt-3" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Judul"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//                 className="w-full mt-5 font-bold text-xl md:text-3xl outline-none focus:outline-none "
//               />
//             </div>

//             <p className="text-base text-gray-400 mt-2 ">
//               - dibuat oleh: {username} -
//             </p>

//             <div className="flex flex-row flex-wrap gap-2 mt-3">
//               {/* Total Price Input */}
//               <h2 className="bg-gray-200 cursor-default items-center text-center text-sm md:text-base px-3 py-2 border rounded-full">
//                 💰{" "}
//                 {totalPrice.toLocaleString("id-ID", {
//                   style: "currency",
//                   currency: "IDR",
//                 })}
//               </h2>

//               {/* Total Days Input */}
//               <div onClick={() => setShowDateModal(true)}>
//                 <h2 className="bg-gray-200 cursor-pointer items-center text-center text-sm md:text-base px-3 py-2 border rounded-full">
//                   {totalDays > 0 ? `🗓️ ${totalDays} Hari` : "🗓️ Pilih Tanggal"}
//                 </h2>
//               </div>

//               {/* Category Input */}
//               <div className="flex items-center bg-gray-200 text-sm md:text-base  px-2 border rounded-full">
//                 🏝️
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   required
//                   className="w-full p-2 border rounded bg-gray-200 cursor-pointer"
//                 >
//                   <option value="" disabled>
//                     Pilih Kategori
//                   </option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="flex flex-col mt-3">
//               <div className="font-semibold text-lg md:text-xl mt-3 text-gray-700 flex flex-row  justify-start items-center">
//                 <h2>🏙️ Kota</h2>
//                 <input
//                   type="text"
//                   placeholder="Pilih Kota"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   required
//                   className="w-44 px-1 outline-none focus:outline-none"
//                 />

//                 <FaPen className="text-gray-400" />
//               </div>
//               <div className="bg-gray-100 relative px-3 py-2 md:px-5 rounded-2xl mt-3 flex flex-col gap-3 ">
//                 {/* <p>{description}</p> */}
//                 <BsStars className="absolute top-5 left-3 text-gray-400" />
//                 <textarea
//                   placeholder=" Deskripsikan Perjalanan Kamu..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                   className="w-full p-2 px-3 rounded bg-gray-100 outline-none focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* End Header Upper */}

//         {/* Display Dates */}
//         <div className="space-y-4 mt-10 w-full">
//           {dateList.map((date, index) => {
//             const dateKey = date.toISOString().split("T")[0];

//             return (
//               <div
//                 key={index}
//                 className="flex flex-col pt-2 mt-5 border-t-2 w-full"
//               >
//                 <div className="flex justify-between items-center w-full">
//                   {/* Tanggal */}
//                   <div>
//                     <h3 className="text-gray-500 text-base text-start">
//                       {date.toLocaleDateString("id-ID", {
//                         weekday: "long",
//                         day: "numeric",
//                         month: "long",
//                         year: "numeric",
//                       })}
//                     </h3>
//                   </div>

//                   {/* Dropdown Menu */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger className="btn">
//                       + Aktivitas
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       <DropdownMenuLabel>Pilih Aktivitas</DropdownMenuLabel>
//                       {[
//                         { label: "🏝️ Wisata", value: "wisata" },
//                         { label: "🛏️ Hotel", value: "hotel" },
//                         { label: "💡 Pengalaman", value: "pengalaman" },
//                         { label: "🍗 Kuliner", value: "kuliner" },
//                         { label: "🚕 Transportasi", value: "transportasi" },
//                         { label: "🛍️ Belanja/Sewa", value: "belanjasewa" },
//                         { label: "🖋️ Catatan", value: "catatan" },
//                       ].map((option) => (
//                         <DropdownMenuItem
//                           key={option.value}
//                           onClick={() => handleAddTodo(option.value, date)}
//                           className="cursor-pointer"
//                         >
//                           {option.label}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 <div className="mt-5 flex flex-col gap-2">
//                   {todos[dateKey]
//                     ?.slice()
//                     .sort((a, b) => a.timeStart.localeCompare(b.timeStart)) // Urutkan berdasarkan waktu
//                     .map((todo, i) => {
//                       if (todo.type === "wisata") {
//                         return (
//                           <ContentWisata
//                             date={""}
//                             key={i}
//                             {...todo}
//                             onDelete={() => handleDeleteTodo(dateKey, i)}
//                           />
//                         );
//                       } else if (todo.type === "catatan") {
//                         return (
//                           <ContentUlasan
//                             date={""}
//                             key={i}
//                             onDelete={() => handleDeleteTodo(dateKey, i)}
//                             {...todo}
//                           />
//                         );
//                       } else if (todo.type === "transportasi") {
//                         return (
//                           <ContentTransportasi
//                             date={""}
//                             key={i}
//                             onDelete={() => handleDeleteTodo(dateKey, i)}
//                             {...todo}
//                           />
//                         );
//                       } else {
//                         return (
//                           <div
//                             key={i}
//                             className={`border p-4 flex flex-row justify-between rounded-lg ${getTodoStyling(
//                               todo.type
//                             )}`}
//                           >
//                             <div>
//                               <h4 className="font-bold">
//                                 {todo.name || "No Title"}
//                               </h4>
//                               <p className="text-sm">
//                                 {todo.description || "No description"}
//                               </p>
//                               <p className="text-sm">Biaya: {todo.cost}</p>
//                               <p className="text-sm">Waktu: {todo.timeStart}</p>
//                             </div>

//                             <div
//                               className="text-white bg-red-500 text-sm px-3 py-1 h-[28px] rounded-full cursor-pointer hover:bg-black"
//                               onClick={() => handleDeleteTodo(dateKey, i)}
//                             >
//                               x
//                             </div>
//                           </div>
//                         );
//                       }
//                     })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/*Submit Button*/}
//         <div className="mt-10">
//           <button
//             onClick={submitExperiance}
//             className="w-full p-2 bg-green-500 text-white rounded-2xl cursor-pointer"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
//             ) : (
//               <>Submit</>
//             )}
//           </button>
//         </div>
//         {/* End Submit Button */}
//       </div>

//       {/* Todo Form Modal */}
//       {showTodoModal && (
//         <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
//           <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
//             <button
//               onClick={() => setShowTodoModal(false)}
//               className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
//               aria-label="Close modal"
//             >
//               &times;
//             </button>
//             <form onSubmit={handleTodoSubmit} className="space-y-4">
//               <h3 className="text-xl font-semibold">Tambah Todo</h3>
//               {renderTodoForm()}
//               <button type="submit">Simpan</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Description Form Modal */}
//       {showDateModal && (
//         <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
//           <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
//             <button
//               onClick={() => setShowDateModal(false)}
//               className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
//               aria-label="Close modal"
//             >
//               &times;
//             </button>
//             <div className="text-sm text-gray-500 mt-1">Deskripsikan Trip</div>
//             <div className="flex flex-row items-center gap-2 w-full">
//               <div className="flex flex-col items-start gap-1">
//                 <div className="text-sm text-gray-500">Memulai Trip</div>
//                 <input
//                   type="date"
//                   value={dateStart}
//                   onChange={(e) => setDateStart(e.target.value)}
//                   required
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div className="flex flex-col items-start gap-1">
//                 <div className="text-sm text-gray-500">Trip Berakhir</div>
//                 <input
//                   type="date"
//                   value={dateEnd}
//                   onChange={(e) => setDateEnd(e.target.value)}
//                   required
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;
