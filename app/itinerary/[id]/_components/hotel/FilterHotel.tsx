import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa';

interface FilterHotelProps {
  onFilter: (filters: any) => void;
  initialCityId?: number[];
  initialCityName?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

function FilterHotel({ 
  onFilter,
  initialCityId,
  initialCityName,
  initialStartDate = "2025-07-01",
  initialEndDate = "2025-07-05"
}: FilterHotelProps) {
    const [city, setCity] = useState<string>(initialCityName || "");
    const [cityId, setCityId] = useState<number[] | null>(initialCityId || null);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [discountOnly, setDiscountOnly] = useState<boolean>(false);
    const [minStarRating, setMinStarRating] = useState<number | null>(null);
    const [minReviewScore, setMinReviewScore] = useState<number | null>(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
    const [cityInput, setCityInput] = useState<string>(initialCityName || "");
    const [cityList, setCityList] = useState<any[]>([]);
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const [checkInDate, setCheckInDate] = useState<string>(initialStartDate);
    const [checkOutDate, setCheckOutDate] = useState<string>(initialEndDate);

    useEffect(() => {
      fetch("/city_list.json")
        .then((response) => response.json())
        .then((data) => setCityList(data))
        .catch((error) => console.error("Error loading city data:", error));
    }, []);

    useEffect(() => {
      if (cityInput) {
        const filtered = cityList.filter(
          (item) => item.city.toLowerCase().includes(cityInput.toLowerCase())
        );
        setFilteredCities(filtered);
      } else {
        setFilteredCities([]);
      }
    }, [cityInput, cityList]);

    const handleCitySelect = (selectedCity: any) => {
      setCity(selectedCity.city);
      setCityId(selectedCity.city_id);
      setCityInput(`${selectedCity.city}`);
      setFilteredCities([]);
    };

    const toggleAccordion = () => {
      setIsAccordionOpen(!isAccordionOpen);
    };

    const handleSearch = () => {
      if (!cityId) {
        alert("Silakan pilih kota terlebih dahulu");
        return;
      }

      onFilter({
        cityId,
        cityName: city,
        checkInDate,
        checkOutDate,
        minPrice,
        maxPrice,
        discountOnly,
        minStarRating,
        minReviewScore
      });
    };

    return (
      <div className="flex flex-col items-center gap-1 w-full">
        
        {/* Date pickers */}
        <div className="flex flex-row gap-2 w-full mt-2">
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center p-1 w-full justify-between gap-3">
          <div
            className="flex flex-row gap-2 rounded-xl w-full px-3 py-1 md:py-3 border-lg border-2 border-solid border-gray-400 items-center text-gray-500 hover:text-gray-600 font-semibold cursor-pointer text-center justify-center"
            onClick={toggleAccordion}
          >
            <FaFilter />
            Filter
          </div>
          <div 
            className="flex flex-row gap-2 rounded-xl px-3 py-3  bg-gray-800 hover:bg-cyan-500 items-center text-white font-semibold cursor-pointer text-center justify-center"
            onClick={handleSearch}
          >
            <FaSearch  />
            <span className="hidden md:block">Cari</span>
          
          </div>
        </div>

  
        <hr className="w-full bg-gray-600 my-2" />
        
        {/* Filter panel */}
        <div className="w-full">
          <AnimatePresence>
            {isAccordionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Rentang Harga (per malam)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Harga Minimum"
                        className="w-full p-2 border rounded-md"
                        value={minPrice || ""}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        placeholder="Harga Maksimum"
                        className="w-full p-2 border rounded-md"
                        value={maxPrice || ""}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={discountOnly}
                        onChange={(e) => setDiscountOnly(e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">
                        Tampilkan Hotel dengan Diskon Saja
                      </span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Rating Bintang Minimum
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={minStarRating || ""}
                      onChange={(e) => setMinStarRating(Number(e.target.value))}
                    >
                      <option value="">Pilih Rating</option>
                      <option value="1">1 Bintang</option>
                      <option value="2">2 Bintang</option>
                      <option value="3">3 Bintang</option>
                      <option value="4">4 Bintang</option>
                      <option value="5">5 Bintang</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Skor Ulasan Minimum
                    </label>
                    <input
                      type="number"
                      placeholder="Skor Ulasan (1-10)"
                      className="w-full p-2 border rounded-md"
                      value={minReviewScore || ""}
                      onChange={(e) => setMinReviewScore(Number(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <hr className="w-full bg-gray-600 my-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
}

export default FilterHotel
