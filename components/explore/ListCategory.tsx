"use client"
import React, { useState } from 'react'
import { IconProp,library } from '@fortawesome/fontawesome-svg-core';
import {
    faUmbrellaBeach, faMugHot, faCampground, faPersonHiking, faBinoculars, faRoad, faLock, faWater, faFishFins, faChildren, faQuestion, faMapLocationDot,
    faBuilding, faMountainSun, faDungeon, faFilm, faPeopleGroup, faTree, faBowlingBall,faPlaceOfWorship, faFutbol, faPeoplePulling, faPersonWalkingLuggage, faUsersLine, faUsers, faBookOpen, faGifts, faGift, faCloudMoon, faMartiniGlassCitrus, faBurger, faLandmark, faTreeCity, faCity,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  
library.add(
    faUmbrellaBeach,
    faMugHot,
    faCampground, faPersonHiking, faBinoculars, faRoad, faLock, faWater, faFishFins, faChildren, faQuestion,
    faBuilding, faMountainSun, faDungeon, faFilm, faPeopleGroup, faTree, faBowlingBall,faPlaceOfWorship, faFutbol, faPeoplePulling, faPersonWalkingLuggage, faUsersLine, faUsers, faBookOpen, faGifts, faGift, faCloudMoon, faMartiniGlassCitrus, faBurger, faLandmark, faTreeCity, faCity,
    // Daftar semua ikon lainnya
  );
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

  function getIconByName(name: string): IconProp {
    switch (name) {
      case "faBuilding":
        return ["fas", "building"];
      case "faDungeon":
        return ["fas", "dungeon"];
      case "faMugHot":
        return ["fas", "mug-hot"];
      case "faMartiniGlassCitrus":
        return ["fas", "martini-glass-citrus"];
      case "faBurger":
        return ["fas", "burger"];
      case "faMountainSun":
        return ["fas", "mountain-sun"];
      case "faUmbrellaBeach":
        return ["fas", "umbrella-beach"];
      case "faFilm":
        return ["fas", "film"];
      case "faWater":
        return ["fas", "water"];
      case "faTree":
        return ["fas", "tree"];
      case "faBinoculars":
        return ["fas", "binoculars"];
      case "faLandmark":
        return ["fas", "landmark"];
      case "faTreeCity":
        return ["fas", "tree-city"];
      case "faCity":
        return ["fas", "city"];
      case "faGift":
        return ["fas", "gift"];
      case "faPersonHiking":
        return ["fas", "person-hiking"];
      case "faFishFins":
        return ["fas", "fish-fins"];
      case "faPeopleGroup":
        return ["fas", "people-group"];
      case "faFutbol":
        return ["fas", "futbol"];
      case "faPersonWalkingLuggage":
        return ["fas", "person-walking-luggage"];
      case "faPeoplePulling":
        return ["fas", "people-pulling"];
      case "faCloudMoon":
        return ["fas", "cloud-moon"];
      case "faUsersLine":
        return ["fas", "users-line"];
      case "faUsers":
        return ["fas", "users"];
      case "faChildren":
        return ["fas", "children"];
      case "faCampground":
        return ["fas", "campground"];
      case "faPlaceOfWorship":
        return ["fas", "place-of-worship"];
      case "faBookOpen":
        return ["fas", "book-open"];
  
   
      // Tambahkan case untuk semua ikon lainnya
      default:
        return ["fas", "question"];
    }
  }

  const IconPropsCategory=[
    {
        "id": 1,
        "nama": "Mall",
        "icon": "faBuilding"
    },
    {
        "id": 2,
        "nama": "Taman Hiburan",
        "icon": "faDungeon"
    },
    {
        "id": 3,
        "nama": "CoffeShop",
        "icon": "faMugHot"
    },
    {
        "id": 4,
        "nama": "Cafe",
        "icon": "faMartiniGlassCitrus"
    },
    {
        "id": 5,
        "nama": "Restoran",
        "icon": "faBurger"
    },
    {
        "id": 6,
        "nama": "Gunung",
        "icon": "faMountainSun"
    },
    {
        "id": 7,
        "nama": "Pantai",
        "icon": "faUmbrellaBeach"
    },
    {
        "id": 8,
        "nama": "Bioskop",
        "icon": "faFilm"
    },
    {
        "id": 9,
        "nama": "Danau",
        "icon": "faWater"
    },
    {
        "id": 10,
        "nama": "Hutan",
        "icon": "faTree"
    },
    {
        "id": 11,
        "nama": "Air Terjun",
        "icon": "faBinoculars"
    },
    {
        "id": 12,
        "nama": "Land Mark",
        "icon": "faLandmark"
    },
    {
        "id": 13,
        "nama": "Taman",
        "icon": "faTreeCity"
    },
    {
        "id": 14,
        "nama": "Vibes Kota",
        "icon": "faCity"
    },
    {
        "id": 15,
        "nama": "Gratis",
        "icon": "faGift"
    },
    {
        "id": 16,
        "nama": "Mendaki",
        "icon": "faPersonHiking"
    },
    {
        "id": 17,
        "nama": "Snorkeling",
        "icon": "faFishFins"
    },
    {
        "id": 18,
        "nama": "Hangout",
        "icon": "faPeopleGroup"
    }
]
  

export default function ListCategory() {
  //Navbar Data kota dan kategori
  const [CategoryList, setCategoryList] = useState(IconPropsCategory);
  
  //Navbar data dan atau kategori yang di pilih
  const [selectedCategory, setSelectedCategory] = useState<string | undefined |null>()

  const handleCategoryClick = (nama:string) => {
    setSelectedCategory(nama);
  }
  return (
    <div>
      {/* <div className="flex flex-row gap-8 md:gap-12 text-gray-500 justify-between text-sm mt-3 px-5 overflow-y-scroll no-scrollbar md:mt-5 md:mb-3"> */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md ">
      <ScrollBar orientation="horizontal" />


      <div className="flex flex-row gap-8 md:gap-12 text-gray-500 justify-between text-sm mt-3 px-5  md:mb-3">
            {CategoryList.map(category => {
                const icon = getIconByName(category.icon); 

                if (!icon) return null; 

                return (
                    <div key={category.id} className={`flex flex-col relative items-center gap-1 text-gray-500 cursor-pointer  hover:text-gray-700 ${selectedCategory == category.nama
                    ?'text-gray-700  border-gray-700 border-b-2 border-dashed ':null}`}
                     onClick={() => handleCategoryClick(category.nama)}>
                        <FontAwesomeIcon icon={icon} className="inline-flex h-6 w-6 bg-none mb-1" />
                        <p style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="text-xs  md:flex-auto md:visible">
                            {category.nama}
                        </p>
                    </div>
                );
            })}

      </div>
      </ScrollArea>
    </div>
  )
}


