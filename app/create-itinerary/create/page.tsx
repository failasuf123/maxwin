"use client";
import React, { useEffect, useState } from "react";
import { AI_PROMPT } from "@/app/constants/option";
import { chatSession } from "@/app/service/AIModel";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/app/service/firebaseConfig";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { saveUserToFirestore } from "@/components/service/signin/saveUserToFirestore";
import { updateUserProfilePictureIfChanged } from "@/components/service/signin/updateUserProfilePictureIfChanged";
import { fetchUnsplashPhoto } from "@/components/service/unsplash";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/create-itinerary/datePicker";
import { DatePickerWithRange } from "@/components/create-itinerary/datePickerDummy";
import { BsStars } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";
import { BsPersonArmsUp } from "react-icons/bs";
import { GiLovers } from "react-icons/gi";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import LocationAutocomplete from "@/components/service/LocalAutoComplate";

function Page() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTravelWith, setSelectedTravelWith] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
        localStorage.setItem("user", JSON.stringify(response.data));

        const userData = response.data;

        // Simpan data user ke Firestore (jika belum ada)
        saveUserToFirestore(userData);
        console.log("User Data", userData);

        // Perbarui URL foto profil di Firestore jika berbeda
        updateUserProfilePictureIfChanged(userData.id, userData.picture);
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("user");
    console.log("user is:", user);

    if (!user) {
      setOpenDialog(true);
      return;
    } else {
      onGenerateTrip();
    }
  };

  const onGenerateTrip = async () => {
    if (selectedCity && selectedDays && selectedBudget && selectedTravelWith) {
      setLoading(true);
      const newFormData = {
        city: selectedCity,
        days: selectedDays,
        budget: selectedBudget,
        travelWith: selectedTravelWith,
      };
      setFormData(newFormData);

      const FINAL_PROMPT = AI_PROMPT.replace("{location}", selectedCity)
        .replace("{totaldays}", selectedDays.toString())
        .replace("{totaldays2}", selectedDays.toString())
        .replace("{traveler}", selectedTravelWith)
        .replace("{budget}", selectedBudget);

      console.log(FINAL_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("response result: ", result?.response.text());
      setLoading(false);
      saveAITrip(result?.response?.text());
    } else if (!selectedCity) {
      toast("Upss! Anda belum memilih kota tujuan", {
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
    } else if (!selectedDays) {
      toast("Upss! Anda belum menentukan hari anda berlibur.", {
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
      toast("Jika anda memilih 1 hari, ketuk 2x di hari yang sama", {
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
    } else if (!selectedBudget) {
      toast("Upss! Anda belum menentukan budget", {
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
    } else if (!selectedTravelWith) {
      toast("Upss! Anda belum menentukan dengan siapa anda berlibur", {
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
    } else {
      console.error("Please complete all fields");
    }
  };

  const transformTodos = (todos: Record<string, any>) => {
    const transformedTodos: Record<string, any> = {};
    console.log("#todos:");
    console.log(todos);

    Object.entries(todos).forEach(([date, todo]) => {
      const transformedPlans = todo.plan.map((plan: any) => {
        const timeTravel = plan.timeTravel ?? ""; // Pastikan timeTravel ada
        const [timeStart, timeEnd] = timeTravel
          .split("-")
          .map((time: string) => time.trim());

        return {
          name: plan.placeName,
          description: plan.placeDetails,
          cost: plan.ticketPricing,
          image: plan.placeImageUrl,
          geoCoordinates: plan.geoCoordinates,
          rating: plan.rating,
          timeTravel,
          timeStart,
          timeEnd,
          type: "wisata",
          imageList: [],
          tag: [],
        };
      });

      transformedTodos[date] = transformedPlans;
    });

    return transformedTodos;
  };

  const saveAITrip = async (TripData: any) => {
    setLoading(true);

    const userItem = localStorage.getItem("user");
    const user = userItem ? JSON.parse(userItem) : null;

    const nanoFirst = nanoid(5);
    const nanoLast = nanoid(5);
    const docId = nanoFirst + Date.now().toString() + nanoLast;

    const saveFormData = {
      city: selectedCity,
      days: selectedDays,
      budget: selectedBudget,
      travelWith: selectedTravelWith,
    };

    const randomTitle = [
      `Trip ${selectedDays} Hari di ${selectedCity}`,
      `Liburan di ${selectedCity} untuk ${selectedTravelWith}`,
      `Eksplorasi Seru di ${selectedCity} Selama ${selectedDays} Hari`,
      `Rencana Perjalanan ke ${selectedCity} untuk ${selectedTravelWith}`,
      `Jelajahi Keindahan ${selectedCity} dalam ${selectedDays} Hari`,
      `${selectedDays} Hari di ${selectedCity}: Pengalaman Tak Terlupakan`,
    ];

    const randomTitleIndex = Math.floor(Math.random() * randomTitle.length);
    const selectedTitle = randomTitle[randomTitleIndex];

    const parsedTripData = JSON.parse(TripData);

    const startDate = new Date(selectedStartDate ?? ""); // Fallback ke string kosong jika null
    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid start date");
    }

    const todosWithDates: Record<string, any> = {};
    Object.entries(parsedTripData.itinerary).forEach(([key, value], index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index);
      const formattedDate = date.toISOString().split("T")[0];
      todosWithDates[formattedDate] = value;
    });

    const transformedTodos = transformTodos(todosWithDates);

    // ================ UNSPLASH CODE: Insert Photos ================
    // We'll iterate over every plan item and fetch a suitable photo
    for (const dateKey of Object.keys(transformedTodos)) {
      const plans = transformedTodos[dateKey];
      // transformedTodos[dateKey] is an array of "todo" items
      for (let i = 0; i < plans.length; i++) {
        const item = plans[i];
        // We always fetch a new Unsplash photo (force override).
        const searchQuery = item.name || saveFormData.city || "travel";
        try {
          const photoUrl = await fetchUnsplashPhoto(searchQuery);
          if (photoUrl) {
            item.image = photoUrl;
          } else {
            item.image = "/placeholder.png";
          }
        } catch (err) {
          console.error("Unsplash fetch error for:", searchQuery, err);
          item.image = "/placeholder.png";
        }
      }
    }

    // === UNSPLASH CODE: imageCover ===
    let coverUrl = "/placeholder.png";
    try {
      // for better results, you can do e.g. `${saveFormData.city} tourist destination`
      coverUrl =
        (await fetchUnsplashPhoto(saveFormData.city || "travel")) ||
        "/placeholder.png";
    } catch (err) {
      console.error("Unsplash fetch error for cover:", err);
    }

    // ================ End Unsplash Code ================

    const tripData = {
      ...JSON.parse(TripData),
      category: saveFormData.travelWith,
      activitiesOptions: [],
      city: [saveFormData.city],
      dateEnd: selectedEndDate,
      dateStart: selectedStartDate,
      description: "",
      imageCover: "",
      title: selectedTitle,
      totalDays: saveFormData.days,
      totalPrice: 0,
      totalHotelPricePayAble: 0,
      totalActivitiesPricePayAble: 0,
      totalPayAblePrice: 0,
      // username: user?.name,
      public: false,
      publish: false,
      todos: transformedTodos,
    };
    delete tripData.itinerary;

    const data = {
      id: docId,
      contributor: [],
      userId: user?.id,
      // userEmail: user?.email,
      // userPicture: user?.picture,
      userSelection: saveFormData,
      tripData,
    };

    await setDoc(doc(db, "Trips", docId), data);

    console.log("DATA SAVED", data);
    router.push(`/create-itinerary/edit/${docId}`);
    setLoading(false);
  };

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

    console.log("Formatted Start Date:", formattedStartDate);
    console.log("Formatted End Date:", formattedEndDate);
    console.log("Total Days:", data.totalDays);
    setSelectedDays(data.totalDays);
    setSelectedStartDate(formattedStartDate);
    setSelectedEndDate(formattedEndDate);
  };

  return (
    <div className="flex flex-col items-center  w-full gap-8 py-5 mb-10 md:mt-12 md:px-10">
      <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5">
        <h2 className="text-2xl md:text-4xl font-bold">
          Buat Rencana Liburan Anda 🏖️
        </h2>
        <p className="text-gray-500 my-2 md:my-5 text-xs md:text-sm">
          Atur liburan Anda dengan mudah! Masukkan detail seperti kota tujuan,
          durasi liburan, budget, dan dengan siapa anda bepergian. Sistem kami
          akan membantu Anda membuat rencana perjalanan yang sempurna!
        </p>
      </div>
      <SelectCityAndDays
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
      <div className="flex flex-col w-full justify-center max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5  gap-8">
        <div className="mb-4 flex flex-col gap-2 justify-center">
          <label
            htmlFor="days"
            className="block text-md font-bold text-gray-700 dark:text-gray-200"
          >
            Kapan Anda Ingin Berlibur?
          </label>
          <p className="pb-1 text-xs text-gray-400">
            *pilih rentang tanggal dengan{" "}
            <span className="font-semibold text-gray-600">maksimal 5 hari</span>
          </p>

          <div className="flex flex-row gap-2 h-12 items-center w-full">
            <DatePicker className="h-12 " onDateChange={handleDateChange} />
            <div className="flex items-center justify-center py-2 px-3 h-12 items-center text-center text-sm bg-gray-200 rounded-lg ">
              {selectedDays ?? "0"} hari
            </div>
          </div>
        </div>
      </div>
      <SelectBudget
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
      />
      <SelectTravelWith
        selectedTravelWith={selectedTravelWith}
        setSelectedTravelWith={setSelectedTravelWith}
      />
      <div className="mt-12">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex flex-row gap-2 items-center bg-gray-800 rounded-xl px-4 py-3 text-white hover:rounded-full hover:scale-95"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <BsStars /> Generate Trip by AI
            </>
          )}
        </button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <h2 className="font-bold  text-lg mt-7">Sign In With Google</h2>
              <p className=" mt-1">
                Sign In dengan aman menggunakan google authentication
              </p>
              <Button
                disabled={loading}
                className="w-full mt-5"
                onClick={() => login()}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <FcGoogle className="mr-3 h-6 w-6" /> Sign In With Google
                  </>
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

interface SelectCityAndDaysProps {
  selectedCity: string | null;
  setSelectedCity: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDays: number | null;
  setSelectedDays: React.Dispatch<React.SetStateAction<number | null>>;
}

const SelectCityAndDays: React.FC<SelectCityAndDaysProps> = ({
  selectedCity,
  setSelectedCity,
  selectedDays,
  setSelectedDays,
}) => {
  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5  gap-8">
      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="city"
          className="block text-md font-bold text-gray-700 dark:text-gray-200"
        >
          Kota Apa yang Ingin Kamu Kunjungi?
        </label>

        {/* <p className="pb-1 text-xs text-gray-400">
            *tersedia untuk: Indonesia, Singapura, Malaysia, Thailand, Vietnam dan Filipina.
        </p>

        <GooglePlacesAutocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
          selectProps={{
            onChange: (value: any) => {
              setSelectedCity(value?.label || null); 
            },
            placeholder: 'Pilih kota tujuan...',
          }}
          autocompletionRequest={{
            componentRestrictions: {
              country: ['ID', 'SG', 'MY', 'TH', 'VN','PH'], 
            },
            types: ['(cities)'], 
          }}
        /> */}
        <LocationAutocomplete
          onSelect={(city) => setSelectedCity(city)} // Simpan kota yang dipilih
          typeProps="AITrip" // Contoh styling yang bisa diubah nantinya
          initialCity=""
        />
        {selectedCity ? (
            <p className="mt-2 text-xs">
              Daerah yang dipilih: <span className="font-semibold">{selectedCity}</span>
            </p>
          ) : (
            <p className="mt-2 text-xs">
              Daerah yang dipilih: <span className="font-semibold">Anda Belum Memilih Kota</span>
            </p>
          )}

{/* 
        <div className="relative w-full items-center">
          <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base" />
          <input
            type="text"
            id="location"
            placeholder="Masukkan Nama Kota"
            onChange={(e) => setSelectedCity(e.target.value)}
            className="mt-1 block w-full pl-10 p-2 h-12 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm hover:bg-gray-100 hover:placeholder-gray-700 transition-all duration-300 ease-in-out"
          />
        </div> */}
      </div>
    </div>
  );
};

interface SelectBudgetProps {
  selectedBudget: string | null;
  setSelectedBudget: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectBudget: React.FC<SelectBudgetProps> = ({
  selectedBudget,
  setSelectedBudget,
}) => {
  const options = [
    {
      label: "Hemat",
      value: "Cheap",
      icon: <TbPigMoney />,
      description: "Fokus pada efisiensi biaya",
    },
    {
      label: "Sedang",
      value: "Moderate",
      icon: <TbMoneybag />,
      description: "Menyeimbangkan biaya dan pengalaman",
    },
    {
      label: "Mewah",
      value: "Luxury",
      icon: <GiTakeMyMoney />,
      description: "Tidak mengkhawatirkan biaya",
    },
  ];

  return (
    <div className="flex flex-col w-full md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <div className="flex flex-col gap-1 text-start justify-start">
        <h2 className="text-md font-bold text-gray-700 dark:text-gray-200">
          Berapa Budget Anda?
        </h2>
        <h2 className="text-sm text-gray-400 dark:text-gray-200">
          *Pilih satu
        </h2>
      </div>
      <div className="flex flex-row flex-wrap gap-2 md:gap-4 lg:gap-6">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedBudget(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-full md:w-48 transition-all duration-300 ease-in-out transform ${
              selectedBudget === option.value
                ? "border-gray-700 bg-gray-800 text-white md:scale-105 shadow-lg"
                : "hover:border-gray-700 hover:bg-gray-800 hover:text-white hover:shadow-md"
            }`}
          >
            <h2 className="text-4xl transition-opacity duration-300 ease-in-out ">
              {option.icon}
            </h2>
            <h2 className="text-md font-bold transition-transform duration-300 ease-in-out ">
              {option.label}
            </h2>
            <p
              className={`text-xs transition-all duration-300 ease-in-out ${
                selectedBudget === option.value
                  ? "text-gray-200"
                  : "text-gray-500 group-hover:text-gray-200 group-hover:opacity-90"
              }`}
            >
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SelectTravelWithProps {
  selectedTravelWith: string | null;
  setSelectedTravelWith: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectTravelWith: React.FC<SelectTravelWithProps> = ({
  selectedTravelWith,
  setSelectedTravelWith,
}) => {
  const options = [
    {
      label: "Solo Trip",
      value: "Solo Trip",
      icon: <BsPersonArmsUp />,
      description: "Petualangan seru untuk diri sendiri!",
    },
    {
      label: "Pasangan",
      value: "Date",
      icon: <GiLovers />,
      description: "Buat cerita romantis bersama pasangan",
    },
    {
      label: "Keluarga",
      value: "Family",
      icon: <MdOutlineFamilyRestroom />,
      description: "Liburan nyaman untuk semua anggota keluarga.",
    },
    {
      label: "Sahabat",
      value: "Friends",
      icon: <GiThreeFriends />,
      description: "Buat kenangan terbaik bersama teman-teman!",
    },
  ];

  return (
    <div className="flex flex-col w-full  md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <div className="flex flex-col gap-1 text-start justify-start">
        <h2 className="text-md font-bold text-gray-700 dark:text-gray-200">
          Dengan Siapa Anda Berwisata?
        </h2>
        <h2 className="text-sm text-gray-400 dark:text-gray-200">
          *Pilih satu
        </h2>
      </div>
      <div className="flex flex-row flex-wrap gap-2 md:gap-4 lg:gap-6">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedTravelWith(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-full md:w-48 transition-all duration-300 ease-in-out transform ${
              selectedTravelWith === option.value
                ? "border-gray-700 bg-gray-800 text-white md:scale-105 shadow-lg"
                : "hover:border-gray-700 hover:bg-gray-800 hover:text-white hover:shadow-md"
            }`}
          >
            <h2 className="text-4xl transition-opacity duration-300 ease-in-out ">
              {option.icon}
            </h2>
            <h2 className="text-md font-bold transition-transform duration-300 ease-in-out ">
              {option.label}
            </h2>
            <p
              className={`text-xs transition-all duration-300 ease-in-out ${
                selectedTravelWith === option.value
                  ? "text-gray-200"
                  : "text-gray-500 group-hover:text-gray-200 group-hover:opacity-90"
              }`}
            >
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
