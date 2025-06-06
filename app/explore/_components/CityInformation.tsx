"use client";
import React, { useState } from "react";
import { DataType, IconType } from "../_utils/typings";

import {
  MdPlace,
  MdExpandMore,
  MdExpandLess,
  MdTrain,
  MdDirectionsBus,
  MdDirectionsWalk,
  MdTerrain,
  MdWater,
  MdLandscape,
  MdMuseum,
  MdPark,
} from "react-icons/md";
import { FaMountain } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Icon components mapping
const iconComponents: Record<IconType, JSX.Element> = {
  mountain: <FaMountain className="text-2xl text-green-600" />,
  water: <MdWater className="text-2xl text-blue-500" />,
  landscape: <MdLandscape className="text-2xl text-amber-600" />,
  museum: <MdMuseum className="text-2xl text-red-500" />,
  park: <MdPark className="text-2xl text-emerald-500" />,
  terrain: <MdTerrain className="text-2xl text-stone-600" />,
};

const CityInformation = ({
  id,
  city,
  data,
}: {
  id?: string;
  city?: string;
  data: DataType;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col justify-start mt-5 space-y-5 mx-5">
      {/* Banner Image */}
      <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <img
          className="w-full h-60 md:h-[400px] object-cover transition-transform duration-500 hover:scale-[1.02]"
          src="/banner-ai/pwt.jpg"
          alt="Banner Purwokerto"
        />
      </div>

      {/* Location Header */}
      <div className="flex items-center space-x-2 max-w-[1200px]">
        <MdPlace className="text-gray-800 text-3xl md:text-4xl" />
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          {city}
        </h1>
      </div>

      {/* Tags */}
      <div className="max-w-[1200px] flex flex-row items-center justify-start gap-4 my-5 flex-wrap">
        {data.tags.map((tag, index) => (
          <div
            key={index}
            className="px-2 md:px-4 py-1 md:py-2 bg-cyan-300 text-black border-2 border-black rounded-full text-xs md:text-lg hover:bg-cyan-400 transition-colors"
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Description with Read More */}
      <div className="max-w-[1200px] relative">
        <p
          className={`text-gray-700 text-base md:text-lg text-justify tracking-wide ${
            !isExpanded ? "line-clamp-3 md:line-clamp-2 overflow-hidden" : ""
          }`}
        >
          {data.deskripsi}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium mt-2 flex items-center transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Read Less</span>
              <MdExpandLess className="ml-1" />
            </>
          ) : (
            <>
              <span>Read More</span>
              <MdExpandMore className="ml-1" />
            </>
          )}
        </button>
      </div>

      {/* Transportation Access */}
      <div className="max-w-[1200px] bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MdDirectionsBus className="text-blue-600" />
          Akses Transportasi
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <MdTrain className="text-2xl text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">
                Stasiun Kereta Api
              </h3>
              <p className="text-gray-700">{data.akses.stasiun}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <MdDirectionsBus className="text-2xl text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Terminal Bus</h3>
              <p className="text-gray-700">{data.akses.terminal_bus}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CityInformation;
