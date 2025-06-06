import React from "react";
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

const Activity = ({
  data,
}: {
  id?: string;
  city?: string;
  data: DataType;
}) => {
  return (
    <div className="flex flex-col justify-start mt-5 space-y-5 mx-5">
      {/* Activities Section */}
      <div className="max-w-[1200px] mt-8 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MdTerrain className="text-green-600" />
            Wisata Populer
        </h2>
        <ScrollArea className="w-[330px] md:w-full h-48 whitespace-nowrap rounded-md mb-20 ">
          <div className="flex flex-row gap-5">
            {data.aktivitas.map((aktivitas, index) => (
              <div
                key={index}
                className="border  border-gray-200 rounded-xl p-5 h-40 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-white group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {iconComponents[aktivitas.icon]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                      {aktivitas.nama}
                    </h3>
                    <p className="text-gray-700 mt-2">{aktivitas.deskripsi}</p>
                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                      <MdDirectionsWalk className="mt-0.5 flex-shrink-0" />
                      <span className="italic">{aktivitas.akses_lokasi}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Activity;
