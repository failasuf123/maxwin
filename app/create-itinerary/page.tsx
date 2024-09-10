'use client'
import React, { useEffect, useState } from 'react'
import { AI_PROMPT } from '@/app/constants/Option';
import { chatSession } from '../service/AIModel';

function Page() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTravelWith, setSelectedTravelWith] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleSubmit = async () => {
    if (selectedCity && selectedDays && selectedBudget && selectedTravelWith) {
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
    } else {
      console.error('Please complete all fields');
    }
  };

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
          className="bg-gray-800 rounded-xl px-4 py-3 text-white hover:rounded-full hover:scale-95"
        >
          Generate by AI
        </button>
      </div>
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
              selectedBudget === option.value ? 'bg-cyan-500 text-white' : 'hover:bg-cyan-500 hover:scale-105'
            }`}
          >
            <h2 className="text-4xl">{option.icon}</h2>
            <h2 className="text-md font-bold group-hover:text-white">{option.label}</h2>
            <p className="text-xs text-gray-500 group-hover:text-gray-200">{option.description}</p>
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
              selectedTravelWith === option.value ? 'bg-cyan-500 text-white' : 'hover:bg-cyan-500 hover:scale-105'
            }`}
          >
            <h2 className="text-4xl">{option.icon}</h2>
            <h2 className="text-md font-bold group-hover:text-white">{option.label}</h2>
            <p className="text-xs text-gray-500 group-hover:text-gray-200">{option.description}</p>
          </div>
        ))}
      </div>
    </div>

  );
}

export default Page;
