import { Kamp } from "@/utils/data-points";
import { useMap } from "@vis.gl/react-google-maps";
import React from "react";

interface CardKampProps extends React.HTMLAttributes<HTMLDivElement> {
  campData: Kamp;
}

const CardKamp: React.FC<CardKampProps> = ({ campData, ...rest }) => {
  const map = useMap();

  const handleClick = () => {
    if (map) {
      map.panTo(new google.maps.LatLng(campData.lat, campData.lng));
    }
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
