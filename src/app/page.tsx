"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(
  () => import("../components/MapComponent"),
  {
    ssr: false, // impede renderização no servidor
  }
);

export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <main className="flex min-h-screen flex-col items-center ">
      <APIProvider apiKey={API_KEY!}>
        <DynamicMapComponent />
      </APIProvider>
    </main>
  );
}
