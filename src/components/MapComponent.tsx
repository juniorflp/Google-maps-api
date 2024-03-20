"use client";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import React, { useMemo, useState } from "react";
import kamps, { Kamp } from "../utils/data-points";

const MapComponent: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
  const INITIAL_POSITION = useMemo(
    () => ({ lat: -27.62254579264724, lng: -48.6754709039612 }),
    []
  );

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleMarkerOpen = (key: string) => {
    setSelectedMarker(key);
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null);
  };
  return (
    <section className="relative flex flex-col w-full h-screen   bg-gray-900">
      <p className="mx-auto text-white text-2xl my-10 ">Kamps for Kids POC</p>
      <APIProvider apiKey={API_KEY!}>
        <div className="w-[70vw] h-[60vh] ml-auto mr-4">
          <Map
            defaultZoom={7}
            defaultCenter={INITIAL_POSITION}
            mapId={MAP_ID}
            streetViewControl={false}
          >
            <Markers
              points={kamps}
              onOpen={handleMarkerOpen}
              onClose={handleMarkerClose}
              isOpen={(key) => selectedMarker === key}
            />
          </Map>
        </div>
      </APIProvider>
    </section>
  );
};

type Props = {
  points: Kamp[];
  isOpen: (key: string) => boolean;
  onOpen: (key: string) => void;
  onClose: () => void;
};

const Markers = ({ points, isOpen, onOpen, onClose }: Props) => {
  return (
    <>
      {points.map((point) => (
        <div key={point.key}>
          <AdvancedMarker position={point} onClick={() => onOpen(point.key)}>
            <p className="text-4xl">🏕️</p>
          </AdvancedMarker>
          {isOpen(point.key) && (
            <InfoWindow position={point} onCloseClick={onClose}>
              <p>{point.name}</p>
            </InfoWindow>
          )}
        </div>
      ))}
    </>
  );
};

export default MapComponent;
