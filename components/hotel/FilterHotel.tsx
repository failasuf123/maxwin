import React, { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import {
  TypeList,
  CityList,
  StateList,
} from "@/components/hotel/service/listCityAndType";
import { FaLocationDot } from "react-icons/fa6";

interface FilterHotelProps {
  onFilter: (filters: { city: string; state: string; type: string }) => void;
}

function FilterHotel({ onFilter }: FilterHotelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Indonesia");
  const [selectedState, setSelectedState] = useState("Indonesia");
  const [selectedType, setSelectedType] = useState("All Type");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([...CityList]);
  const [filteredStates, setFilteredStates] = useState([...StateList]);

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter cities and states based on search term
    const filteredCities = CityList.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    const filteredStates = StateList.filter((state) =>
      state.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCities(filteredCities);
    setFilteredStates(filteredStates);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchTerm(city);
    setShowCityDropdown(false);
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSearchTerm(state);
    setShowStateDropdown(false);
  };

  const handleTypeChange = (e: any) => {
    setSelectedType(e.target.value);
  };

  const handleFilterClick = () => {
    const filters = {
      city: selectedCity,
      state: selectedState,
      type: selectedType,
    };
    onFilter(filters);
  };

  return (
    <div className="flex flex-row w-full items-center justify-center md:justify-start gap-2 md:gap-3 pd-2 md:py-5 md:py-3">
      {/* Search Bar */}
      <div className="w-full md:w-full h-10 md:h-12 flex flex-row justify-start items-center border-2 border-gray-500 rounded-lg gap-2 px-3 relative">
        {/* <FaSearchLocation className="text-xl text-gray-500" /> */}
        <FaLocationDot className="text-base md:text-xl text-gray-500" />

        <input
          className="w-full h-full px-2 outline-none text-xs placeholder-xs md:text-base lg:placeholder-base"
          type="text"
          placeholder="Cari Kota/Provinsi..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => {
            setShowCityDropdown(true);
            setShowStateDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowCityDropdown(false);
              setShowStateDropdown(false);
            }, 200);
          }}
        />
        {(showCityDropdown || showStateDropdown) && searchTerm.length >= 2 && (
          <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 text-xs md:text-base max-h-48 overflow-y-auto">
            {/* Opsi default */}
            <div
                className="p-2 hover:bg-gray-100 cursor-pointer flex flex-row gap-1 md:gap-3 items-end"
                onMouseDown={() => handleCitySelect("Indonesia")}
            >
              Indonesia  <span className="text-[9px] gray-300 font-light text-end">*Semua kota/provinsi</span>
            </div>
 

            {/* Batasi hasil max 6 dan tambahkan scroll jika lebih */}
            {filteredCities.slice(0, 6).map((city, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer flex flex-row gap-1 items-end"
                onMouseDown={() => handleCitySelect(city)}
              >
                {city} 
              </div>
            ))}

            {filteredStates.slice(0, 6).map((state, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer flex flex-row gap-1 items-end"
                onMouseDown={() => handleStateSelect(state)}
              >
                {state} <span className="text-[9px] gray-300 font-light text-end">*Provinsi</span>
              </div>
            ))}
          </div>
        )}


      </div>

      {/* Hotel Type Filter */}
      <div className="flex flex-row gap-1 items-center justify-center px-1 md:px-3 py-1 border-2 border-gray-500 rounded-lg h-10 md:h-12 text-sm md:text-base ">
        <div className="hidden md:block">
          <MdHotel />
        </div>
        <div className="hidden md:block">|</div>
        <div>
          <select
            className="bg-transparent outline-none cursor-pointer h-full text-xs placeholder-xs md:text-base lg:placeholder-base"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="All Type">All Type</option>
            {TypeList.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Button */}
      <button
        className="bg-cyan-500 text-white px-4 py-2 rounded-lg h-10 md:h-12 flex flex-row gap-2 items-center justify-center hover:bg-gray-800 hidden md:flex"
        onClick={handleFilterClick}
      >
        <FaSearchLocation className="text-base " />
        Cari
      </button>
      <button
        className="bg-cyan-500 text-white px-3 py-2 rounded-lg h-10 md:h-12 flex flex-row gap-2 items-center justify-center hover:bg-gray-800 md:hidden"
        onClick={handleFilterClick}
      >
        <FaSearchLocation className="text-sm " />
      </button>
    </div>
  );
}

