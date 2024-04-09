"use client";
import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useRef, useState } from "react";
import kamps, { Kamp } from "../utils/data-points";
import CardKamp from "./CardKamp";
import GetMap from "./GetMap";
import SearchForm from "./SearchForm";

const MapComponent: React.FC = () => {
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
  const INITIAL_POSITION = useMemo(
    () => ({ lat: -25.6863655, lng: -48.7768533 }),
    []
  );
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const [position, setPosition] = useState(INITIAL_POSITION);
  const [markers, setMarkers] = useState<Kamp[]>(kamps);
  const [visibleCards, setVisibleCards] = useState<Kamp[]>(kamps);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [viewAll, setViewAll] = useState(false);

  const load = useApiIsLoaded();

  const handleMarkerOpen = (key: string) => {
    setSelectedMarker(key);
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null);
  };

  async function initialPosition() {
    // Get the current position
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

  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      // filter all markers that are visible
      const visibleMarkers = markers.filter((marker) => {
        const markerPosition = new google.maps.LatLng(marker.lat, marker.lng);
        return bounds?.contains(markerPosition);
      });

      setVisibleCards(visibleMarkers);
    }
  };

  useEffect(() => {
    if (map) {
      map.panTo(position);
      map.addListener("bounds_changed", handleBoundsChanged);
      return () => {
        google.maps.event.clearListeners(map, "bounds_changed");
      };
    }
  }, [position]);

  useEffect(() => {
    // Save kamps to local storage
    const storedKamps = localStorage.getItem("kamps");
    if (storedKamps) {
      setMarkers([...kamps, ...JSON.parse(storedKamps)]);
    }
    initialPosition();
  }, []);

  if (!load) {
    return <div>Loading...</div>;
  }

  const cardsToPlay = viewAll ? markers : visibleCards;

  return (
    <section className="relative flex flex-col w-full pb-10  bg-gray-900">
      <p className="mx-auto text-white text-2xl my-10 ">Kamps for Kids POC</p>
      <div className="flex ">
        <div className="w-[60%] relative flex flex-col justify-center items-center gap-10">
          <div className="w-full h-[83vh] mx-auto  ">
            {position && (
              <Map
                id="my-map"
                defaultZoom={9}
                mapId={MAP_ID}
                defaultCenter={position}
                clickableIcons={false}
                streetViewControl={false}
              >
                <GetMap getMap={(map) => setMap(map)} />

                <Markers
                  points={markers}
                  onOpen={handleMarkerOpen}
                  onClose={handleMarkerClose}
                  isOpen={(key) => selectedMarker === key}
                />
                {/* <CustomMapControl
                  controlPosition={ControlPosition.TOP}
                  map={map}
                /> */}
              </Map>
            )}
          </div>

          <SearchForm setMarkers={setMarkers} map={map} />
        </div>
        <div className="flex flex-col w-[40%] h-[83vh]  bg-slate-50 p-5 shadow-2xl">
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="viewAll"
              name="viewAll"
              checked={viewAll}
              onChange={() => setViewAll(!viewAll)}
            />
            <span>View All</span>
          </div>

          <div className="flex flex-col gap-6 overflow-auto ">
            {cardsToPlay.map((marker) => (
              <CardKamp key={marker.key} campData={marker} map={map} />
            ))}
          </div>
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
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const goToPin = (point: Kamp) => {
    if (map) {
      map.panTo({ lat: point.lat, lng: point.lng });
      map.setZoom(15);
    }
  };

  useEffect(() => {
    // clearMarkers -  commented because it was making the marks flicker

    // clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <div
          key={point.key}
          onMouseEnter={() => onOpen(point.key)}
          onMouseOut={onClose}
          onClick={() => goToPin(point)}
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
          <AdvancedMarker
            position={point}
            onClick={() => onOpen(point.key)}
            ref={(marker) => setMarkerRef(marker, point.key)}
          >
            <p className="text-4xl">🏕️</p>
          </AdvancedMarker>
        </div>
      ))}
    </>
  );
};

export default MapComponent;
