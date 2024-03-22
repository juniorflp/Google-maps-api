type RawLocation = [string, number, number];

export type Kamp = {
  key: string;
  name: string;
  lat: number;
  lng: number;
  desc: string;
  price: number;
};

const kamps: RawLocation[] = [
  ["Local 1, Santa Catarina", -27.6863623, -48.7768581],
];

const formatted: Kamp[] = kamps.map(([name, lat, lng]) => ({
  name,
  lat,
  lng,
  key: JSON.stringify({ name, lat, lng }),
  desc: "test",
  price: 120,
}));

export default formatted;
