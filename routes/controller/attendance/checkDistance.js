const haversine = require("haversine");

module.exports = (start, end) => {
    distanceHaversine = haversine(start, end, { unit: "meter" });
    return distanceHaversine.toFixed(2);
};
