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
import { fetchUnsplashPhoto } from "@/app/service/unsplash"; 

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
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data));
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
      toast("Upss! Anda belum menentukan berapa hari anda berlibur", {
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
      console.error("Silahkan isi lengkap form terlebih dahulu");
    }
  };

  const transformTodos = (todos: Record<string, any>) => {
    const transformedTodos: Record<string, any> = {};
  
    Object.entries(todos).forEach(([date, todo]) => {
      const transformedPlans = todo.plan.map((plan: any) => {
        const timeTravel = plan.timeTravel ?? ""; // Pastikan timeTravel ada
        const [timeStart, timeEnd] = timeTravel.split("-").map((time: string) => time.trim());
  
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
    
    // 1) Parse the AI's JSON
    const parsedTripData = JSON.parse(TripData);
    // 2) Generate "todosWithDates" from AI data
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

  // 3) Transform AI's format into your local "Todo" objects
  const transformedTodos = transformTodos(todosWithDates);

  // ================ UNSPLASH CODE: Insert Photos ================
  // We'll iterate over every plan item and fetch a suitable photo
  for (const dateKey of Object.keys(transformedTodos)) {
    const plans = transformedTodos[dateKey];
    // transformedTodos[dateKey] is an array of "todo" items
    for (let i = 0; i < plans.length; i++) {
      const item = plans[i];

      // If there's no place image, or you want to override
      // We'll search with place name or city name
      if (!item.image || item.image.trim() === "") {
        const searchQuery = item.name || saveFormData.city || "travel"; 
        const photoUrl = await fetchUnsplashPhoto(searchQuery);
        item.image = photoUrl || "/placeholder.png";
      }
    }
  }
  // ================ End Unsplash Code ================

  // Build final tripData object
  const tripData = {
    ...JSON.parse(TripData),
    category: saveFormData.travelWith,
    activitiesOptions: [],
    city: saveFormData.city,
    dateEnd: selectedEndDate,
    dateStart: selectedStartDate,
    description: "",
    imageCover: "", // you might do a separate unsplash fetch for a "cover" too
    title: selectedTitle,
    totalDays: saveFormData.days,
    totalPrice: 0,
    totalHotelPricePayAble: 0,
    totalActivitiesPricePayAble: 0,
    totalPayAblePrice: 0,
    username: user?.name,
    todos: transformedTodos, // Our updated "todos" with images
  };

  delete tripData.itinerary; // remove AI-specific field

  const data = {
    id: docId,
    public: false,
    publish: false,
    contributor: [],
    userId: user?.id,
    userEmail: user?.email,
    userPicture: user?.picture,
    userSelection: saveFormData,
    tripData,
  };

  await setDoc(doc(db, "Trips", docId), data);

  console.log("DATA SAVED", data);
  router.push(`/create-itinerary/edit/${docId}`);
  setLoading(false);
  };

  useEffect(() => {
    console.log("Updated formData: ", formData);
  }, [formData]);

  const [dateInfo, setDateInfo] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    totalDays: 0,
  });

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
    <div className="flex flex-col items-center w-full gap-8 py-5 mb-10 md:mt-12 md:px-10">
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
      <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5  gap-8">
        <div className="mb-4 flex flex-col gap-2">
          <label
            htmlFor="days"
            className="block text-md font-bold text-gray-700 dark:text-gray-200"
          >
            Kapan Anda Ingin Berlibur?
          </label>
          <p className="pb-1 text-xs text-gray-400">
            *pilih rentang tanggal dengan <b>maksimal 5 hari</b>
          </p>

          <div className="flex flex-row gap-2 items-center">
            <DatePicker onDateChange={handleDateChange} />
            <div className="py-2 px-3 text-sm bg-gray-200 rounded-xl ">
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
          className="bg-gray-800 rounded-xl px-4 py-3 text-white hover:rounded-full hover:scale-95"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            <>Buat Trip</>
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

        <p className="pb-1 text-xs text-gray-400">
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
        />

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
      icon: "💵",
      description: "Fokus pada efisiensi biaya",
    },
    {
      label: "Sedang",
      value: "Moderate",
      icon: "💰",
      description: "Menyeimbangkan Biaya dan Pengalaman",
    },
    {
      label: "Mewah",
      value: "Luxury",
      icon: "💸",
      description: "Tidak mengkhawatirkan biaya",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <h2 className="block text-md font-bold text-gray-700 dark:text-gray-200">
        Berapa Budget Anda?
      </h2>
      <div className="flex flex-row flex-wrap gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedBudget(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-44 ${
              selectedBudget === option.value
                ? "border-4 border-gray-600 text-cyan-600 "
                : "hover:border-4 border-gray-600 hover:scale-105"
            }`}
          >
            <h2 className="text-4xl">{option.icon}</h2>
            <h2 className="text-md font-bold ">{option.label}</h2>
            <p className="text-xs text-gray-500 ">{option.description}</p>
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
      icon: "🏄🏻‍♂️",
      description: "Eksplorasi diri dan kebebasan",
    },
    {
      label: "Pasangan",
      value: "Date",
      icon: "👩🏻‍🤝‍👨🏽",
      description: "Romantis untuk mempererat hubungan",
    },
    {
      label: "Keluarga",
      value: "Family",
      icon: "👨🏻‍👩🏻‍👧🏻‍👧🏻",
      description: "Quality time dan ramah anak",
    },
    {
      label: "Sahabat",
      value: "Friends",
      icon: "💯",
      description: "Bersenang-senang dan menciptakan kenangan",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <h2 className="block text-md font-bold text-gray-700 dark:text-gray-200">
        Dengan Siapa Anda Berwisata?
      </h2>
      <div className="flex flex-row flex-wrap gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedTravelWith(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-44 ${
              selectedTravelWith === option.value
                ? "border-4 border-gray-600 text-cyan-600"
                : "hover:border-4 border-gray-600 hover:scale-105"
            }`}
          >
            <h2 className="text-4xl">{option.icon}</h2>
            <h2 className="text-md font-bold ">{option.label}</h2>
            <p className="text-xs text-gray-500 ">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
