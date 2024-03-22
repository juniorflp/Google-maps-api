// ... outros imports
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
      <DynamicMapComponent />
    </main>
  );
}
