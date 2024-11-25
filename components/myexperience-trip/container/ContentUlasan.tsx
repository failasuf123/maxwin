import React, { useState } from "react";

type Todo = {
  type: string;
  name: string;
  description: string;
  cost: number;
  timeStart: string;
  timeEnd: string;
  image: string;
  imageList: string[];
  date: string;
};

type ContentWisataProps = Todo 
const ContentUlasan = ({ name, description }: ContentWisataProps) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionVisible((prev) => !prev);
  };

  return (
    <div
      className="bg-rose-50 px-5 py-5 rounded-3xl ml-10 relative cursor-pointer"
      onClick={toggleDescription}
    >
      <div>
        <h4 className="font-bold">📖 {name || "No Title"}</h4>
        {isDescriptionVisible && (
          <p className="text-xs mt-1">{description || "No description"}</p>
        )}
      </div>


    </div>
  );
};

export default ContentUlasan;
