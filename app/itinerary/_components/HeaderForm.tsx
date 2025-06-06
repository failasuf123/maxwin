// ./_components/HeaderForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Itinerary, City } from "@/app/itinerary/_utils/typings";
import { TiUpload } from "react-icons/ti";
import { LuImagePlus } from "react-icons/lu";
import LocationAutocomplete from "@/components/service/LocalAutoComplate";

const listTag = [
  "Adventure", "Backpacking", "Beach", "Budget", "City", 
  "Cultural", "Family", "Festival", "Foodie", "Historical",
  "Honeymoon", "Luxury", "Mountain", "Nature", "Relaxation",
  "Road Trip", "Solo", "Wildlife"
];

interface HeaderFormProps {
  initialData?: Partial<
    Pick<Itinerary, "title" | "description" | "imageCover" | "tag" | "Cities">
  >;
  onDataChange: (
    data: Pick<
      Itinerary,
      "title" | "description" | "imageCover" | "tag" | "Cities"
    >
  ) => void;
}

function HeaderForm({ initialData, onDataChange }: HeaderFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageCover, setImageCover] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Untuk mekanisme tag baru
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // --- Guard untuk mencegah infinite loop ---
  const isInitialMount = useRef(true);
  const isUpdatingFromInitialData = useRef(false);
  // -----------------------------------------

  useEffect(() => {
    if (initialData) {
      isUpdatingFromInitialData.current = true;
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setImageCover(initialData.imageCover || "");
      setTags(initialData.tag || []);
      setCities(initialData.Cities || []);
      queueMicrotask(() => {
        isUpdatingFromInitialData.current = false;
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isUpdatingFromInitialData.current) {
      return;
    }
    onDataChange({
      title,
      description,
      imageCover:
        imageCover === "/itinerary-bg-default.webp" && !initialData?.imageCover
          ? undefined
          : imageCover,
      tag: tags,
      Cities: cities,
    });
  }, [
    title,
    description,
    imageCover,
    tags,
    cities,
    onDataChange,
    initialData?.imageCover,
  ]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/itinerary-bg-default.webp";
  };

  // --- Logika untuk Tag Baru ---
  const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchQuery(e.target.value);
    if (!isTagDropdownOpen) {
      setIsTagDropdownOpen(true);
    }
  };

  const handleToggleTag = (tagToToggle: string) => {
    setTags((prevTags) =>
      prevTags.includes(tagToToggle)
        ? prevTags.filter((t) => t !== tagToToggle)
        : [...prevTags, tagToToggle]
    );
  };

  const filteredListTags = listTag.filter((tag) =>
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  // Menutup dropdown tag jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCity = (cityName: string, cityId?: number) => {
    if (!cityName.trim()) return;
    
    // Cek apakah kota sudah ada
    const cityExists = cities.some(
      (c) => c.cityName.toLowerCase() === cityName.trim().toLowerCase()
    );
    
    if (!cityExists) {
      const newCity: City = {
        cityId: cityId || Date.now(),
        cityName: cityName.trim(),
      };
      setCities([...cities, newCity]);
    }
  };

  const handleRemoveCity = (cityIdToRemove: number) => {
    setCities(cities.filter((city) => city.cityId !== cityIdToRemove));
  };

  const triggerImageUpload = () => {
    console.log("Tombol Upload Gambar diklik");
    alert("Fitur upload gambar belum diimplementasikan.");
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group">
        <img
          src={imageCover || "/itinerary-bg-default.webp"}
          alt="Trip Image"
          className="h-[180px] md:h-[340px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={handleImageError}
        />

        <div className="absolute bottom-0 left-0 bg-gray-400 bg-opacity-30 px-3 py-2 rounded-b-xl flex flex-col items-start w-full gap-1">
          <div className="w-full">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukan judul perjalanan.."
              className="w-full text-gray-800 text-lg md:text-4xl font-bold bg-transparent placeholder-gray-500 focus:outline-none"
              required={initialData?.title !== ""}
            />
          </div>
          <div className="w-full">
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukan Deskripsi perjalanan.."
              className="w-full text-gray-600 text-sm md:text-lg bg-transparent placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div
          onClick={triggerImageUpload}
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-50 rounded-xl px-4 py-2 hidden md:group-hover:flex cursor-pointer items-center flex-row gap-2 transition-all duration-300"
        >
          <TiUpload />
          <p>Upload Gambar</p>
        </div>

        <div
          onClick={triggerImageUpload}
          className="absolute top-3 right-3 p-2 gap-1 flex md:hidden bg-black bg-opacity-50 rounded-lg text-white cursor-pointer"
        >
          <LuImagePlus size={20} />
        </div>
      </div>

      <div className="w-full flex flex-row items-start gap-4 md:gap-5 lg:gap-7">
        {/* Input Kota dengan Autocomplete */}
        <div className="w-full gap-2 items-center flex flex-col">
          <div className="w-full flex items-center">
            <div className="relative flex-1 flex items-center bg-gray-100 text-xs md:text-base px-3 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              {/* Menggunakan LocationAutocomplete */}
              <LocationAutocomplete
                onSelect={(city, cityId) => {
                  handleAddCity(city, cityId);
                }}
                typeProps="Itinerary"
                initialCity=""
              />
            </div>
          </div>

          {/* Selected Cities */}
          <div className="flex flex-wrap gap-2 w-full">
            {cities.map((city) => (
              <span
                key={city.cityId}
                className="inline-flex items-center px-1 md:px-3 py-1 rounded-full text-[8px] md:text-xs font-medium bg-green-100 text-green-800"
              >
                {city.cityName}
                <button
                  type="button"
                  onClick={() => handleRemoveCity(city.cityId)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600 transition-colors"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    className="w-2 h-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Input Tag */}
        <div className="w-1/2 gap-2 items-center flex flex-col">
          <div className="relative w-full">
            <div className="relative flex items-center bg-gray-100 text-xs md:text-base px-3 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={tagInputRef}
                type="text"
                id="tag-filter-input"
                value={tagSearchQuery}
                onChange={handleTagSearchChange}
                onFocus={() => setIsTagDropdownOpen(true)}
                placeholder="Kategori..."
                className="w-full py-2 bg-transparent focus:outline-none placeholder-gray-500 text-gray-700"
              />
            </div>
            {isTagDropdownOpen && (
              <div
                ref={tagDropdownRef}
                className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredListTags.length > 0 ? (
                  filteredListTags.map((tagItem) => (
                    <label
                      key={tagItem}
                      htmlFor={`checkbox-${tagItem.replace(/\s+/g, "-")}`}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        tags.includes(tagItem) ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${tagItem.replace(/\s+/g, "-")}`}
                        checked={tags.includes(tagItem)}
                        onChange={() => handleToggleTag(tagItem)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {tagItem}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    Tidak ada kategori yang cocok
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 w-full">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[10px] font-medium bg-blue-100 text-blue-800 s"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 transition-colors"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    className="w-2 h-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderForm;