
const cityPlaceholder:string[] = [
    "Nusa Penida, Bali",
    "Jakarta",
    "Batu, Malang",
    "Jogjakarta",
    "Denpasar, Bali",
    "Purwokerto",
    "Bandung",
    "Dieng, Wonosobo",
    "Semarang",
    "Lombok"
  ]

// const AI_PROMPT="Generate Travel Plan for Location: {location}, for {totaldays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Rating, Time travel each of the location for {totaldays2} days with each day plan with best time to visit in JSON format."
const AI_PROMPT="Generate Travel Plan for Location: {location}, for {totaldays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price (estimation price in indonesian rupiah with integer data type), hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing  (estimation price in indonesian rupiah in integer data type), Rating, Time travel each of the location (with \"start time - end time\" format) for {totaldays2} days with each day plan with best time to visit in JSON format, make sure that all string atribut value in Indonesian language format.\n\n*   **hotelOptions:**\n    *   `hotelName` (string, nama hotel)\n    *   `hotelAddress` (string, alamat hotel)\n    *   `price` (integer, perkiraan harga per malam dalam Rupiah)\n    *   `hotelImageUrl` (string, URL gambar hotel)\n    *   `geoCoordinates` (string, koordinat geografis dalam format \"latitude,longitude\")\n    *   `rating` (float, rating hotel)\n    *   `description` (string, deskripsi hotel dalam Bahasa Indonesia)\n\n*   **itinerary:**\n    *   `day1`, `day2`, `day3` (objek, rencana perjalanan untuk setiap hari)\n        *   `theme` (string, tema hari, contoh: \"Wisata Alam\")\n        *   `plan` (array objek, daftar tempat yang dikunjungi)\n            *   `placeName` (string, nama tempat)\n            *   `placeDetails` (string, detail tempat dalam Bahasa Indonesia)\n            *   `placeImageUrl` (string, URL gambar tempat)\n            *   `geoCoordinates` (string, koordinat geografis dalam format \"latitude,longitude\")\n            *   `ticketPricing` (integer, perkiraan harga tiket masuk dalam Rupiah, 0 jika gratis)\n            *   `rating` (float, rating tempat)\n            *   `timeTravel` (string, waktu kunjungan dalam format \"HH:MM - HH:MM\")"

export {cityPlaceholder, AI_PROMPT}
