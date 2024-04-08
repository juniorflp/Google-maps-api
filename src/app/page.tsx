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
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <APIProvider apiKey="AIzaSyCo_ZVPsIRL4EzvZH4puXKAeFS5Pu2T7mk">
        <DynamicMapComponent />
      </APIProvider>
    </main>
  );
}
