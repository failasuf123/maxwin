import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "API key is missing. Please check your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite-preview-02-05",
});

const generationConfig = {
  temperature: 1.05,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,

  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate Travel Plan for Location: Bandung, for 3 Days for Couple with a Cheap budget. Give me a Hotels options list with HotelName, Hotel address, Price (estimation price in indonesian rupiah with integer data type), hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing  (estimation price in indonesian rupiah in integer data type), Rating, Time travel each of the location (with "start time - end time" format) for 3 days with each day plan with best time to visit in JSON format, make sure that all string atribut value in Indonesian language format.\n\n*   **hotelOptions:**\n    *   `hotelName` (string, nama hotel)\n    *   `hotelAddress` (string, alamat hotel)\n    *   `price` (integer, perkiraan harga per malam dalam Rupiah)\n    *   `hotelImageUrl` (string, URL gambar hotel)\n    *   `geoCoordinates` (string, koordinat geografis dalam format "latitude,longitude")\n    *   `rating` (float, rating hotel)\n    *   `description` (string, deskripsi hotel dalam Bahasa Indonesia)\n\n*   **itinerary:**\n    *   `day1`, `day2`, `day3` (objek, rencana perjalanan untuk setiap hari)\n        *   `theme` (string, tema hari, contoh: "Wisata Alam")\n        *   `plan` (array objek, daftar tempat yang dikunjungi)\n            *   `placeName` (string, nama tempat)\n            *   `placeDetails` (string, detail tempat dalam Bahasa Indonesia)\n            *   `placeImageUrl` (string, URL gambar tempat)\n            *   `geoCoordinates` (string, koordinat geografis dalam format "latitude,longitude")\n            *   `ticketPricing` (integer, perkiraan harga tiket masuk dalam Rupiah, 0 jika gratis)\n            *   `rating` (float, rating tempat)\n            *   `timeTravel` (string, waktu kunjungan dalam format "HH:MM - HH:MM")',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "hotelOptions": [\n    {\n      "hotelName": "RedDoorz near Trans Studio Bandung",\n      "hotelAddress": "Jl. Jend. Gatot Subroto No.283, Cibangkong, Kec. Batununggal, Kota Bandung, Jawa Barat 40273",\n      "price": 150000,\n      "hotelImageUrl": "https://ik.imagekit.io/tvlk/hotel/aio/default/5040197.jpg?tr=w-300,h-300,q-50",\n      "geoCoordinates": "-6.9261,107.6434",\n      "rating": 3.8,\n      "description": "Hotel budget yang terletak dekat dengan Trans Studio Bandung, menawarkan kamar yang nyaman dengan harga terjangkau."\n    },\n    {\n      "hotelName": "GH Universal Hotel Bandung",\n      "hotelAddress": "Jl. Setiabudi No.376, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40154",\n      "price": 250000,\n      "hotelImageUrl": "https://cf.bstatic.com/xdata/images/hotel/square600/40295073.jpg?k=df0f3c09a5937f83914a7264747275773d6140b26628e71c4d3757f7e01b8013&o=&s=1",\n      "geoCoordinates": "-6.8798,107.5832",\n      "rating": 4.0,\n      "description": "Hotel yang menawarkan kamar modern dengan kolam renang dan restoran. Terletak di kawasan Setiabudi yang strategis."\n    },\n    {\n      "hotelName": "OYO 1010 Dago\'s Hill",\n      "hotelAddress": "Jl. Ir. H. Djuanda No.362, Dago, Coblong, Kota Bandung, Jawa Barat 40135",\n      "price": 180000,\n      "hotelImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-s/15/81/09/e5/oyo-1010-dago-s-hill.jpg?w=1200&h=-1&s=1",\n      "geoCoordinates": "-6.8895,107.6132",\n      "rating": 3.5,\n      "description": "Hotel budget di kawasan Dago, dekat dengan berbagai tempat wisata dan kuliner."\n    }\n  ],\n  "itinerary": {\n    "day1": {\n      "theme": "Mengunjungi Keindahan Alam Bandung",\n      "plan": [\n        {\n          "placeName": "Kawah Putih",\n          "placeDetails": "Kawah Putih adalah danau kawah vulkanik dengan air berwarna putih kehijauan yang memukau. Nikmati pemandangan yang indah dan udara yang sejuk.",\n          "placeImageUrl": "https://www.nativeindonesia.com/wp-content/uploads/2019/12/Kawah-Putih-Bandung-1.jpg",\n          "geoCoordinates": "-7.1932,107.3043",\n          "ticketPricing": 30000,\n          "rating": 4.5,\n          "timeTravel": "08:00 - 12:00"\n        },\n        {\n          "placeName": "Situ Patenggang",\n          "placeDetails": "Danau yang indah dengan suasana yang tenang dan dikelilingi oleh perkebunan teh. Anda dapat menyewa perahu untuk berkeliling danau.",\n          "placeImageUrl": "https://www.jejakpiknik.com/wp-content/uploads/2018/08/situ-patenggang-bandung.jpg",\n          "geoCoordinates": "-7.1725,107.3176",\n          "ticketPricing": 25000,\n          "rating": 4.2,\n          "timeTravel": "13:00 - 16:00"\n        }\n      ]\n    },\n    "day2": {\n      "theme": "Petualangan Kota & Belanja",\n      "plan": [\n        {\n          "placeName": "Trans Studio Bandung",\n          "placeDetails": "Taman hiburan dalam ruangan dengan berbagai wahana dan atraksi seru untuk semua usia. Cocok untuk pasangan yang suka tantangan dan kesenangan.",\n          "placeImageUrl": "https://lh3.googleusercontent.com/proxy/Vd662n8xH8L-r7YV_X1zX9n_6074b76TjL088h0HnU_Qy8K2t6G5L-7lH5jL20zQhR-x_310c8T1bI2WpL737x2-o8mN_5H-b16j26d7h-3_x9jQ=w1200-h630-p-k-no-nu",\n          "geoCoordinates": "-6.9265,107.6403",\n          "ticketPricing": 280000,\n          "rating": 4.0,\n          "timeTravel": "09:00 - 17:00"\n        },\n         {\n          "placeName": "Jalan Cibaduyut",\n          "placeDetails": "Pusatnya sepatu dan produk kulit lainnya dengan harga yang terjangkau. Cocok untuk berburu oleh-oleh.",\n          "placeImageUrl": "https://www.bandungtour.com/wp-content/uploads/2015/03/cibaduyut.jpg",\n          "geoCoordinates": "-6.9419,107.5986",\n          "ticketPricing": 0,\n          "rating": 3.8,\n          "timeTravel": "17:30 - 20:00"\n        }\n      ]\n    },\n    "day3": {\n      "theme": "Kuliner & Wisata Sejarah",\n      "plan": [\n        {\n          "placeName": "Gedung Sate",\n          "placeDetails": "Bangunan bersejarah ikonik Bandung dengan arsitektur yang unik. Anda dapat berfoto dan menikmati keindahan gedung.",\n          "placeImageUrl": "https://awsimages.detik.net.id/community/media/visual/2023/08/10/gedung-sate-bandung_169.jpeg?w=1200",\n          "geoCoordinates": "-6.9013,107.6191",\n          "ticketPricing": 0,\n          "rating": 4.3,\n          "timeTravel": "08:00 - 09:30"\n        },\n        {\n          "placeName": "Braga Street",\n          "placeDetails": "Jalan bersejarah dengan bangunan-bangunan kuno yang indah. Nikmati suasana kota tua sambil berjalan-jalan.",\n          "placeImageUrl": "https://www.bandungtour.com/wp-content/uploads/2019/10/braga-bandung.jpg",\n          "geoCoordinates": "-6.9165,107.6072",\n          "ticketPricing": 0,\n          "rating": 4.1,\n          "timeTravel": "09:30 - 11:00"\n        },\n        {\n           "placeName": "Rumah Makan Nasi Bancakan",\n           "placeDetails": "Restoran yang menyajikan makanan khas Sunda dengan konsep prasmanan. Cocok untuk mencoba berbagai hidangan lezat.",\n           "placeImageUrl": "https://arsitagx-master.s3.ap-southeast-1.amazonaws.com/img_medium/3963/4471/31875/photo-exterior-rumah-makan-nasi-bancakan.jpeg",\n           "geoCoordinates": "-6.9174, 107.6106",\n           "ticketPricing": 50000,\n           "rating": 4.4,\n           "timeTravel": "11:30 - 13:00"\n         },\n        {\n          "placeName": "Paris Van Java (PVJ)",\n          "placeDetails": "Pusat perbelanjaan modern dengan berbagai toko dan restoran. Cocok untuk bersantai dan berbelanja oleh-oleh terakhir.",\n          "placeImageUrl": "https://www.bandungtour.com/wp-content/uploads/2015/05/paris-van-java.jpg",\n          "geoCoordinates": "-6.8964,107.6008",\n          "ticketPricing": 0,\n          "rating": 4.2,\n          "timeTravel": "13:30 - 17:00"\n        }\n      ]\n    }\n  }\n}\n```',
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `Buatkan JSON terstruktur yang mendeskripsikan kota Purwokerto, Indonesia dengan informasi sebagai berikut:
    
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
    `,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `**Refining the JSON Structure**
    
    I'm currently focused on defining the initial JSON structure for Purwokerto. I've broken down the request into its core components and I'm prioritizing the required fields: \`deskripsi\`, \`tags\`, and \`akses\`. I'm starting to consider how each field will be populated with accurate and comprehensive information, while still adhering to a clean, well-organized format.
    
    
    **Defining Additional Activities**
    
    I've moved on to fleshing out the 'aktivitas' field. I'm focusing on crafting a variety of activities that highlight Purwokerto's offerings. Activities are based on the core information I've compiled so far. I'm also ensuring each activity adheres to appropriate sub-field guidelines like type, and sub-activities.
    
    
    **Crafting the Description**
    
    I've refined the description of Purwokerto significantly. I've focused on capturing its essence, highlighting its status as a student city and the vibrant Banyumasan culture. My current iteration balances these aspects with its natural beauty and culinary offerings. I'm aiming for concise yet informative language that resonates with potential visitors. I'm also ensuring the description captures both the cultural and natural charms of this location.
    
    
    **Expanding the Activity Detail**
    
    I'm now focusing on the activities section. My research has led me to identify popular places and attractions that I am going to convert into activities. I'm prioritizing accuracy and relevance. I'm also ensuring the sub-fields of each activity are correctly assigned, for example type and sub-activities. This is a crucial step towards creating a comprehensive and compelling JSON.
    
    
    **Developing Key Activity Descriptions**
    
    I'm now focusing on crafting compelling descriptions for each activity within the 'aktivitas' field. I'm prioritizing clarity and accuracy, ensuring the descriptions are concise yet informative. I'm paying attention to the specific offerings of each location. I'm also ensuring the sub-fields of each activity are correctly assigned, for example the icon and description are well-defined.
    
    
    **Expanding Information and Activities**
    
    I'm now integrating information from the most recent updates on popular activities. The draft description has been further refined to include key aspects of the area, like the presence of Universitas Jenderal Soedirman. I'm focusing on incorporating the most accurate sub-fields such as the 'icon' for each activity for a balanced and comprehensive description. The focus is to produce a valid, concise, and useful JSON to serve as a resource.
    
    
    **Structuring the Activities**
    
    I've successfully incorporated the structured activities into the main JSON body. Key information for each attraction, including its name, description, and accessibility, is accurately mapped. I am reviewing the structure to ensure seamless integration and adherence to the guidelines, particularly the sub-fields of each activity. I've ensured that the icons are meaningful and applicable.
    
    
    **Developing Activity Details**
    
    I'm now focusing on filling out the \`aktivitas\` section, including the names, descriptions, and accessible location details. I've ensured a good variety of activities are represented and each adheres to the requirements. I'm also reviewing the icons, ensuring they align perfectly with each location's essence.
    
    
    **Developing Accessible Location Details**
    
    I'm currently focused on providing more information for accessibility. For each activity, I'm working on accurately documenting the accessibility of each location. I'm focusing on providing clear details. I'm also ensuring the language is appropriate and clear.
    
    
    `,
        },
        {
          text: `\`\`\`json
    {
      "deskripsi": "Purwokerto, ibu kota Kabupaten Banyumas, Jawa Tengah, adalah kota yang nyaman dengan udara sejuk di kaki Gunung Slamet. Dikenal sebagai kota pelajar berkat Universitas Jenderal Soedirman dan pusat budaya Banyumasan yang kental, Purwokerto menawarkan perpaduan pesona alam seperti kawasan wisata Baturraden dan kuliner khas seperti mendoan yang lezat. Suasana yang ramah, biaya hidup relatif terjangkau, dan keramahan penduduknya menjadikannya destinasi menarik untuk berlibur, belajar, maupun menikmati ketenangan.",
      "tags": [
        "Kota Pelajar",
        "Budaya Banyumasan",
        "Wisata Alam Sejuk",
        "Kuliner Khas",
        "Kaki Gunung Slamet"
      ],
      "akses": {
        "stasiun": "Stasiun Purwokerto",
        "terminal_bus": "Terminal Bus Bulupitu",
        "bandara":"",
        "pelabuhan":"".
      },
      "aktivitas": [
        {
          "nama": "Kawasan Wisata Baturraden",
          "deskripsi": "Kompleks wisata alam di lereng Gunung Slamet, menawarkan udara sejuk, pemandian air panas, taman, air terjun seperti Curug Telu, dan berbagai wahana rekreasi keluarga.",
          "akses_lokasi": "Sekitar 30-45 menit dari Stasiun Purwokerto atau Terminal Bulupitu menggunakan angkutan umum (mikrolet jurusan Baturraden), taksi, atau ojek online.",
          "icon": "landscape"
        },
        {
          "nama": "Alun-alun Purwokerto",
          "deskripsi": "Pusat kota yang ramai, tempat berkumpul warga, menikmati jajanan kaki lima, dan bersantai. Terdapat Pendopo Si Panji dan Masjid Agung Baitussalam.",
          "akses_lokasi": "Mudah dijangkau dari Stasiun Purwokerto (sekitar 10 menit) atau Terminal Bulupitu dengan angkutan kota atau ojek online.",
          "icon": "city"
        },
        {
          "nama": "Curug Cipendok",
          "deskripsi": "Air terjun alami dengan ketinggian sekitar 92 meter, dikelilingi hutan pinus yang asri dan suasana tenang, cocok untuk pencinta alam.",
          "akses_lokasi": "Sekitar 45-60 menit dari pusat kota Purwokerto menggunakan kendaraan pribadi atau ojek, melewati jalan pedesaan menuju Desa Karangtengah, Cilongok.",
          "icon": "water"
        },
        {
          "nama": "Museum Bank Rakyat Indonesia (BRI)",
          "deskripsi": "Museum yang menampilkan sejarah panjang Bank Rakyat Indonesia yang didirikan pertama kali di Purwokerto oleh Raden Bei Aria Wirjaatmadja.",
          "akses_lokasi": "Terletak di pusat kota, dekat Alun-alun. Sekitar 10 menit dari Stasiun Purwokerto, mudah dijangkau dengan angkutan umum atau berjalan kaki dari Alun-alun.",
          "icon": "museum"
        },
        {
          "nama": "Taman Andhang Pangrenan",
          "deskripsi": "Ruang terbuka hijau publik yang luas, dilengkapi fasilitas bermain anak, jogging track, dan area bersantai. Sering digunakan untuk berbagai acara komunitas.",
          "akses_lokasi": "Sekitar 15-20 menit dari Stasiun Purwokerto atau Terminal Bulupitu menggunakan angkutan umum atau ojek online, terletak di Jalan Gerilya.",
          "icon": "park"
        },
        {
          "nama": "Bukit Tranggulasih",
          "deskripsi": "Menawarkan pemandangan kota Purwokerto dari ketinggian dan panorama Gunung Slamet. Populer untuk menikmati matahari terbit atau terbenam, serta berkemah.",
          "akses_lokasi": "Terletak di Desa Windujaya, Kedungbanteng. Sekitar 30-40 menit dari pusat kota dengan kendaraan pribadi atau ojek, medan jalan menanjak.",
          "icon": "mountain"
        }
      ]
    }
    \`\`\``,
        },
      ],
    },
  ],
});
