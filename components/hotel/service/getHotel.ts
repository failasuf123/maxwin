import hotelData from "@/public/data_hotel.json";
import convertToHttps from "./convertToHttps";

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  city: string;
  state: string;
  country: string;
  star_rating: number;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  photo4?: string | null;
  photo5?: string | null;
  url: string;
  rating_average: number;
  overview: string;
  accommodation_type: string;
  addressline1: string;
}

// const data: Hotel[] = hotelData as Hotel[];

const data: Hotel[] = (hotelData as Hotel[]).map((hotel) => ({
  ...hotel,
  photo1: convertToHttps(hotel.photo1 || ""),
  photo2: convertToHttps(hotel.photo2 || ""),
  photo3: convertToHttps(hotel.photo3 || ""),
  photo4: convertToHttps(hotel.photo4 || ""),
  photo5: convertToHttps(hotel.photo5 || ""),
}));

const statesList = [
  "D.I. Yogyakarta", "Bali", "East Java", "DKI Jakarta", "Banten",
  "West Java", "Central Java", "East Kalimantan", "BALI", "Yogyakarta", "Jakarta"
];

// Fungsi untuk mengambil data secara acak
export async function getRandomHotels(
  count: number = 15,
  type: string // Tambahkan parameter type
): Promise<Hotel[]> {
  let stateHotels = data.filter((h) => statesList.includes(h.state));
  let otherHotels = data.filter((h) => !statesList.includes(h.state));

  // Filter berdasarkan accommodation_type jika type bukan "All Type"
  if (type !== "All Type") {
    stateHotels = stateHotels.filter((hotel) => hotel.accommodation_type === type);
    otherHotels = otherHotels.filter((hotel) => hotel.accommodation_type === type);
  }

  let selectedHotels: Hotel[] = [];
  let usedHotelIds = new Set<number>(); // Simpan ID hotel yang sudah dipilih

  for (let i = 0; i < count; i++) {
    if (i < 14 && stateHotels.length > 0) {
      let randomIndex;
      let hotel;
      do {
        randomIndex = Math.floor(Math.random() * stateHotels.length);
        hotel = stateHotels[randomIndex];
      } while (usedHotelIds.has(hotel.hotel_id));

      selectedHotels.push(hotel);
      usedHotelIds.add(hotel.hotel_id);
      stateHotels.splice(randomIndex, 1);
    } else if (otherHotels.length > 0) {
      let randomIndex;
      let hotel;
      do {
        randomIndex = Math.floor(Math.random() * otherHotels.length);
        hotel = otherHotels[randomIndex];
      } while (usedHotelIds.has(hotel.hotel_id));

      selectedHotels.push(hotel);
      usedHotelIds.add(hotel.hotel_id);
      otherHotels.splice(randomIndex, 1);
    }
  }

  return selectedHotels;
}

export async function getFilteredHotels(
  filters: { city: string; state: string; type: string },
  page: number,
  perPage: number = 15
): Promise<Hotel[]> {
  let filteredData = data;

  // Filter berdasarkan city dan state
  if (filters.city !== "Indonesia" || filters.state !== "Indonesia") {
    filteredData = filteredData.filter((hotel) => {
      const cityMatch = filters.city === "Indonesia" || hotel.city === filters.city;
      const stateMatch = filters.state === "Indonesia" || hotel.state === filters.state;
      return cityMatch && stateMatch;
    });
  }

  // Filter berdasarkan accommodation_type
  if (filters.type !== "All Type") {
    filteredData = filteredData.filter((hotel) => hotel.accommodation_type === filters.type);
  }

  // Jika city/state adalah "Indonesia", ambil data secara acak dengan filter type
  if (filters.city === "Indonesia" && filters.state === "Indonesia") {
    return getRandomHotels(perPage, filters.type); // Terapkan filter type
  }

  // Paginasi
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return filteredData.slice(startIndex, endIndex);
}
