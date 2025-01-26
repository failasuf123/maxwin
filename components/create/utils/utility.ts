
export type Todo = {
    id: string;
    type: string;
    name: string;
    description: string;
    cost: number;
    timeStart: string;
    timeEnd: string;
    tag: string[];
    image: string;
    imageList: string[];
    date: string;
  };
  
  
export  const getTodoStyling = (type: string) => {
    switch (type) {
      case "wisata":
        return "bg-blue-50";
      case "transportasi":
        return "bg-yellow-50";
      case "kuliner":
        return "bg-green-50";
      case "pengalaman":
        return "bg-purple-50";
      case "catatan":
        return "bg-gray-50";
      default:
        return "bg-white";
    }
  };
  
export  const categories = [
    "Solo Trip",
    "Family",
    "Friends",
    "Date",
    "Honey Moon",
    "Hidden Gem",
    "Hangout",
    "Hiking",
    "Adventure",
    "Explore",
  ];
  