const compileStopList = () => {
  let stopList = [];
  Object.keys(timetable).forEach((poi) => {
    timetable[poi].forEach((entry) => {
      if (entry.action === "a") {
        stopList.push({
          poi,
          time: entry.time,
        });
      }
    });
  });

  stopList.sort((a, b) => {
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);

    return (
      timeA[0] * 3600 +
      timeA[1] * 60 +
      timeA[2] -
      (timeB[0] * 3600 + timeB[1] * 60 + timeB[2])
    );
  });
  return stopList;
};

const passedStop = async (poi) => {
  const poiPos = geo[poi];
  const playerLocation = await getPlayerLatLon();
  const journeyDirNorth = runningNumber % 2 === 1;

  if (journeyDirNorth) {
    return (
      playerLocation.lat >= poiPos.lat &&
      pointsDist(playerLocation, poiPos) > 350
    );
  } else {
    return (
      playerLocation.lat <= poiPos.lat &&
      pointsDist(playerLocation, poiPos) > 350
    );
  }
};

const isStationary = async () => {
  const speedData = await callAPI(
    "/get/CurrentDrivableActor.Function.HUD_GetSpeed",
  );
  return Math.floor(Math.abs(speedData.Values["Speed (ms)"])) < 1;
};

const atStation = async (poi) => {
  const poiPos = geo[poi];
  const playerLocation = await getPlayerLatLon();
  const dist = pointsDist(playerLocation, poiPos);

  return dist < 250 && (await isStationary());
};

const trackInfo = (poi, finalStop, thisStop) => {
  // remove final two digits from runningNumber
  const trainSeries = runningNumber.toString().slice(0, -2);
  const trainID = trainSeries + "00" + finalStop;
  return arrivalTrackData[trainID][thisStop];
};
