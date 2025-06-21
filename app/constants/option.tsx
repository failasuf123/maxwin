const cityPlaceholder: string[] = [
  "Nusa Penida, Bali",
  "Jakarta",
  "Batu, Malang",
  "Jogjakarta",
  "Denpasar, Bali",
  "Purwokerto",
  "Bandung",
  "Dieng, Wonosobo",
  "Semarang",
  "Lombok",
];

// const AI_PROMPT="Generate Travel Plan for Location: {location}, for {totaldays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Rating, Time travel each of the location for {totaldays2} days with each day plan with best time to visit in JSON format."
const AI_PROMPT =
  'Generate Travel Plan for Location: {location}, for {totaldays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price (estimation price in indonesian rupiah with integer data type), hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing  (estimation price in indonesian rupiah in integer data type), Rating, Time travel each of the location (with "start time - end time" format) for {totaldays2} days with each day plan with best time to visit in JSON format, make sure that all string atribut value in Indonesian language format.\n\n*   **hotelOptions:**\n    *   `hotelName` (string, nama hotel)\n    *   `hotelAddress` (string, alamat hotel)\n    *   `price` (integer, perkiraan harga per malam dalam Rupiah)\n    *   `hotelImageUrl` (string, URL gambar hotel)\n    *   `geoCoordinates` (string, koordinat geografis dalam format "latitude,longitude")\n    *   `rating` (float, rating hotel)\n    *   `description` (string, deskripsi hotel dalam Bahasa Indonesia)\n\n*   **itinerary:**\n    *   `day1`, `day2`, `day3` (objek, rencana perjalanan untuk setiap hari)\n        *   `theme` (string, tema hari, contoh: "Wisata Alam")\n        *   `plan` (array objek, daftar tempat yang dikunjungi)\n            *   `placeName` (string, nama tempat)\n            *   `placeDetails` (string, detail tempat dalam Bahasa Indonesia)\n            *   `placeImageUrl` (string, URL gambar tempat)\n            *   `geoCoordinates` (string, koordinat geografis dalam format "latitude,longitude")\n            *   `ticketPricing` (integer, perkiraan harga tiket masuk dalam Rupiah, 0 jika gratis)\n            *   `rating` (float, rating tempat)\n            *   `timeTravel` (string, waktu kunjungan dalam format "HH:MM - HH:MM")';

const AI_PROMPT_CITY = `Buatkan JSON terstruktur yang mendeskripsikan kota {city}, Indonesia dengan informasi sebagai berikut:
1. \`deskripsi\`: Penjelasan singkat tentang kota tersebut, termasuk suasana, budaya, dan daya tarik utamanya. Buat dalam 60–90 kata.
2. \`tags\`: Array yang berisi tag-tag yang menggambarkan kota tersebut. Tag ini terdiri dari 2 sampai 3 kata, berjumlah 4–5 tag (contoh: "kota sejuk", "budaya lokal", "wisata alam").
3. \`akses\`: Mendefinisikan akses transportasi yang dimiliki kota tersebut. Gunakan kategori berikut: ["terminal_bus", "bandara", "stasiun", "pelabuhan"]. Jika kota tidak memiliki salah satu dari akses tersebut, cukup isi value menjadi "" (string kosong) atribut tersebut.
4. \`aktivitas\`: Array berisi 5–6 objek kegiatan wisata populer atau tempat menarik di kota tersebut. Setiap objek harus memiliki:
   - \`nama\`: Nama tempat atau aktivitas
   - \`deskripsi\`: Penjelasan singkat tentang tempat atau aktivitas tersebut
   - \`akses_lokasi\`: Cara menuju tempat tersebut dari stasiun atau terminal terdekat
   - \`icon\`: Pilih satu dari daftar berikut yang paling sesuai: ["mountain", "landscape", "water", "city", "museum", "park", "terrain"]. Misalnya, air terjun cocok dengan "water", museum cocok dengan "museum".
Format hasil akhir harus berupa **JSON valid**, bahasa menggunakan Indonesia dan mengikuti struktur di bawah ini:

\`\`\`json
{
  "deskripsi": "...",
  "tags": ["...", "..."],
  "akses": {
    "stasiun": "...",
    "terminal_bus": "...",
    "bandara":"...",
    "pelabuhan":"..."
  },
  "aktivitas": [
    {
      "nama": "...",
      "deskripsi": "...",
      "akses_lokasi": "...",
      "icon": "..."
    }
  ]
}
`;

const AI_PROMPT_ACTIVITY = `Buatkan daftar berisi 25 hingga 40 entri yang terdiri dari aktivitas atau tempat wisata di kota {city}. Prioritaskan **tempat wisata** dibandingkan aktivitas. Jika tidak dapat memenuhi kuota minimal 25 entri dari dalam kota, tambahkan dari kota-kota tetangga terdekat yang masih berada dalam wilayah atau sekitar Kota , misalkan untuk kota Purwokerto (contoh: Banyumas, Baturraden, Purbalingga dsb). Ingat dalam konteks ini yang dicari adalah kota {city} bukan kota Purwokerto. Kota Purwokerto hanyalah contoh untuk memudahkan pemahaman anda terkait konteks dan output

Setiap entri harus ditampilkan dalam format JSON dengan struktur berikut:

{
  "nama": string,                     // Nama aktivitas atau tempat wisata
  "deskripsi": string,               // Deskripsi singkat tentang tempat atau aktivitas
  "akses_lokasi": string,            // Cara akses dari Stasiun, Terminal, atau pusat kota (contoh: "30 menit dari Stasiun Purwokerto naik angkot jalur 3, 45 menit dari pusat kota")
  "icon": string,                    // Pilih satu dari: ["mountain", "landscape", "water", "city", "museum", "park", "terrain"]
  "estimated_cost": integer,         // Estimasi total biaya (dalam Rupiah, integer saja) untuk menikmati aktivitas (termasuk tiket, makan, belanja, transportasi lokal)
  "keterangan": string               // Informasi tambahan jika ada (misalnya waktu buka, apakah cocok untuk keluarga, tips, dll)
}

Ketentuan tambahan:
- Semua teks **harus dalam bahasa Indonesia yang natural dan mudah dipahami**.
- Data yang diberikan **harus realistis** berdasarkan kondisi umum dan informasi publik yang tersedia.
- Hindari pengulangan aktivitas yang serupa.
- Untuk **aktivitas**, prioritaskan yang bersifat umum dan bisa dinikmati oleh wisatawan (bukan aktivitas harian warga lokal).
- Jangan menampilkan data yang kosong/null untuk properti apa pun.

Output langsung dalam bentuk **array JSON**, tanpa penjelasan atau tambahan teks lain di luar itu.
`
export { cityPlaceholder, AI_PROMPT, AI_PROMPT_CITY, AI_PROMPT_ACTIVITY };
