"use client";
import {
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
import kamps, { Kamp } from "../utils/data-points";
import CardKamp from "./CardKamp";
import { CustomMapControl } from "./MapControl";
import MapHandler from "./MapHandler";
import SearchForm from "./SearchForm";

const MapComponent: React.FC = () => {
  const API_KEY = "AIzaSyCo_ZVPsIRL4EzvZH4puXKAeFS5Pu2T7mk";
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
  const INITIAL_POSITION = useMemo(
    () => ({ lat: -25.6863655, lng: -48.7768533 }),
    []
  );
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [markers, setMarkers] = useState<Kamp[]>(kamps);

  const map = useMap();
  const load = useApiIsLoaded();

  const handleMarkerOpen = (key: string) => {
    setSelectedMarker(key);
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null);
  };

  async function initialPosition() {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got geolocation successfully:", position);
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }

  useEffect(() => {
    const storedKamps = localStorage.getItem("kamps");
    if (storedKamps) {
      setMarkers([...kamps, ...JSON.parse(storedKamps)]);
    }
    initialPosition();
  }, []);

  if (!load) {
    return <div>Loading...</div>;
  }
  console.log(map);
  return (
    <section className="relative flex flex-col w-full pb-10  bg-gray-900">
      <p className="mx-auto text-white text-2xl my-10 ">Kamps for Kids POC</p>
      <div className="flex ">
        <div className="w-full relative flex flex-col justify-center items-center gap-10">
          <div className="w-full h-[60vh] mx-auto  ">
            {position && (
              <Map
                id="my-map"
                defaultZoom={9}
                mapId={MAP_ID}
                defaultCenter={position}
                clickableIcons={false}
              >
                <div className="flex flex-col w-[40%] absolute right-0 gap-6 bg-slate-50 p-5 h-[60vh] overflow-auto shadow-2xl">
                  {markers.map((marker) => (
                    <CardKamp key={marker.key} campData={marker} />
                  ))}
                </div>
                <Markers
                  points={markers}
                  onOpen={handleMarkerOpen}
                  onClose={handleMarkerClose}
                  isOpen={(key) => selectedMarker === key}
                />
                <MapHandler place={selectedPlace} />
              </Map>
            )}
          </div>

          <CustomMapControl
            controlPosition={ControlPosition.TOP}
            onPlaceSelect={setSelectedPlace}
          />

          <SearchForm setMarkers={setMarkers} />
        </div>
      </div>
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
  const map = useMap();

  return (
    <>
      {points.map((point) => (
        <div
          key={point.key}
          onMouseEnter={() => onOpen(point.key)}
          onMouseOut={onClose}
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
