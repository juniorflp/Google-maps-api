import { createContext, useContext } from "react";

// Cria um Contexto para o mapa
const MapContext = createContext<google.maps.Map | null>(null);

export function useMapContext() {
  return useContext(MapContext);
}

export default MapContext;
