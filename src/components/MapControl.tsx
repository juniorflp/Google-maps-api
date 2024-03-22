import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";

import { Autocomplete } from "./Autocomplete";

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <div className="w-full mt-4 shadow-lg rounded-lg">
        <Autocomplete onPlaceSelect={onPlaceSelect} />
      </div>
    </MapControl>
  );
};
