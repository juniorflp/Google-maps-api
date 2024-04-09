import { Kamp } from "@/utils/data-points";
import React from "react";

interface CardKampProps extends React.HTMLAttributes<HTMLDivElement> {
  campData: Kamp;
  map: google.maps.Map | null;
}

const CardKamp: React.FC<CardKampProps> = ({ campData, map, ...rest }) => {
  const handleClick = () => {
    map?.panTo({ lat: campData.lat, lng: campData.lng });
    map?.setZoom(13);
  };
  return (
    <div
      {...rest}
      onClick={handleClick}
      className="bg-white  rounded-lg shadow-md p-4  cursor-pointer "
    >
      <h2 className="text-xl font-bold mb-2">{campData.name}</h2>
      <p className="text-gray-500">{campData.desc}</p>
    </div>
  );
};

export default CardKamp;
