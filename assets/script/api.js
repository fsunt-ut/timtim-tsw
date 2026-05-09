const API_KEY = "fHtloK8eldsF4G9FqvKd8sGkMGJAbUYAi6X+q95LLco=";
const API_URL = "http://127.0.0.1:31270";

let lastAPIResponse = null;

const subscriptionsAPI = [
  "/subscription/CurrentFormation/0.LatLon",
  "/subscription/CurrentDrivableActor.Function.HUD_GetSpeed",
  "/subscription/TimeOfDay.Data",
  "/subscription/DriverAid.Data",
];

const callAPI = (endpoint) => {
  endpoint = endpoint.slice(5);

  let data = null;

  lastAPIResponse.Entries.forEach((datapoint) => {
    if (datapoint.Path == endpoint) {
      data = datapoint;
    }
  });

  return data;
};

const APISetup = () => {
  subscriptionsAPI.forEach((endpoint) => {
    CALL_API(endpoint + "?Subscription=1", "POST").then((response) => {});
  });
};

const API_TICK = () => {
  CALL_API("/subscription/?Subscription=1").then((response) => {
    lastAPIResponse = response;
  });
};

async function CALL_API(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
    DTGCommKey: API_KEY,
  };

  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
