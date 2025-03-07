// app/lib/getHomepageHotels.ts
import hotelData from "@/public/data_hotel_homepage.json";
import convertToHttps from "./convertToHttps";

// Definisikan tipe data untuk setiap hotel
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

// Konversi data menjadi array dengan tipe yang benar
// const data: Hotel[] = hotelData as Hotel[];

const data: Hotel[] = (hotelData as Hotel[]).map((hotel) => ({
  ...hotel,
  photo1: convertToHttps(hotel.photo1 || ""),
  photo2: convertToHttps(hotel.photo2 || ""),
  photo3: convertToHttps(hotel.photo3 || ""),
  photo4: convertToHttps(hotel.photo4 || ""),
  photo5: convertToHttps(hotel.photo5 || ""),
}));

export async function getRandomHomepageHotels(count: number = 4): Promise<Hotel[]> {
  if (data.length === 0) return [];
  
  const selectedHotels: Hotel[] = [];
  const usedHotelIds = new Set<number>();

  while (selectedHotels.length < count) {
    const randomIndex = Math.floor(Math.random() * data.length);
    const hotel = data[randomIndex];

    if (!usedHotelIds.has(hotel.hotel_id)) {
      selectedHotels.push(hotel);
      usedHotelIds.add(hotel.hotel_id);
    }
  }

  return selectedHotels;
}
