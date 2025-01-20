// src/components/home/SearchBar.tsx

import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

interface SearchBarProps {
  onSearch: (city: string | null) => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCitySelect = (value: any) => {
    // `value?.label` usually gives the formatted address, e.g. "Jakarta, Indonesia"
    setSelectedCity(value?.label || null);
  };

  const handleSearchClick = () => {
    onSearch(selectedCity);
  };

  return (
    <div className="flex flex-col items-center mt-6 space-y-3 md:flex-row md:space-y-0 md:space-x-2">
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          onChange: handleCitySelect,
          placeholder: 'Pilih kota tujuan...',
        }}
        autocompletionRequest={{
          componentRestrictions: {
            country: ['ID', 'SG', 'MY', 'TH', 'VN', 'PH'],
          },
          types: ['(cities)'],
        }}
      />

      <button
        onClick={handleSearchClick}
        className="w-full px-4 py-2 font-medium text-white bg-yellow-500 rounded-md md:w-auto hover:bg-yellow-600 focus:outline-none"
      >
        Cari
      </button>
    </div>
  );
};

export default SearchBar;
