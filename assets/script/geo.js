const pointsDistF = (point1, point2) => {
  const dist = pointsDist(point1, point2);
  if (dist >= 1000) {
    return `${(dist / 1000).toFixed(1)} km`;
  } else {
    return `${dist} m`;
  }
};

const pointsDist = (point1, point2) => {
  function toRad(degree) {
    return (degree * Math.PI) / 180;
  }

  const lat1 = toRad(point1.lat);
  const lon1 = toRad(point1.lon);
  const lat2 = toRad(point2.lat);
  const lon2 = toRad(point2.lon);

  const { sin, cos, sqrt, atan2 } = Math;

  const R = 6371; // earth radius in km
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    sin(dLat / 2) * sin(dLat / 2) +
    cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 1000); // distance in meters
};
