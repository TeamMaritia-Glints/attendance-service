module.exports = (distance) => {
  if (distance > 1000) {
    const distanceKm = distance / 1000;
    return distanceKm.toFixed(2) + " Km";
  } else {
    return distance + " m";
  }
};
