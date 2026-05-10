const timetable = timetable_data[runningNumber];

const stopList = compileStopList();

let nextStopIndex = 1;

const buildUIData = async () => {
  const trackMonitorHeight = 600;

  const currentTrainAPI = await CALL_API("/get/CurrentFormation/0.ObjectClass");
  const currentTrain = currentTrainAPI.Values.ObjectClass.split("_")[3];

  if (await passedStop(stopList[nextStopIndex].poi)) {
    nextStopIndex = Math.min(nextStopIndex + 1, stopList.length - 1);
  }

  const speed = await callAPI(
    "/get/CurrentDrivableActor.Function.HUD_GetSpeed",
  );

  const stationary = await atStation(stopList[nextStopIndex].poi);

  const trainType = currentTrain + "-" + trainLength;

  const lastTarget = stopList[nextStopIndex - 1].poi;
  const nextTarget = stopList[nextStopIndex].poi;
  const playerLocation = await getPlayerLatLon();
  const worldTime = await getWorldTime();
  const nextTargetATime = timetable[nextTarget][0].time;
  const nextTargetVTime = timetable[nextTarget][1].time;
  const lastTargetVTime = timetable[lastTarget][1].time;
  const currentSpeedLimit = await getSpeedLimit();
  const nextTargetPos = geo[nextTarget];
  const timeToNextTarget = timeBetweenF(
    worldTime,
    stationary ? nextTargetVTime : nextTargetATime,
  );
  const rolloutAccuracy = estimateRolloutAccuracy(
    pointsDist(playerLocation, nextTargetPos),
    speed.Values["Speed (ms)"],
    timeBetween(worldTime, nextTargetATime),
    trainType,
    nextTarget,
  );
  const nextTargetTrack = trackInfo(
    nextTarget,
    stopList[stopList.length - 1].poi,
    nextTarget,
  );

  const nextSignalData = await callAPI("/get/DriverAid.Data");

  let rolloutAccuracyStr = "...";
  if (!stationary) {
    if (speed.Values["Speed (ms)"] > 7.5) {
      if (pointsDist(playerLocation, nextTargetPos) > 1500) {
        if (Math.abs(rolloutAccuracy) < 900) {
          rolloutAccuracyStr = formatTime(-1 * rolloutAccuracy);
        }
      }
    }
  }

  const distanceToNextTarget = pointsDistF(playerLocation, nextTargetPos);

  const UI_CurrentSpeedLimit = document.getElementById("currentSpeedLimit");
  const UI_WorldTime = document.getElementById("worldTime");
  const UI_LastTarget = document.getElementById("lastTarget");
  const UI_NextTarget = document.getElementById("nextTarget");
  const UI_NextTargetAction = document.getElementById("nextTargetAction");
  const UI_NextTargetETA = document.getElementById("nextTargetETA");
  const UI_NextTargetTrack = document.getElementById("nextTargetTrack");
  const UI_NextTargetDistance = document.getElementById("nextTargetDistance");
  const UI_TargetETA = document.getElementById("TargetETA");
  const UI_TargetActionLabel = document.getElementById("targetActionLabel");
  const UI_RunningETA = document.getElementById("runningETA");
  const UI_nextSignal = document.getElementById("nextSignal");
  const UI_nextStopTrack = document.getElementById("nextTargetTrack");

  UI_CurrentSpeedLimit.textContent = currentSpeedLimit;
  UI_WorldTime.textContent = worldTime;
  UI_LastTarget.textContent = lastTarget;
  UI_NextTarget.textContent = nextTarget;
  UI_NextTargetETA.textContent = stationary ? nextTargetVTime : nextTargetATime;
  UI_NextTargetDistance.textContent = distanceToNextTarget;
  UI_TargetETA.textContent = timeToNextTarget;
  UI_NextTargetAction.textContent = stationary ? "V" : "A";
  UI_TargetActionLabel.textContent = stationary ? "vertrek" : "aankomst";
  UI_RunningETA.textContent = rolloutAccuracyStr;
  UI_nextStopTrack.textContent = nextTargetTrack;

  Object.keys(geo).forEach((poi) => {
    const poiElement = document.getElementById(`poi_${poi}`);
    const poiPos = geo[poi];

    if (stopList.findIndex((stop) => stop.poi == poi) != -1) {
      poiElement.classList.add("stop");
    }

    let poiY = -50;
    let poiETA = "";

    try {
      poiETA = timetable[poi][0].time;

      const metersToPOI = pointsDist(playerLocation, poiPos);
      poiY = (metersToPOI / 10000) * trackMonitorHeight + 33;

      let poiPassed = false;
      if (runningNumber % 2 === 1) {
        if (playerLocation.lat >= poiPos.lat) {
          poiPassed = true;
        }
      } else {
        if (playerLocation.lat <= poiPos.lat) {
          poiPassed = true;
        }
      }

      poiPassed && (poiY = -50);
    } catch (e) {}

    poiElement.style.bottom = `${poiY}px`;
    poiElement.textContent = `${poiETA} ${poi}`;
  });

  const signalColor = {
    Clear: "#fffa",
    Stop: "#f00a",
    Approach: "#f90a",
    Unknown: "#777",
    // Unknown: "#f00a",
  };

  const nextSignals = nextSignalData.Values.nextSignals;
  let nextSignalAspects = [];

  nextSignals.forEach((signal, index) => {
    const aspect = signal.value;
    const start =
      (signal.distanceToNextSignal / 100 / 10000) * trackMonitorHeight + 33;
    let height = 33;
    if (nextSignals[index + 1] != undefined) {
      height =
        ((nextSignals[index + 1].distanceToNextSignal -
          signal.distanceToNextSignal) /
          100 /
          10000) *
        trackMonitorHeight;
    }

    nextSignalAspects.push({ aspect, height, start });
  });

  for (let i = nextSignalAspects.length; i < 11; i++) {
    nextSignalAspects.push({
      aspect: "Unknown",
      height: 1000,
      start:
        nextSignalAspects[nextSignalAspects.length - 1].start +
        nextSignalAspects[nextSignalAspects.length - 1].height,
    });
  }

  nextSignalAspects.forEach((signal, index) => {
    const signalElement = document.getElementById(`signal-${index + 1}`);
    signalElement.style.backgroundColor =
      signalColor[signal.aspect || "Unknown"] || signalColor["Unknown"];
    signalElement.style.height = `${signal.height}px`;
    signalElement.style.bottom = `${signal.start}px`;
  });
};
