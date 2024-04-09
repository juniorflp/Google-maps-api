import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";

interface Props {
  getMap: (map: google.maps.Map | null) => void;
}

const GetMap: React.FC<Props> = ({ getMap }) => {
  const map = useMap();

  //export map to parent component

  useEffect(() => {
    if (map) {
      getMap(map);
    }
  }, [map]);
  return <></>;
};

export default GetMap;
