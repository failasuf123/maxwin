import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

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
    const [minPrice, setMinPrice] = useState<number>(200000);
    const [maxPrice, setMaxPrice] = useState<number>(2000000);
    const [discountOnly, setDiscountOnly] = useState<boolean>(false);
    const [minStarRating, setMinStarRating] = useState<number | null>(null);
    const [minReviewScore, setMinReviewScore] = useState<number | null>(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
    const [cityInput, setCityInput] = useState<string>(initialCityName || "");
    const [cityList, setCityList] = useState<any[]>([]);
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const [checkInDate, setCheckInDate] = useState<string>(initialStartDate);
    const [checkOutDate, setCheckOutDate] = useState<string>(initialEndDate);
    
    // State untuk error harga
    const [priceError, setPriceError] = useState<string | null>(null);

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

    // Validasi harga sebelum melakukan filter
    const validateAndSearch = () => {
      if (!cityId) {
        alert("Silakan pilih kota terlebih dahulu");
        return;
      }

      // Validasi harga
      if (minPrice > maxPrice) {
        setPriceError("Harga minimum tidak boleh lebih besar dari harga maksimum");
        return;
      } else {
        setPriceError(null);
      }

      onFilter({
        cityId,
        cityName: city,
        checkInDate,
        checkOutDate,
        minPrice: minPrice,
        maxPrice: maxPrice,
        discountOnly,
        minStarRating,
        minReviewScore
      });
    };

    // Format angka menjadi mata uang Rupiah
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Handler untuk perubahan minPrice dengan validasi
    const handleMinPriceChange = (value: number) => {
      setMinPrice(value);
      if (value > maxPrice) {
        setPriceError("Harga minimum tidak boleh lebih besar dari harga maksimum");
      } else {
        setPriceError(null);
      }
    };

    // Handler untuk perubahan maxPrice dengan validasi
    const handleMaxPriceChange = (value: number) => {
      setMaxPrice(value);
      if (value < minPrice) {
        setPriceError("Harga maksimum tidak boleh lebih kecil dari harga minimum");
      } else {
        setPriceError(null);
      }
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
            onClick={validateAndSearch}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rentang Harga (per malam)
                    </label>
                    
                    {/* Pesan error */}
                    {priceError && (
                      <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-600" />
                        <span className="text-sm">{priceError}</span>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Harga Minimum
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="5000000"
                            step="100000"
                            value={minPrice}
                            onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm font-medium min-w-[120px] text-right">
                            {formatCurrency(minPrice)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Harga Maksimum
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="5000000"
                            step="100000"
                            value={maxPrice}
                            onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm font-medium min-w-[120px] text-right">
                            {formatCurrency(maxPrice)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: {formatCurrency(0)}</span>
                        <span>Max: {formatCurrency(5000000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter lainnya dengan tampilan yang lebih baik */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center cursor-pointer">
                      <span className="mr-3 text-sm text-gray-700">
                        Mau tampilkan Hotel yang Diskon aja?
                      </span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-cyan-600 transition duration-150 ease-in-out"
                        checked={discountOnly}
                        onChange={(e) => setDiscountOnly(e.target.checked)}
                      />
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimal hotel bintang berapa?
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            minStarRating === star
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          onClick={() => setMinStarRating(minStarRating === star ? null : star)}
                        >
                          {star} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skor Ulasan Minimum
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={minReviewScore || 0}
                        onChange={(e) => setMinReviewScore(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium bg-cyan-100 text-cyan-800 py-1 px-3 rounded-full min-w-[60px] text-center">
                        {minReviewScore || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
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

export default FilterHotel;