import React from "react";

type PlaceProps = {
  setOffice: (position: google.maps.LatLngAltitudeLiteral) => void;
};

const Places: React.FC<PlaceProps> = ({ setOffice }) => {
  return (
    <div className="absolute indent-0 flex flex-col w-[28vw] h-screen bg-slate-300 p-5">
      dfdf
    </div>
  );
};

export default Places;
