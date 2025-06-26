import React, { useState } from "react";
import { Itinerary } from "@/app/itinerary/[id]/_utils/typings";
import Image from "next/image";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiLock,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface TripCardProps {
  itinerary: Itinerary;
  onShare: () => void;
  onMakePrivate: () => void;
  onDelete: () => void;
  isPublicTab: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  itinerary,
  onShare,
  onMakePrivate,
  onDelete,
  isPublicTab,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const getDuration = () => {
    if (!itinerary.dateStart || !itinerary.dateEnd) return "";

    const start = new Date(itinerary.dateStart);
    const end = new Date(itinerary.dateEnd);

    return `${format(start, "d MMM", { locale: id })} - ${format(
      end,
      "d MMM yyyy",
      { locale: id }
    )}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ">
      <div className="relative h-48">
        <Image
          src={itinerary.imageCover || "/itinerary-bg-default.webp"}
          alt={itinerary.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Menu Popover */}
        <div className="absolute top-3 right-3">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="bg-white/80 hover:bg-white p-2 rounded-full">
                <FiMoreVertical className="text-gray-700" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex flex-col">
                <button
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    router.push(`/itinerary/${itinerary.id}?type=edit`);
                  }}
                >
                  <FiEdit /> Edit
                </button>

                {!isPublicTab ? (
                  <button
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onShare();
                    }}
                  >
                    <FiShare2 /> Share
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onMakePrivate();
                    }}
                  >
                    <FiLock /> Make Private
                  </button>
                )}

                <button
                  className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onDelete();
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Status Label */}
        {itinerary.isPublic && (
          <div className="absolute top-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Shared
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {itinerary.title}
        </h3>

        {/* Metadata */}
        <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
          {itinerary.Cities && itinerary.Cities.length > 0 && (
            <div className="flex items-center gap-2">
              <FiMapPin className="flex-shrink-0" />
              <span className="line-clamp-1">
                {itinerary.Cities.map((city) => city.cityName).join(", ")}
              </span>
            </div>
          )}

          {itinerary.dateStart && itinerary.dateEnd && (
            <div className="flex items-center gap-2">
              <FiCalendar className="flex-shrink-0" />
              <span>{getDuration()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end items-center mt-1 ">
          <div
            onClick={() => {
              setIsPopoverOpen(false);
              router.push(`/itinerary/${itinerary.id}?type=edit`);
            }}
            className="cursor-pointer border-2 border-gray-200 rounded-lg py-1 px-6 md:px-8 hover:bg-gray-800 hover:text-white font-semibold"
          >
            Buka
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
