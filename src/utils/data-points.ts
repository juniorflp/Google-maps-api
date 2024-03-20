type RawLocation = [string, number, number];

export type Kamp = {
  key: string;
  name: string;
  lat: number;
  lng: number;
};

const kamps: RawLocation[] = [
  ["Local 1, Santa Catarina", -27.6346, -50.4782],
  ["Local 2, Santa Catarina", -26.0909, -49.0549],
  ["Local 3, Santa Catarina", -26.4829, -52.0919],
  ["Local 4, Santa Catarina", -25.9983, -48.7787],
  ["Local 5, Santa Catarina", -27.6659, -50.1273],
  ["Local 6, Santa Catarina", -26.7767, -49.2606],
  ["Local 7, Santa Catarina", -28.7986, -51.4506],
  ["Local 8, Santa Catarina", -26.425, -49.2054],
  ["Local 9, Santa Catarina", -29.3227, -52.0323],
  ["Local 10, Santa Catarina", -27.1416, -51.7089],
  ["Local 11, Santa Catarina", -27.8415, -53.1475],
  ["Local 12, Santa Catarina", -27.428, -52.298],
  ["Local 13, Santa Catarina", -27.2016, -50.477],
  ["Local 14, Santa Catarina", -28.2577, -49.7629],
  ["Local 15, Santa Catarina", -29.1982, -49.7629],
  ["Local 16, Santa Catarina", -28.9277, -52.4167],
  ["Local 17, Santa Catarina", -29.1456, -51.3733],
  ["Local 18, Santa Catarina", -27.7823, -50.1288],
  ["Local 19, Santa Catarina", -26.4452, -52.9094],
  ["Local 20, Santa Catarina", -28.712, -53.234],
];

const formatted: Kamp[] = kamps.map(([name, lat, lng]) => ({
  name,
  lat,
  lng,
  key: JSON.stringify({ name, lat, lng }),
}));

export default formatted;
