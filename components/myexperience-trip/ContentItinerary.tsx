'use client';
import React, { useEffect, useState } from 'react';
import ContentWisata from './container/ContentWisata';
import ContentTransportasi from './container/ContentTransportasi';
import ContentUlasan from './container/ContentUlasan';
import ContentHotel from './container/ContentHotel';

interface TodoItem {
  cost: number;
  timeEnd: string;
  timeStart: string;
  name: string;
  type: string;
  description: string;
  image: string;
  tag: string[];
  imageList: string[];
}

interface TripData {
  tripData: {
    todos: {
      [date: string]: TodoItem[];
    };
    imageCover?: string;
    title?: string;
    username?: string;
    totalPrice?: number;
    totalDays?: number;
    category?: string;
    city?: string;
    description?: string;
  };
}

function ContentItinerary({ trip }: { trip: TripData | null }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
  const [allImageDetails, setAllImageDetails] = useState<{ image: string; name: string }[]>([]); // Daftar semua gambar beserta nama lokasi

  useEffect(() => {
    if (trip?.tripData?.todos) {
      // Mengumpulkan semua gambar dan nama lokasi dari trip.tripData.todos
      const imageDetails: { image: string; name: string }[] = [];
      Object.values(trip.tripData.todos).forEach((activities) => {
        activities.forEach((todo) => {
          if (todo.image && todo.image !== "/placeholder.png") {
            imageDetails.push({ image: todo.image, name: todo.name });
          }
          if (todo.imageList) {
            todo.imageList.forEach((img) => {
              if (img !== "/placeholder.png") {
                imageDetails.push({ image: img, name: todo.name });
              }
            });
          }
        });
      });
      setAllImageDetails(imageDetails); // Menyimpan daftar gambar beserta nama lokasi
    }
  }, [trip]);

  // Fungsi untuk memilih komponen berdasarkan tipe
  const renderTodoComponent = (todo: TodoItem) => {
    switch (todo.type.toLowerCase()) {
      case "wisata":
        return <ContentWisata date={''} {...todo} allImageDetails={allImageDetails} />;
        case "transportasi":
          return <ContentTransportasi date={''} {...todo} />;
          case "ulasan":
            return <ContentUlasan date={''} {...todo} />;
            case "hotel":
        return <ContentHotel date={''} {...todo} allImageDetails={allImageDetails} />;
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-gray-700">Unknown Todo Type</h4>
          </div>
        );
    }
  };

  return (
    <div className="mt-10">
      {trip?.tripData?.todos &&
        Object.entries(trip.tripData.todos)
          .sort(([dateA], [dateB]) => {
            const dateObjA = new Date(dateA);
            const dateObjB = new Date(dateB);
            return dateObjA.getTime() - dateObjB.getTime(); // Urutkan secara ascending
          })
          .map(([date, activities], dayIndex) => {
            const formattedDate = new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(date));

            return (
              <div key={date} className="flex flex-col pt-2 mt-5 border-t-2">
                <div className="flex flex-col mb-5">
                  <h3 className="text-gray-700 font-semibold text-lg">
                    Hari ke-{dayIndex + 1}
                  </h3>
                  <h3 className="text-gray-500 text-base text-start mb-5">
                    {formattedDate}
                  </h3>
                  <div className="space-y-2">
                    {activities
                      .sort((a, b) => {
                        const timeA = new Date(`1970-01-01T${a.timeStart}:00Z`).getTime();
                        const timeB = new Date(`1970-01-01T${b.timeStart}:00Z`).getTime();
                        return timeA - timeB; // Urutkan aktivitas pada tanggal ini
                      })
                      .map((todo, index) => (
                        <div key={index}>{renderTodoComponent(todo)}</div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
}

export default ContentItinerary;