export default FilterHotel;

// import React, { useState } from "react";
// import { FaSearchLocation } from "react-icons/fa";
// import { MdHotel } from "react-icons/md";
// import { TypeList, CityList, StateList } from "@/components/hotel/service/listCityAndType";
// import { getRandomHotels } from "@/components/hotel/service/getHotel";

// interface FilterHotelProps {
//     onFilter: (filters: { city: string; state: string; type: string }) => void;
//   }

// function FilterHotel({ onFilter} : FilterHotelProps ) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCity, setSelectedCity] = useState("");
//     const [selectedState, setSelectedState] = useState("");
//     const [selectedType, setSelectedType] = useState("All Type");
//     const [showCityDropdown, setShowCityDropdown] = useState(false);
//     const [showStateDropdown, setShowStateDropdown] = useState(false);
//     const [filteredCities, setFilteredCities] = useState([...CityList]);
//     const [filteredStates, setFilteredStates] = useState([...StateList]);

//     const handleSearchChange = (e:any) => {
//         const value = e.target.value;
//         setSearchTerm(value);

//         // Filter cities and states based on search term
//         const filteredCities = CityList.filter(city =>
//           city.toLowerCase().includes(value.toLowerCase())
//         );
//         const filteredStates = StateList.filter(state =>
//           state.toLowerCase().includes(value.toLowerCase())
//         );

//         setFilteredCities(filteredCities);
//         setFilteredStates(filteredStates);
//       };

//       const handleCitySelect = (city:string) => {
//         setSelectedCity(city);
//         setSearchTerm(city);
//         setShowCityDropdown(false);
//       };

//       const handleStateSelect = (state:string) => {
//         setSelectedState(state);
//         setSearchTerm(state);
//         setShowStateDropdown(false);
//       };

//       const handleTypeChange = (e:any) => {
//         setSelectedType(e.target.value);
//       };

//       const handleFilterClick = () => {
//         const filters = {
//           city: selectedCity,
//           state: selectedState,
//           type: selectedType,
//         };
//         onFilter(filters);
//       };

//       return (
//         <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-start gap-2 md:gap-3 py-5 px-3">
//           {/* Search Bar */}
//           <div className="w-full md:w-96 h-10 flex flex-row justify-start items-center border-2 border-gray-500 rounded-lg gap-2 px-3 relative">
//             <FaSearchLocation className="text-xl text-gray-500" />
//             <input
//               className="w-full h-full px-2 outline-none"
//               type="text"
//               placeholder="Cari Kota/Provinsi..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onFocus={() => {
//                 setShowCityDropdown(true);
//                 setShowStateDropdown(true);
//               }}
//               onBlur={() => {
//                 setTimeout(() => {
//                   setShowCityDropdown(false);
//                   setShowStateDropdown(false);
//                 }, 200);
//               }}
//             />
//             {(showCityDropdown || showStateDropdown) && (
//               <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
//                 {filteredCities.map((city, index) => (
//                   <div
//                     key={index}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onMouseDown={() => handleCitySelect(city)}
//                   >
//                     {city} (kota)
//                   </div>
//                 ))}
//                 {filteredStates.map((state, index) => (
//                   <div
//                     key={index}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onMouseDown={() => handleStateSelect(state)}
//                   >
//                     {state} (provinsi)
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Hotel Type Filter */}
//           <div className="flex flex-row gap-1 items-center justify-center px-2 py-1 bg-gray-100 rounded-lg h-10">
//             <div><MdHotel /></div>
//             <div>|</div>
//             <div>
//               <select
//                 className="bg-transparent outline-none"
//                 value={selectedType}
//                 onChange={handleTypeChange}
//               >
//                 {TypeList.map((type, index) => (
//                   <option key={index} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Filter Button */}
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             onClick={handleFilterClick}
//           >
//             Cari
//           </button>
//         </div>
//       );
//     }

//     export default FilterHotel;
