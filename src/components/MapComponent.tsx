"use client";
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
import kamps, { Kamp } from "../utils/data-points";
import { CustomMapControl } from "./MapControl";
import MapHandler from "./MapHandler";
import SearchForm from "./SearchForm";

const MapComponent: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
  const INITIAL_POSITION = useMemo(
    () => ({ lat: -29.3227, lng: -52.0323 }),
    []
  );
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [markers, setMarkers] = useState<Kamp[]>(kamps);

  const handleMarkerOpen = (key: string) => {
    setSelectedMarker(key);
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null);
  };

  useEffect(() => {}, [markers, position]);

  useEffect(() => {
    const storedKamps = localStorage.getItem("kamps");
    if (storedKamps) {
      setMarkers([...kamps, ...JSON.parse(storedKamps)]);
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <section className="relative flex flex-col w-full pb-10  bg-gray-900">
      <p className="mx-auto text-white text-2xl my-10 ">Kamps for Kids POC</p>
      <APIProvider apiKey={API_KEY!}>
        <div className="w-full relative flex flex-col justify-center items-center gap-10">
          <div className="w-[90vw] h-[60vh] mx-auto ">
            {position && (
              <Map
                defaultZoom={9}
                defaultCenter={position}
                mapId={MAP_ID}
                streetViewControl={false}
                clickableIcons={false}
              >
                <Markers
                  points={markers}
                  onOpen={handleMarkerOpen}
                  onClose={handleMarkerClose}
                  isOpen={(key) => selectedMarker === key}
                />
              </Map>
            )}
          </div>

          <CustomMapControl
            controlPosition={ControlPosition.TOP}
            onPlaceSelect={setSelectedPlace}
          />

          <MapHandler place={selectedPlace} />

          <SearchForm setMarkers={setMarkers} />
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
        <div
          key={point.key}
          onMouseEnter={() => onOpen(point.key)}
          onClick={() => console.log(point)}
        >
          {isOpen(point.key) && (
            <InfoWindow
              position={point}
              onCloseClick={onClose}
              pixelOffset={{ height: -30, width: 0, equals: () => true }}
            >
              <div className="flex flex-col gap-2 p-2">
                <p className="font-semibold">{point.name}</p>
                <p className="mt-2 max-w-[200px]">{point.desc}</p>
                <p> $ {point.price},00</p>
              </div>
            </InfoWindow>
          )}
          <AdvancedMarker position={point} onClick={() => onOpen(point.key)}>
            <p className="text-4xl">🏕️</p>
          </AdvancedMarker>
        </div>
      ))}
    </>
  );
};

export default MapComponent;
