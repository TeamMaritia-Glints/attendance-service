module.exports = (checkInTimestamp, checkOutTimestamp) => {
  const checkOutTime = new Date(checkOutTimestamp);
  const checkInTime = new Date(checkInTimestamp);
  let workingHour = (checkOutTime.getTime() - checkInTime.getTime()) / 1000;
  workingHour /= 60;
  return Math.abs(Math.round(workingHour));
};
