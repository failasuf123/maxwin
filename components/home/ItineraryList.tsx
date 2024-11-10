import React from 'react';

function ItineraryList() {
  const itineraries = [
    {
      id: 1,
      city: "Jakarta",
      title: "Menjelajahi Vibes Metropolitan",
      author: "Justin Nathan Rijender",
      duration: "2 hari",
      category: "friends",
      price: "Rp.923K",
      highlights: "Monas, Kota Tua, SCBD, GBK ...",
      imageSrc: "/profile/billiard.png"
    },
    {
      id: 2,
      city: "Bandung",
      title: "Kuliner dan Pemandangan Kota",
      author: "Bimo Adrian",
      duration: "3 hari",
      category: "family",
      price: "Rp.1,05jt",
      highlights: "Lembang, Braga, Alun-Alun ...",
      imageSrc: "/profile/bimo.jpg"
    },
    {
      id: 3,
      city: "Surabaya",
      title: "Eksplorasi Kota Pahlawan",
      author: "Bima Nugraha",
      duration: "2 hari",
      category: "adventure",
      price: "Rp.740K",
      highlights: "Tugu Pahlawan, Tunjungan Plaza ...",
      imageSrc: "/profile/sendy.jpg"
    },
    {
      id: 4,
      city: "Bali",
      title: "Menikmati Indahnya Pantai",
      author: "I Made Vivaldi",
      duration: "5 hari",
      category: "romantic",
      price: "Rp.1,76jt",
      highlights: "Kuta, Ubud, Seminyak ...",
      imageSrc: "/profile/vivaldi.jpg"
    },
    {
      id: 5,
      city: "Yogyakarta",
      title: "Wisata Sejarah dan Budaya",
      author: "Fahmi Pratama",
      duration: "5 hari",
      category: "culture",
      price: "Rp.1,8jt",
      highlights: "Malioboro, Prambanan, Keraton ...",
      imageSrc: "/profile/pratama.jpeg"
    },
    {
      id: 6,
      city: "Malang",
      title: "Keindahan Alam Pegunungan",
      author: "Fahmi Pratama",
      duration: "2 hari",
      category: "nature",
      price: "Rp.750K",
      highlights: "Batu, Coban Rondo, Bromo ...",
      imageSrc: "/profile/pratama.jpeg"
    },
    {
      id: 7,
      city: "Semarang",
      title: "Perjalanan Sejarah dan Kuliner",
      author: "Bima Nugraha",
      duration: "3 hari",
      category: "family",
      price: "Rp.1,1jt",
      highlights: "Lawang Sewu, Kota Lama ...",
      imageSrc: "/profile/sendy.jpg"
    },
    {
      id: 8,
      city: "Makassar",
      title: "Eksotisme Pantai Losari",
      author: "I Made Vivaldi",
      duration: "4 hari",
      category: "friends",
      price: "Rp.1,53jt",
      highlights: "Pantai Losari, Fort Rotterdam ...",
      imageSrc: "/profile/vivaldi.jpg"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5 lg:gap-2 xl:gap-5 mt-10">
      {itineraries.map(itinerary => (
        <div key={itinerary.id} className="flex flex-col h-[300px] w-full overflow-hidden cursor-pointer group">
          <div className="relative h-3/5 w-full">
            <img 
              src="/placeholder.png" 
              className="h-full w-full object-cover rounded-lg" 
              alt="Gambar" 
            />
            <div className="absolute bottom-2 right-2 bg-white text-xs text-cyan-500 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors duration-800">
              {itinerary.city}
            </div>
          </div>
          <div className="flex flex-col items-center p-2 overflow-hidden text-ellipsis text-sm md:text-sm text-gray-500">
            <div className="flex flex-row items-center gap-3 md:gap-2">
              <img 
                src={itinerary.imageSrc} 
                className="h-10 w-10 rounded-full" 
                alt="Gambar" 
              />
              <div className="flex flex-col gap-0.5 leading-tight">
                <h2 className="text-gray-700 font-semibold">{itinerary.title}</h2>
                <div className="flex flex-row gap-1 text-xs font-light">
                  <span>Oleh: {itinerary.author}</span>
                </div>
                <div className="flex flex-row gap-1 text-xs font-normal">
                  <span>{itinerary.duration}</span>
                  <span>|</span>
                  <span>{itinerary.category}</span>
                  <span>|</span>
                  <span className="text-green-600 font-normal">{itinerary.price}</span>
                </div>
                <div className="flex items-center text-xs font-light">
                  {itinerary.highlights}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItineraryList;
