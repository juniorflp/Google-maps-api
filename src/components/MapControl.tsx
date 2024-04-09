import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";

import { Autocomplete } from "./Autocomplete";

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  map: google.maps.Map | null;
};

export const CustomMapControl = ({
  controlPosition,
  map,
}: CustomAutocompleteControlProps) => {
  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (!place) return;

    // add the following code snippet
    map?.panTo({
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    });
    map?.setZoom(15);
  };
  return (
    <MapControl position={controlPosition}>
      <div className="w-full mt-4 shadow-lg rounded-lg">
        <Autocomplete onPlaceSelect={handlePlaceSelect} />
      </div>
    </MapControl>
  );
};
