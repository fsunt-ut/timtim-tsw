const getSpeedLimit = async () => {
  const speedLimitData = await callAPI("/get/DriverAid.Data");
  return Math.floor(speedLimitData.Values.speedLimit.value * 3.6);
};

const getPlayerLatLon = async () => {
  const formationLatLon = await callAPI("/get/CurrentFormation/1.LatLon");

  const location = {
    lat: formationLatLon.Values.Lat,
    lon: formationLatLon.Values.Lon,
  };

  return location;
};

const getWorldTime = async () => {
  const worldTimeData = await callAPI("/get/TimeOfDay.Data");

  const worldTimeISO8601 = worldTimeData.Values.WorldTimeISO8601;
  const worldDT = new Date(worldTimeISO8601);

  const hours = worldDT.getHours() - 1;
  const minutes = worldDT.getMinutes();
  const seconds = worldDT.getSeconds();

  hoursStr = hours.toString().padStart(2, "0");
  minutesStr = minutes.toString().padStart(2, "0");
  secondsStr = seconds.toString().padStart(2, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const timeBetween = (time1, time2) => {
  const [h1, m1, s1] = time1.split(":").map(Number);
  const [h2, m2, s2] = time2.split(":").map(Number);

  const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
  const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;

  const diffSeconds = totalSeconds2 - totalSeconds1;

  return diffSeconds;
};

const timeBetweenF = (time1, time2) => {
  const diffSeconds = timeBetween(time1, time2);
  const sign = diffSeconds < 0 ? "+" : "-";
  const absDiff = Math.abs(diffSeconds);

  const minutes = Math.floor(absDiff / 60);
  const seconds = absDiff % 60;

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  return `${sign}${minutesStr}:${secondsStr}`;
};

const formatTime = (time) => {
  const sign = time < 0 ? "+" : "-";
  const absDiff = Math.abs(time);

  const minutes = Math.floor(absDiff / 60);
  const seconds = Math.round(absDiff % 60);

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  return `${sign}${minutesStr}:${secondsStr}`;
};
