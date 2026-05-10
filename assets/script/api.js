const API_URL = "http://127.0.0.1:31270";

const callAPI = CALL_API;

async function CALL_API(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "text/plain",
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
