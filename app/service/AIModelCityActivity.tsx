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
          text: `Buatkan daftar berisi 25 hingga 40 entri yang terdiri dari aktivitas atau tempat wisata di kota Bandung. Prioritaskan **tempat wisata** dibandingkan aktivitas. Jika tidak dapat memenuhi kuota minimal 25 entri dari dalam kota, tambahkan dari kota-kota tetangga terdekat yang masih berada dalam wilayah atau sekitar Kota , misalkan untuk kota Purwokerto (contoh: Banyumas, Baturraden, Purbalingga dsb). Ingat dalam konteks ini yang dicari adalah kota Bandung bukan kota Purwokerto. Kota Purwokerto hanyalah contoh untuk memudahkan pemahaman anda terkait konteks dan output

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
`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `**Defining Bandung's Offerings**

My current task is to build a JSON array detailing tourist attractions in and around Bandung. Right now, I'm prioritizing listing attractions within the city, starting with historical sites. I aim for an array of 25 to 40 entries, ensuring a diverse range of activities. I'll make sure to include enough info for each entry to represent it properly.


**Building the JSON Structure**

I'm now focusing on the JSON structure for each attraction entry. I'm making sure to include the required keys: \`nama\`, \`deskripsi\`, \`akses_lokasi\`, \`icon\`, \`estimated_cost\`, and \`keterangan\`. I'm starting to populate the fields with data for the first few attractions in Bandung city. This is taking shape nicely and I'm confident I can reach the target number of entries.


**Planning the JSON Population**

My strategy is now focused on how to handle the \`estimated_cost\` field for each attraction. I'll need to develop a consistent method for calculating the rough total cost, encompassing entrance fees, a simple meal, a potential souvenir, and round-trip transport from key Bandung locations. I plan to use a system of categories and average costs to make this estimation process manageable and relatively accurate.


**Expanding the Data Set**

I'm now starting to expand the potential entries beyond the initial list, focusing on attractions slightly further afield. I've begun to gather information on places like Kawah Putih and Floating Market Lembang, which are in nearby areas but are still essential for a comprehensive Bandung experience. I'm prioritizing accuracy in details like travel times and associated costs.


**Prioritizing & Structuring**

I'm now focusing on curating the final list of attractions, aiming for variety and a strong representation of the Bandung experience. Then, I'll structure the JSON objects meticulously, ensuring all fields are populated accurately and comprehensively.


**Populating the Entries**

I'm now focusing on filling the JSON objects with detailed information. Currently, I'm working on the \`akses_lokasi\` and \`estimated_cost\` fields for each attraction. It's a bit time-consuming, but the more detailed I am, the more valuable the JSON will be. I'm aiming for realistic travel times and cost estimations. I'm making sure to factor in potential variations, especially in transport costs.


**Refining the List & Structure**

I've decided on the final list of attractions, aiming for a diverse representation of Bandung. The JSON structure is complete, and I'm currently focused on populating the \`deskripsi\` and \`akses_lokasi\` fields for each entry.  It's a delicate balance of informative and concise. I'm prioritizing accuracy in all the data.


**Refining the Estimated Costs**

I've revised the \`estimated_cost\` field to be more accurate and representative. I've broken down and categorized the costs. This involves estimating entrance fees, meals, potential souvenirs, and round-trip local transport. I'm focusing on providing the most realistic estimations per attraction.


**Structuring the Data**

I've completed the initial structure of the JSON array and populated the first ten attractions, focusing on key locations like Kawah Putih and Tangkuban Perahu. I'm actively working to accurately fill the \`deskripsi\`, \`akses_lokasi\`, and \`estimated_cost\` fields. I'm aiming for concise yet informative descriptions and practical transport information. The cost estimates are taking into account a general range of expenses.


**Expanding Data & Refinement**

I've completed the initial list of attractions and started refining the entries. I'm prioritizing the detailed descriptions and making sure to include practical travel information, as well as an estimated cost. I'm also now adding more entries, like Orchid Forest Cikole and Pemandian Air Panas Ciater, making the range of experiences more diverse. My goal is to strike a balance between providing helpful details and concise information.


**Completing the Array**

I've been meticulously refining the list and structure, currently focusing on the \`deskripsi\`, \`akses_lokasi\`, and \`estimated_cost\` fields. I'm adding more attractions to reach the target, including Orchid Forest Cikole and Pemandian Air Panas Ciater. Balancing helpful details with concise information remains key.


**Constructing the Data**

I've successfully filled the first 17 entries with comprehensive details, including descriptions, location access information, and cost estimates. Now, I'm working to expand the selection of attractions further, prioritizing adding more to complete the list. I'm focusing on ensuring accuracy and detail in the next set of data.


**Completing the Final Touches**

I've polished the entries with realistic access details and estimated costs. I've also integrated the remaining data, including Pemandian Air Panas Ciater and Lereng Anteng. Now, I'm verifying the data's accuracy and ensuring the array structure is finalized, ready for the export.


**Completing the JSON Array**

I've been diligently working on refining the JSON array, ensuring a balanced representation of Bandung's attractions. I've populated the necessary fields, focusing on comprehensive descriptions, accurate location details, and realistic cost estimates. I'm now fine-tuning the remaining data, including Pemandian Air Panas Ciater and Lereng Anteng.


**Refining the List**

I'm currently finalizing the JSON array, ensuring a balanced selection of attractions, and confirming that the data for each entry is comprehensive. I'm prioritizing accuracy in the location details, descriptions, and cost estimates. I'm focusing on ensuring I accurately present the essence of each destination in the descriptions, like Curug Maribaya and Lereng Anteng.


**Building the Data Structures**

I'm currently finalizing the JSON array's structure, focusing on consistent data fields for each attraction. This involves meticulous review of each entry's \`nama\`, \`deskripsi\`, \`akses_lokasi\`, \`icon\`, \`estimated_cost\`, and \`keterangan\`. I've started populating descriptions for key locations, aiming for informative, concise, and engaging content. I'm focusing on attractions, like Cihampelas Walk and Stone Garden.


**Constructing Attraction Descriptions**

I'm currently finalizing the list of attractions, ensuring a diverse range is presented. I'm focusing on crafting detailed and engaging descriptions for each entry. The goal is to provide enough information to draw the user in, while keeping the descriptions concise and informative. The data fields such as \`akses_lokasi\` are now getting more detailed.


**Building Out the Descriptions**

I'm now focusing on refining the descriptions to be both informative and engaging, while making the location access information easier to understand. Each JSON object is coming together nicely! I've been aiming for clarity in my approach to writing the descriptions. It's important to provide enough context for the user.


**Crafting the Final Dataset**

I've been meticulously refining the list and confirming that the data for each entry is comprehensive and accurately reflects Bandung's offerings. I've ensured a balanced selection of attractions, prioritizing diverse experiences, such as the unique culture found at Museum Konferensi Asia Afrika and Paskal Food Market's dining options. I'm focusing on providing realistic access details and estimated costs.


`,
        },
        {
          text: `\`\`\`json
[
  {
    "nama": "Kawah Putih Ciwidey",
    "deskripsi": "Danau kawah vulkanik dengan air berwarna putih kehijauan yang sureal, dikelilingi oleh pemandangan alam yang dramatis.",
    "akses_lokasi": "Sekitar 2-3 jam dari pusat kota Bandung via Tol Soroja. Disarankan menggunakan mobil pribadi atau sewa.",
    "icon": "water",
    "estimated_cost": 300000,
    "keterangan": "Bawa masker karena bau belerang cukup kuat. Waktu terbaik adalah pagi hari untuk cuaca cerah dan pemandangan maksimal."
  },
  {
    "nama": "Gunung Tangkuban Perahu",
    "deskripsi": "Gunung berapi aktif yang ikonik dengan kawah besarnya (Kawah Ratu) yang bisa dilihat langsung dari bibir kawah.",
    "akses_lokasi": "Sekitar 1.5-2 jam dari pusat kota Bandung ke arah Lembang. Bisa diakses dengan mobil, namun rawan macet saat liburan.",
    "icon": "mountain",
    "estimated_cost": 350000,
    "keterangan": "Udara sangat dingin, siapkan jaket tebal. Hati-hati dengan pedagang yang terkadang sedikit memaksa. Tiket masuk berbeda untuk wisatawan domestik dan mancanegara."
  },
  {
    "nama": "Jalan Braga",
    "deskripsi": "Jalan bersejarah dengan deretan bangunan arsitektur Art Deco peninggalan Belanda, kini dipenuhi kafe, galeri, dan toko-toko unik.",
    "akses_lokasi": "Sangat dekat dari Alun-alun Bandung, sekitar 5-15 menit berkendara atau bahkan bisa jalan kaki dari Stasiun Bandung.",
    "icon": "city",
    "estimated_cost": 150000,
    "keterangan": "Sangat hidup dan fotogenik pada sore hingga malam hari. Cocok untuk berjalan santai sambil menikmati suasana kota tua."
  },
  {
    "nama": "Saung Angklung Udjo",
    "deskripsi": "Pusat pertunjukan dan pelestarian seni musik angklung khas Sunda yang interaktif dan mendunia.",
    "akses_lokasi": "Sekitar 30-45 menit dari pusat kota Bandung di daerah Padasuka. Mudah dijangkau dengan taksi atau ojek online.",
    "icon": "museum",
    "estimated_cost": 200000,
    "keterangan": "Pertunjukan biasanya diadakan sore hari. Pengunjung akan diajak bermain angklung bersama. Sangat edukatif dan cocok untuk semua usia."
  },
  {
    "nama": "Trans Studio Bandung",
    "deskripsi": "Salah satu taman hiburan dalam ruangan (indoor theme park) terbesar di dunia, menawarkan puluhan wahana modern dan pertunjukan.",
    "akses_lokasi": "Berada di dalam Trans Studio Mall, Jl. Gatot Subroto. Sekitar 30 menit dari pusat kota.",
    "icon": "park",
    "estimated_cost": 500000,
    "keterangan": "Cocok untuk liburan keluarga, terutama jika cuaca di luar tidak menentu. Beli tiket secara online untuk menghindari antrean panjang."
  },
  {
    "nama": "Farmhouse Lembang",
    "deskripsi": "Tempat wisata populer bertema pedesaan Eropa, lengkap dengan bangunan unik, rumah hobbit, dan interaksi dengan hewan ternak.",
    "akses_lokasi": "Sekitar 1-1.5 jam dari pusat kota Bandung, berada di jalur utama Lembang. Sering macet saat akhir pekan.",
    "icon": "park",
    "estimated_cost": 250000,
    "keterangan": "Tiket masuk dapat ditukar dengan segelas susu murni. Sangat ramai di hari libur, disarankan datang lebih pagi."
  },
  {
    "nama": "Floating Market Lembang",
    "deskripsi": "Pasar kuliner unik yang menyajikan berbagai jajanan di atas perahu yang terapung di danau buatan.",
    "akses_lokasi": "Berlokasi di Lembang, sekitar 1-1.5 jam dari pusat kota. Dekat dengan Farmhouse dan The Great Asia Africa.",
    "icon": "water",
    "estimated_cost": 200000,
    "keterangan": "Sistem transaksi menggunakan koin khusus yang bisa dibeli di loket. Terdapat banyak wahana lain di dalam kawasan seperti Kota Mini."
  },
  {
    "nama": "The Great Asia Africa",
    "deskripsi": "Wisata edukasi budaya yang memungkinkan pengunjung melihat miniatur landmark dari berbagai negara di benua Asia dan Afrika.",
    "akses_lokasi": "Berseberangan dengan Farmhouse Lembang, sekitar 1-1.5 jam dari pusat kota. Rawan macet parah saat liburan.",
    "icon": "park",
    "estimated_cost": 300000,
    "keterangan": "Area sangat luas, siapkan stamina dan pakai sepatu yang nyaman. Tersedia penyewaan kostum tradisional dari berbagai negara."
  },
  {
    "nama": "Gedung Sate & Museum Geologi",
    "deskripsi": "Gedung Sate adalah ikon kota Bandung, sementara Museum Geologi di dekatnya menyimpan koleksi fosil dan batuan terlengkap di Indonesia.",
    "akses_lokasi": "15-20 menit dari Stasiun Bandung atau pusat kota. Lokasinya berdekatan, bisa jalan kaki antar keduanya.",
    "icon": "museum",
    "estimated_cost": 100000,
    "keterangan": "Gedung Sate adalah kantor pemerintahan, hanya bisa dikunjungi di waktu tertentu. Museum Geologi tutup pada hari Senin dan libur nasional."
  },
  {
    "nama": "Glamping Lakeside & Situ Patenggang",
    "deskripsi": "Danau indah di area Ciwidey dengan restoran ikonik berbentuk kapal pinisi besar (Pinisi Resto) di tepinya.",
    "akses_lokasi": "Sekitar 2-3 jam dari Bandung via Tol Soroja. Lokasinya berdekatan dengan Kawah Putih dan Ranca Upas.",
    "icon": "water",
    "estimated_cost": 250000,
    "keterangan": "Nikmati pemandangan danau dari atas 'kapal' atau sewa perahu untuk berkeliling danau menuju Batu Cinta."
  },
  {
    "nama": "Ranca Upas",
    "deskripsi": "Kawasan perkemahan dengan penangkaran rusa yang jinak, di mana pengunjung bisa berinteraksi dan memberi makan rusa secara langsung.",
    "akses_lokasi": "Berada di kawasan Ciwidey, sekitar 2-3 jam dari pusat kota Bandung. Jalurnya sama menuju Kawah Putih.",
    "icon": "landscape",
    "estimated_cost": 200000,
    "keterangan": "Sangat cocok untuk keluarga dan pecinta alam. Bawa jaket karena udara sangat dingin, terutama jika berkemah malam hari."
  },
  {
    "nama": "Tebing Keraton",
    "deskripsi": "Tebing dengan pemandangan spektakuler menghadap kawasan Taman Hutan Raya Djuanda, sangat populer untuk melihat matahari terbit.",
    "akses_lokasi": "Sekitar 45-60 menit dari pusat kota ke arah Dago Pakar. Jalan menanjak, disarankan menggunakan kendaraan yang prima.",
    "icon": "landscape",
    "estimated_cost": 150000,
    "keterangan": "Waktu terbaik adalah subuh untuk melihat lautan kabut dan sunrise. Gunakan alas kaki yang nyaman untuk trekking ringan."
  },
  {
    "nama": "Orchid Forest Cikole",
    "deskripsi": "Taman anggrek di tengah hutan pinus sejuk, terkenal dengan jembatan gantung (Wood Bridge) yang menyala indah di malam hari.",
    "akses_lokasi": "Berada di Cikole, Lembang. Sekitar 1.5-2 jam dari pusat kota Bandung, melewati Tangkuban Perahu.",
    "icon": "park",
    "estimated_cost": 300000,
    "keterangan": "Suasana sangat asri dan sejuk. Sangat direkomendasikan untuk dikunjungi sore menjelang malam untuk melihat jembatan lampu."
  },
  {
    "nama": "Dusun Bambu Family Leisure Park",
    "deskripsi": "Taman rekreasi keluarga berkonsep ekowisata, menawarkan danau, saung-saung makan unik, dan berbagai aktivitas alam.",
    "akses_lokasi": "Berada di kaki Gunung Burangrang, Cisarua. Sekitar 1.5-2 jam dari Bandung. Akses jalan cukup menantang.",
    "icon": "park",
    "estimated_cost": 350000,
    "keterangan": "Cocok untuk liburan keluarga seharian. Coba sensasi makan di sangkar burung raksasa (Lutung Kasarung) atau di tepi danau."
  },
  {
    "nama": "Taman Hutan Raya Ir. H. Djuanda (Tahura)",
    "deskripsi": "Kawasan konservasi alam luas dengan jalur trekking, Curug Omas, serta gua peninggalan era Jepang dan Belanda.",
    "akses_lokasi": "Berlokasi di Dago Pakar, sekitar 45 menit dari pusat kota. Akses mudah dengan kendaraan pribadi atau ojek online.",
    "icon": "park",
    "estimated_cost": 120000,
    "keterangan": "Siapkan fisik untuk berjalan cukup jauh. Jangan lupa bawa senter jika ingin menjelajahi Gua Jepang dan Gua Belanda."
  },
  {
    "nama": "Museum Konferensi Asia Afrika",
    "deskripsi": "Museum sejarah yang mendokumentasikan Konferensi Asia Afrika tahun 1955, berlokasi di dalam Gedung Merdeka yang megah.",
    "akses_lokasi": "Terletak di Jalan Asia Afrika, sangat dekat dengan Alun-alun Bandung. Dapat dijangkau dengan jalan kaki dari pusat kota.",
    "icon": "museum",
    "estimated_cost": 80000,
    "keterangan": "Tiket masuk gratis, namun seringkali perlu registrasi online terlebih dahulu. Tutup pada hari Senin dan hari libur nasional."
  },
  {
    "nama": "Kiara Artha Park",
    "deskripsi": "Taman kota modern dengan atraksi utama air mancur menari (dancing fountain), taman lampion, dan area rekreasi yang luas.",
    "akses_lokasi": "Sekitar 20-30 menit dari pusat kota, dekat Jalan Kiaracondong. Mudah dijangkau dengan transportasi umum maupun pribadi.",
    "icon": "park",
    "estimated_cost": 100000,
    "keterangan": "Pertunjukan air mancur biasanya ada pada malam hari, terutama saat akhir pekan. Tempat yang bagus untuk bersantai sore."
  },
  {
    "nama": "Pusat Sepatu Cibaduyut",
    "deskripsi": "Kawasan yang terkenal sebagai pusat industri dan penjualan sepatu serta produk kulit buatan tangan di Bandung.",
    "akses_lokasi": "Sekitar 30-45 menit dari pusat kota, dekat dengan Terminal Leuwipanjang. Dapat diakses dengan angkot atau taksi online.",
    "icon": "city",
    "estimated_cost": 250000,
    "keterangan": "Patung sepatu raksasa menjadi ikonnya. Keterampilan menawar sangat berguna di toko-toko non-resmi."
  },
  {
    "nama": "Paskal Food Market",
    "deskripsi": "Pusat kuliner outdoor dengan ratusan tenant, menyajikan beragam makanan dari tradisional hingga internasional.",
    "akses_lokasi": "Berada di area Paskal 23 Mall, sangat dekat dengan Stasiun Bandung (bisa jalan kaki).",
    "icon": "city",
    "estimated_cost": 150000,
    "keterangan": "Sangat ramai pada malam hari, terutama akhir pekan. Suasananya hidup dengan lampu-lampu dan sering ada live music."
  },
  {
    "nama": "The Lodge Maribaya",
    "deskripsi": "Tujuan wisata adrenalin dengan berbagai spot foto menantang berlatar perbukitan hutan pinus yang indah.",
    "akses_lokasi": "Berada di kawasan Maribaya, Lembang. Sekitar 1.5-2 jam dari pusat kota. Jalan menanjak dan berliku.",
    "icon": "landscape",
    "estimated_cost": 300000,
    "keterangan": "Populer dengan wahana seperti ayunan Sky Wing, sepeda gantung Zip Bike, dan balon udara. Setiap wahana membayar tiket terpisah."
  },
  {
    "nama": "Pemandian Air Panas Ciater",
    "deskripsi": "Resor pemandian air panas alami dari kaki Gunung Tangkuban Perahu, menawarkan berbagai jenis kolam rendam dan terapi.",
    "akses_lokasi": "Berada di Kabupaten Subang, namun menjadi satu paket wisata Lembang. Sekitar 2-2.5 jam dari Bandung.",
    "icon": "water",
    "estimated_cost": 250000,
    "keterangan": "Sangat baik untuk relaksasi setelah lelah berwisata. Buka 24 jam untuk beberapa area kolam rendam umum."
  },
  {
    "nama": "Kawasan Kuliner Punclut",
    "deskripsi": "Deretan warung dan kafe di perbukitan Ciumbuleuit yang menawarkan kuliner khas Sunda dengan pemandangan kota Bandung dari ketinggian.",
    "akses_lokasi": "Sekitar 45-60 menit dari pusat kota. Jalan menanjak dan cenderung sempit, lebih nyaman dengan mobil atau motor.",
    "icon": "landscape",
    "estimated_cost": 150000,
    "keterangan": "Pemandangan terbaik adalah saat senja hingga malam hari saat lampu kota mulai menyala. Bawa jaket karena udara dingin."
  },
  {
    "nama": "Stone Garden Padalarang",
    "deskripsi": "Taman bebatuan kapur purba di puncak bukit, menawarkan pemandangan geologis yang eksotis dan spot foto unik seperti di zaman prasejarah.",
    "akses_lokasi": "Sekitar 60-90 menit dari Bandung ke arah Padalarang/Cianjur. Lebih mudah diakses dengan kendaraan pribadi.",
    "icon": "terrain",
    "estimated_cost": 150000,
    "keterangan": "Gunakan sepatu yang nyaman karena medan berbatu dan menanjak. Waktu terbaik adalah pagi atau sore hari untuk menghindari sengatan matahari."
  },
  {
    "nama": "Sudirman Street Day & Night Market",
    "deskripsi": "Pusat kuliner jalanan yang sangat beragam, terkenal dengan pilihan makanan non-halal yang melimpah di samping makanan halal.",
    "akses_lokasi": "Dekat dengan Alun-alun dan pusat kota, sekitar 15-20 menit berkendara. Berada di antara Jl. Jend. Sudirman dan Jl. Cibadak.",
    "icon": "city",
    "estimated_cost": 120000,
    "keterangan": "Ramai pada malam hari. Terbagi jelas menjadi area halal dan non-halal, perhatikan penanda yang ada."
  },
  {
    "nama": "Lembang Park & Zoo",
    "deskripsi": "Kebun binatang modern dan luas dengan konsep terbuka, memungkinkan interaksi lebih dekat dengan beberapa satwa dan memiliki area bermain anak.",
    "akses_lokasi": "Terletak di Jl. Kolonel Masturi, Lembang, sekitar 1-1.5 jam dari pusat kota. Akses jalan utama yang cukup lebar.",
    "icon": "park",
    "estimated_cost": 300000,
    "keterangan": "Sangat cocok untuk keluarga dengan anak-anak. Terdapat restoran unik dengan pemandangan langsung ke kandang harimau."
  },
  {
    "nama": "Sarae Hills",
    "deskripsi": "Kawasan wisata terpadu dengan konsep 'World of Wonders', menampilkan miniatur ikon-ikon global seperti Menara Eiffel dan Patung Liberty.",
    "akses_lokasi": "Terletak di Punclut, sekitar 45-60 menit dari pusat kota. Jalur menanjak, satu area dengan Lereng Anteng.",
    "icon": "park",
    "estimated_cost": 250000,
    "keterangan": "Sangat instagramable. Siapkan kamera untuk berfoto di berbagai spot ikonik dunia dalam satu lokasi."
  },
  {
    "nama": "Kampung Daun",
    "deskripsi": "Restoran berkonsep pedesaan asri, di mana pengunjung makan di saung-saung pribadi yang tersebar di antara aliran air dan pepohonan rindang.",
    "akses_lokasi": "Berada di area Lembang atas (Jl. Sersan Bajuri), sekitar 1-1.5 jam dari pusat kota.",
    "icon": "landscape",
    "estimated_cost": 250000,
    "keterangan": "Suasana sangat romantis dan sejuk di malam hari dengan penerangan obor. Menu andalannya adalah masakan Sunda dan Indonesia."
  },
  {
    "nama": "Alun-Alun Bandung & Masjid Raya",
    "deskripsi": "Pusat kota yang modern dengan hamparan rumput sintetis hijau yang luas dan Masjid Raya Bandung yang megah dengan menara kembar.",
    "akses_lokasi": "Berada di jantung kota Bandung, dapat diakses dari segala penjuru. Dekat dengan Jl. Asia Afrika dan Braga.",
    "icon": "city",
    "estimated_cost": 75000,
    "keterangan": "Pengunjung bisa naik ke puncak menara masjid untuk melihat pemandangan 360 derajat kota Bandung dengan tiket yang terjangkau."
  }
]
\`\`\``,
        },
      ],
    },
  ],
});
