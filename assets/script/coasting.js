const coastingAccuracyCompensation = {
  Gn: 0,
  Gerp: 0,
  Hrn: 20,
  Asn: 45,
  Bl: 20,
  Hgv: 15,
  Mp: 45,
  Zl: 75,
};

const calculateCoastingTime = (v0, xf, vehicleType) => {
  let A, B, C, D, E;

  // --- Assign Constants Based on Vehicle Type ---
  if (vehicleType == "SNG3-6") {
    A = -1e-11;
    B = 2e-8;
    C = 3e-5;
    D = -0.0668;
    E = 40.065;
  } else if (vehicleType == "SNG3-3") {
    A = -1e-11;
    B = 2e-8;
    C = 3e-5;
    D = -0.0668;
    E = 40.065;
  } else if (vehicleType == "ICMm3-3") {
    A = 0; // No 4th degree term
    B = -7e-8;
    C = 0.0001;
    D = -0.0905;
    E = 40.331;
  } else if (vehicleType == "ICMm3-6") {
    A = 0; // No 4th degree term
    B = -7e-8;
    C = 0.0001;
    D = -0.0755;
    E = 40.331;
  } else {
    return Infinity;
  }

  // --- Mathematical Definitions ---
  const v = (t) =>
    A * Math.pow(t, 4) + B * Math.pow(t, 3) + C * Math.pow(t, 2) + D * t + E;

  const d = (t) =>
    (A / 5) * Math.pow(t, 5) +
    (B / 4) * Math.pow(t, 4) +
    (C / 3) * Math.pow(t, 3) +
    (D / 2) * Math.pow(t, 2) +
    E * t;

  const dv_dt = (t) =>
    4 * A * Math.pow(t, 3) + 3 * B * Math.pow(t, 2) + 2 * C * t + D; // Derivative of v(t)

  // --- STEP 1: Find t0 where v(t0) == v0 ---
  let t0 = 0; // Initial guess for Newton-Raphson
  for (let i = 0; i < 100; i++) {
    let current_v = v(t0);
    let error = current_v - v0;
    if (Math.abs(error) < 0.001) break;
    t0 = t0 - error / dv_dt(t0);
  }

  // --- STEP 2 & 3: Find current distance and target distance ---
  let d0 = d(t0);
  let target_d = d0 + xf;

  // --- STEP 4: Find tf where d(tf) == target_d ---
  let tf = t0; // Initial guess is our starting time
  for (let i = 0; i < 100; i++) {
    let current_d = d(tf);
    let error = current_d - target_d;
    if (Math.abs(error) < 0.001) break;

    // The derivative of distance is velocity
    let current_v = v(tf);
    if (current_v <= 0 && error < 0) {
      return Infinity; // The vehicle stops before reaching the target distance
    }

    tf = tf - error / current_v;
  }

  // --- STEP 5: Calculate final coasting time ---
  return tf - t0;
};

const estimateRolloutAccuracy = (d, vi, eta, trainType, stop) => {
  const time = calculateCoastingTime(vi, d, trainType);
  return time - eta + coastingAccuracyCompensation[stop];
};
