'use client'
import React, { useEffect, useState } from 'react'
import { AI_PROMPT } from '@/app/constants/option';
import { chatSession } from '@/app/service/AIModel';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import { doc, setDoc } from "firebase/firestore"; 
import { nanoid } from 'nanoid';
import { db } from '@/app/service/firebaseConfig';
import { ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from 'next/navigation';

function Page() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTravelWith, setSelectedTravelWith] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>getUserProfile(codeResp),
    onError:(error)=>console.log(error),
  })

  const getUserProfile = (tokenInfo:any) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((response)=>{
      console.log(response)
      localStorage.setItem('user', JSON.stringify(response.data))
      setOpenDialog(false)
      onGenerateTrip()
    })
  }

  const handleSubmit = async () => {
    const user = localStorage.getItem('user')
    console.log("user is:", user)

    if (!user){
      setOpenDialog(true)
      return
    }
    else{
      onGenerateTrip();
    }
  }

  const onGenerateTrip = async () => {

    if (selectedCity && selectedDays && selectedBudget && selectedTravelWith) {
      setLoading(true)
      const newFormData = {
        city: selectedCity,
        days: selectedDays,
        budget: selectedBudget,
        travelWith: selectedTravelWith
      };
      setFormData(newFormData);
      
      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', selectedCity)
        .replace('{totaldays}', selectedDays.toString())
        .replace('{totaldays2}', selectedDays.toString())
        .replace('{traveler}', selectedTravelWith)
        .replace('{budget}', selectedBudget)
      
      console.log(FINAL_PROMPT)

      const result = await chatSession.sendMessage(FINAL_PROMPT)
      console.log(result?.response.text())
      setLoading(false)
      saveAITrip(result?.response?.text())
    } 
    else if (!selectedCity){
      toast('Upss! Anda belum memilih kota tujuan', {
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
    else if (!selectedDays){
      toast('Upss! Anda belum menentukan berapa hari anda berlibur', {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        })
    }
    else if (!selectedBudget){
      toast('Upss! Anda belum menentukan budget', {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        })

    }
    else if (!selectedTravelWith){
      toast('Upss! Anda belum menentukan dengan siapa anda berlibur', {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        })
 
    }
    
    else {
      console.error('Please complete all fields');
    }
  };


  const saveAITrip = async (TripData:any) => {
    setLoading(true)
    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) : null;    
    const nanoFirst = nanoid(3);
    const nanoLast = nanoid(4);
    const docId = nanoFirst + Date.now().toString() + nanoLast

    const saveFormData = {
      city: selectedCity,
      days: selectedDays,
      budget: selectedBudget,
      travelWith: selectedTravelWith
    };

    await setDoc(doc(db, "AiTrips", docId), {
      userSelection:saveFormData,
      tripData: JSON.parse(TripData),
      userEmail:user?.email,
      id:docId,
    });
    setLoading(false)
    router.push(`/view-trip/${docId}`)
  }

  useEffect(() => {
    console.log("Updated formData: ", formData);
  }, [formData]);
  

  return (
    <div className="flex flex-col items-center w-full gap-8 py-5 mb-10 md:mt-12 md:px-10">
      <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5">
        <h2 className="text-2xl md:text-4xl font-bold">Buat Rencana Liburan Anda 🏖️</h2>
        <p className="text-gray-500 my-2 md:my-5 text-xs md:text-sm">
          Atur liburan Anda dengan mudah! Masukkan detail seperti kota tujuan, durasi liburan, budget, dan dengan siapa anda bepergian. 
          Sistem kami akan membantu Anda membuat rencana perjalanan yang sempurna!       
        </p>

      </div>
      <SelectCityAndDays
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
      <SelectBudget selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget} />
      <SelectTravelWith selectedTravelWith={selectedTravelWith} setSelectedTravelWith={setSelectedTravelWith} />
      <div className="mt-12">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gray-800 rounded-xl px-4 py-3 text-white hover:rounded-full hover:scale-95"
        >
          {loading ? 
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />:
            <>
              Generate Trip by AI
            </>
          }
        </button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <h2 className="font-bold  text-lg mt-7">Sign In With Google</h2>
              <p className=" mt-1">Sign In dengan aman menggunakan google authentication</p>
              <Button 
                disabled={loading}
                className="w-full mt-5"
                onClick={() => login()}
                >
                {loading ?
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />:
                  <>
                    <FcGoogle className="mr-3 h-6 w-6" /> Sign In With Google
                  </>
                }
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

const SelectCityAndDays: React.FC<SelectCityAndDaysProps> = ({ selectedCity, setSelectedCity, selectedDays, setSelectedDays }) => {
  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5  gap-8">
      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="city" className="block text-md font-bold text-gray-700 dark:text-gray-200">
          Kota Apa yang Ingin Kamu Kunjungi?
        </label>
        <input
          id="city"
          className="px-2 w-full py-2 rounded-md border text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setSelectedCity(e.target.value)}
        />
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="days" className="block text-md font-bold text-gray-700 dark:text-gray-200">
          Berapa Hari Rencana Liburan Anda?
        </label>
        <input
          id="days"
          type="number"
          className="px-2 w-full py-2 rounded-md border text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

interface SelectBudgetProps {
  selectedBudget: string | null;
  setSelectedBudget: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectBudget: React.FC<SelectBudgetProps> = ({ selectedBudget, setSelectedBudget }) => {
  const options = [
    { label: "Hemat", value: "Cheap", icon: "💵", description: "Fokus pada efisiensi biaya" },
    { label: "Sedang", value: "Moderate", icon: "💰", description: "Menyeimbangkan Biaya dan Pengalaman" },
    { label: "Mewah", value: "Luxury", icon: "💸", description: "Tidak mengkhawatirkan biaya" },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <h2 className="block text-md font-bold text-gray-700 dark:text-gray-200">Berapa Budget Anda?</h2>
      <div className="flex flex-row flex-wrap gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedBudget(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-44 ${
              selectedBudget === option.value ? 'border-4 border-gray-600 text-cyan-600 ' : 'hover:border-4 border-gray-600 hover:scale-105'
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

const SelectTravelWith: React.FC<SelectTravelWithProps> = ({ selectedTravelWith, setSelectedTravelWith }) => {
  const options = [
    { label: "Solo Trip", value: "solo", icon: "🏄🏻‍♂️", description: "Dengan memperhatikan biaya" },
    { label: "Pasangan", value: "couple", icon: "👩🏻‍🤝‍👨🏽", description: "Memastikan biaya rata-rata" },
    { label: "Keluarga", value: "family", icon: "👨🏻‍👩🏻‍👧🏻‍👧🏻", description: "Tidak mengkhawatirkan biaya" },
    { label: "Sahabat", value: "friends", icon: "💯", description: "Tidak mengkhawatirkan biaya" },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-5 mt-5 items-start gap-6">
      <h2 className="block text-md font-bold text-gray-700 dark:text-gray-200">Dengan Siapa Anda Berwisata?</h2>
      <div className="flex flex-row flex-wrap gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedTravelWith(option.value)}
            className={`flex flex-col group gap-1 cursor-pointer justify-center px-5 py-3 border-2 rounded-lg h-32 w-44 ${
              selectedTravelWith === option.value ? 'border-4 border-gray-600 text-cyan-600' : 'hover:border-4 border-gray-600 hover:scale-105'
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
}



export default Page;

