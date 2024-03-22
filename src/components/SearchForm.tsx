import { Kamp } from "@/utils/data-points";
import React, { useEffect, useState } from "react";
import { Autocomplete } from "./Autocomplete";

interface Props {
  setMarkers: React.Dispatch<React.SetStateAction<Kamp[]>>;
}

const SearchForm: React.FC<Props> = ({ setMarkers }) => {
  const [dataForm, setDataForm] = useState<Kamp>({
    desc: "",
    name: "",
    price: 0,
    lat: 0,
    lng: 0,
    key: "",
  });
  const [kamps, setKamps] = useState<Kamp[]>([]);

  useEffect(() => {
    const storedKamps = localStorage.getItem("kamps");
    if (storedKamps) {
      setKamps(JSON.parse(storedKamps));
    }
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (!place) return;

    setDataForm((prev) => ({
      ...prev,
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
      key: JSON.stringify({
        name: place.name || "Local",
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      }),
    }));
  };

  const handleSubmit = () => {
    const newKamps = [...kamps, dataForm];
    setMarkers((prevKamps) => [...prevKamps, dataForm]);
    setKamps(newKamps);
    localStorage.setItem("kamps", JSON.stringify(newKamps));

    setDataForm({ lat: 0, lng: 0, key: "", name: "", desc: "", price: 0 });
  };

  return (
    <div className="flex flex-col gap-4  bg-slate-200 p-4 rounded-xl">
      <p className="text-2xl font-semibold text-center">
        Register your campsite.
      </p>
      <Autocomplete onPlaceSelect={handlePlaceSelect} />
      <input
        placeholder="Kamp name"
        className="w-full p-2 rounded-lg"
        onChange={(e) =>
          setDataForm((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
      <input
        placeholder="Kamp description"
        className="w-full p-2 rounded-lg"
        onChange={(e) =>
          setDataForm((prev) => ({
            ...prev,
            desc: e.target.value,
          }))
        }
      />
      <input
        placeholder="Daily rate"
        className="w-full p-2 rounded-lg"
        type="number"
        onChange={(e) =>
          setDataForm((prev) => ({
            ...prev,
            price: Number(e.target.value),
          }))
        }
      />
      <button
        className="bg-green-400 w-fit p-3 rounded-lg self-end disabled:opacity-35"
        onClick={handleSubmit}
        disabled={
          dataForm.price === 0 ||
          dataForm.name === "" ||
          dataForm.desc === "" ||
          dataForm.key === ""
        }
      >
        Submit
      </button>
    </div>
  );
};

export default SearchForm;
