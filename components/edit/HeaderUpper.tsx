"use client";
import React, { useState } from "react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { FaPen } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { FaMagic } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Todo,
  getTodoStyling,
  categories,
} from "@/components/create/utils/utility";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/edit/DatePicker";
import { eachDayOfInterval, format } from "date-fns";



interface Data {
  title: string;
  imageUrlCover: string;
  username: string;
  city: string[];
  description: string;
  dateStart: string;
  dateEnd: string;
  totalDays: number;
  category: string;
  publicState: boolean;
  publishState: boolean;
  totalPrice: number;
}

function HeaderUpper({
  data,
  onUpdate,
}: {
  data: Data;
  onUpdate: (
    title: string,
    city: string[],
    description: string,
    category: string,
    dateStart: string,
    dateEnd: string,
    imageUrlCover: string,
    publicState: boolean,
    publishState: boolean
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState<string[]>([]);
  const [lat, setLat] = useState<number | null>(null); // State untuk lat
  const [lng, setLng] = useState<number | null>(null); // State untuk lng
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [imageUrlCover, setImageUrlCover] = useState("");
  const [imageKeyCover, setImageKeyCover] = useState("");
  const [username, setUsername] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [category, setCategory] = useState("");
  const [publicState, setPublicState] = useState(false);
  const [publishState, setPublishState] = useState(false);
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { toast } = useToast();

  React.useEffect(() => {
    setTitle(data.title);
    setImageUrlCover(data.imageUrlCover);
    setUsername(data.username);
    setCity(data.city);
    setDescription(data.description);
    setDateStart(data.dateStart);
    setDateEnd(data.dateEnd);
    setTotalDays(data.totalDays);
    setCategory(data.category);
    setPublicState(data.publicState);
    setPublishState(data.publishState);
    setTotalPrice(data.totalPrice);
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(
      newTitle,
      city,
      description,
      category,
      dateStart,
      dateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };

  const handleCityChange = (value: any) => {
    const newCity = value?.label ? [value.label] : []; // Simpan dalam array
    setCity(newCity); // Tanpa array tambahan
    setLat(value?.data?.geometry?.location?.lat() || null);
    setLng(value?.data?.geometry?.location?.lng() || null);
    onUpdate(
      title,
      newCity, // Kirim dalam bentuk array
      description,
      category,
      dateStart,
      dateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };
  
  

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onUpdate(
      title,
      city,
      newDescription,
      category,
      dateStart,
      dateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };

  const handleDateChange = (data: {
    startDate: Date | null;
    endDate: Date | null;
    totalDays: number;
  }) => {
    const formattedStartDate = data.startDate
      ? format(data.startDate, "yyyy-MM-dd")
      : "";
    const formattedEndDate = data.endDate
      ? format(data.endDate, "yyyy-MM-dd")
      : "";
      
    setTotalDays(data.totalDays);
    setDateStart(formattedStartDate ?? "");
    setDateEnd(formattedEndDate ?? "");

    onUpdate(
      title,
      city,
      description,
      category,
      formattedStartDate,
      formattedEndDate,
      imageUrlCover,
      publicState,
      publishState
    );
  };


  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStart = e.target.value;
    setDateStart(newDateStart);
    onUpdate(
      title,
      city,
      description,
      category,
      newDateStart,
      dateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateEnd = e.target.value;
    setDateEnd(newDateEnd);
    onUpdate(
      title,
      city,
      description,
      category,
      dateStart,
      newDateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };

  const handleCategoryChange = (value: any) => {
    const newCategory = value?.label || "";
    setCategory(newCategory);
    onUpdate(
      title,
      city,
      description,
      newCategory,
      dateStart,
      dateEnd,
      imageUrlCover,
      publicState,
      publishState
    );
  };

  const handleImageChange = (value: { url: string; key: string }) => {
    if (!value?.url) return;
    const newImageUrlCover = value.url;
    onUpdate(
      title,
      city,
      description,
      category,
      dateStart,
      dateEnd,
      newImageUrlCover,
      publicState,
      publishState
    );
  };

  const handlePrivateStateChange = () => {
    setPublicState(false);
    setPublishState(false);
    const newPublicState = false;
    const newPublishState = false;
    onUpdate(
      title,
      city,
      description,
      category,
      dateStart,
      dateEnd,
      imageUrlCover,
      newPublicState,
      newPublishState
    );
  };

  const handlePublishStateChange = () => {
    setPublicState(true);
    setPublishState(true);
    const newPublicState = true;
    const newPublishState = true;
    onUpdate(
      title,
      city,
      description,
      category,
      dateStart,
      dateEnd,
      imageUrlCover,
      newPublicState,
      newPublishState
    );
  };

  return (
    <div>
      {/* Header Upper */}
      <div className="w-full">
        <div>
          {data.imageUrlCover ? (
            <img
              src={data.imageUrlCover}
              alt="Trip Image"
              className="h-[340px] w-full object-cover rounded"
            />
          ) : (
            <UploadDropzone
              className="border-4 border-dashed border-blue-400 h-[340px] w-full"
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                setImageUrlCover(res[0].url);
                setImageKeyCover(res[0].key);
                if (res && res.length > 0) {
                  handleImageChange({ url: res[0].url, key: res[0].key });
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error.message);
              }}
            />
          )}

          <div>
            <p className="text-base  text-gray-400 mt-3">Judul:</p>
          </div>
          <div className="flex flex-row items-center gap-5">
            <input
              type="text"
              placeholder="Masukan Judul.."
              value={title}
              onChange={handleTitleChange}
              required
              className="w-full font-bold text-lg md:text-2xl outline-none bg-gray-100 focus:outline-none border-b-2 px-2 py-2 border-dashed border-gray-700 hover:bg-gray-200 rounded"
            />
            <div className="flex justify-center items-center text-center text-gray-400 text-xl">
              <FaPen className="text-xl text-center " />
            </div>
          </div>

          <p className="text-base text-gray-400 mt-2 ">
            - dibuat oleh: {username} -
          </p>

          <div className="flex flex-row flex-wrap gap-2 mt-3">

            {/* Total Days Input */}
            <Popover>
              <PopoverTrigger asChild>
                <h2 className="bg-gray-200 hover:bg-gray-300 cursor-pointer items-center text-center  text-sm md:text-base px-3 py-2 border rounded-full border-dashed border-2 border-gray-500 hover:bg-gray-300 hover:border-solid">
                  {totalDays > 0 ? `🗓️ ${totalDays} Hari` : "🗓️ Pilih Tanggal"}
                </h2>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] md:w-[370px] flex flex-col items-center ">
                <div className="text-base font-semibold text-gray-700 mb-1 ">Rentang Waktu Trip</div>
                <p className="text-xs text-gray-500 mb-3 md:mb-4 text-center">Pilih rentang waktu liburan kamu <span className="text-gray-600 font-semibold">Maksimal 21 Hari</span></p>
                <DatePicker onDateChange={handleDateChange}  />

              </PopoverContent>
            </Popover>

            {/* Category Input */}
            <div className="flex items-center bg-gray-200 text-sm md:text-base  px-2 border-dashed border-2 border-gray-500 rounded-full hover:bg-gray-300 hover:border-solid group">
              🏝️
              <select
                value={category}
                onChange={(e) =>
                  handleCategoryChange({ label: e.target.value })
                }
                required
                className="w-full p-2 border rounded bg-gray-200 cursor-pointer border-none group-hover:bg-gray-300"
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Itinerary */}
            <div onClick={() => setShowStateModal(true)}>
              <h2 className="bg-cyan-500 hover:bg-gray-900 text-white flex flex-row gap-2 cursor-pointer items-center text-center text-sm md:text-base px-3 py-2 border rounded-full">
                <FaMagic />
                <div>
                  {publicState
                    ? publishState
                      ? "Publish"
                      : "Public"
                    : "Private"}
                </div>
              </h2>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="font-semibold text-lg md:text-xl mt-3 text-gray-700 flex flex-row  justify-start items-center ">
              <h2>🏙️ Kota</h2>
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  value: city.length > 0 ? { value: city[0], label: city[0] } : null,
                  onChange: handleCityChange,
                  placeholder: "Pilih kota tujuan...",
                  noOptionsMessage: () =>
                    "Ketik sesuatu untuk mencari lokasi...",
                  styles: {
                    control: (base) => ({
                      ...base,
                      width: "100%",
                      maxWidth: "400px",
                      minWidth: "300px",
                      border: "none",
                      borderBottom: "2px dashed #4B5563",
                      backgroundColor: "#F5F5F5",
                      boxShadow: "none",
                      padding: "0 0.5rem",
                      paddingBottom: 0,
                      ":hover": {
                        borderBottom: "2px dashed #4B5563",
                        backgroundColor: "#E5E7EB",
                        cursor: "text",
                      },
                      "@media (min-width: 768px)": {
                        maxWidth: "600px",
                      },
                      "@media (min-width: 1024px)": {
                        maxWidth: "700px",
                      },
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0 0.5rem",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "0.375rem", // rounded
                      overflow: "hidden",
                      backgroundColor: "#FFFFFF",
                    }),
                    option: (base, state) => ({
                      ...base,
                      cursor: "pointer", // cursor-text
                      backgroundColor: state.isFocused
                        ? "#E5E7EB" // hover:bg-gray-200
                        : "#FFFFFF", // default background
                      color: "#111827", // text-gray-900
                      padding: "0.5rem 1rem",
                      fontSize: "1rem", // Tailwind: text-sm
                      fontWeight: "500",
                      ":hover": {
                        backgroundColor: "#E5E7EB", // hover:bg-gray-200
                      },
                      ":active": {
                        backgroundColor: "#D1D5DB", // bg-gray-300
                      },
                    }),
                  },
                }}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ["ID", "SG", "MY", "TH", "VN", "PH"],
                  },
                  types: ["(cities)"],
                }}
              />

              <FaPen className="text-gray-400" />
            </div>

            <div className="bg-gray-100 hover:bg-gray-200 relative px-3 py-2 md:px-5 rounded-2xl mt-3 flex flex-col gap-3 group ">
              <BsStars className="absolute top-5 left-3 text-gray-400 group-hover:animate-pulse" />
              <textarea
                placeholder=" Deskripsikan Perjalanan Kamu..."
                value={description}
                onChange={handleDescriptionChange}
                required
                className="w-full p-2 px-3 rounded bg-gray-100 outline-none focus:outline-none group-hover:bg-gray-200"
              />
            </div>

            <div className="flex flex-row gap-2  justify-center items-center mt-7">
              <h2
                className="cursor-default items-center text-center text-sm md:text-base "
                onClick={() => {
                  toast({
                    className: cn(
                      "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                    ),
                    title: "Ups! Bukan sesuatu yang dapat di edit manual.",
                    description:
                      "Akan otomatis berubah ketika anda menambahkan atau menghapus aktivitas dengan biaya.",
                    duration: 12000,
                  });
                }}
              >
                💰 Total Pengeluaran:{" "}
                {totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Upper */}

      {/* Date Form Modal */}
      {showDateModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            <button
              onClick={() => setShowDateModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="text-sm text-gray-500 mt-1">Deskripsikan Trip</div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-col items-start gap-1">
                <div className="text-sm text-gray-500">Memulai Trip</div>
                <input
                  type="date"
                  value={dateStart}
                  onChange={handleDateStartChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="text-sm text-gray-500">Trip Berakhir</div>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={handleDateEndChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set State Form Modal */}
      {showStateModal && (
        <div className="fixed inset-0 px-5 py-5 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative bg-white p-6 rounded-md shadow-lg space-y-4 w-full max-w-md">
            {/* Tombol untuk menutup modal */}
            <button
              onClick={() => setShowStateModal(false)}
              className="absolute top-2 right-5 text-4xl text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Header Modal */}
            <h3 className="text-lg font-bold">Set State</h3>
            <div className="text-sm text-gray-500 mt-1">
              Atur status untuk trip Anda:
            </div>

            {/* Menu untuk mengganti state */}
            <div className="flex flex-row gap-1">
              {/* Tombol untuk "Private" */}
              <button
                onClick={() => {
                  handlePrivateStateChange();
                  setShowStateModal(false);
                }}
                className="w-full bg-gray-200 hover:bg-cyan-400 text-gray-800 hover:text-white py-2 px-4 rounded"
              >
                Private
              </button>

              {/* Tombol untuk "Publish" */}
              <button
                onClick={() => {
                  handlePublishStateChange();
                  setShowStateModal(false);
                }}
                className="w-full bg-gray-200 hover:bg-cyan-400 text-gray-800 hover:text-white py-2 px-4 rounded"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderUpper;
