const buildTrainData = async () => {
  const currentTrainAPI = await CALL_API("/get/CurrentFormation/0.ObjectClass");
  const currentTrain = currentTrainAPI.Values.ObjectClass.split("_")[3];

  const UI_RunningNumber = document.getElementById("runningNumber");
  const UI_Formation = document.getElementById("formation");
  const UI_stopTargetLengthSign = document.getElementById(
    "stopTargetLengthSign",
  );

  UI_RunningNumber.textContent = `${runningNumber}`;
  UI_Formation.textContent = currentTrain;
  UI_stopTargetLengthSign.textContent = trainLength;
};

APISetup();
API_TICK();
buildTrainData();

const UI_TICK = () => {
  API_TICK();
  buildUIData();
};

setInterval(UI_TICK, 1000);
