const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance } = require("../../../models"); // Call Model StaffAttendance
const checkDistance = require("./checkDistance");
const isLocationValid = require("./isLocationValid");
const {Office} = require("../../../models")

module.exports = async (req, res) => {
  //Validate Data
  const schema = {
    employeeId: { type: "number", empty: false },
    timestamp: { type: "date", default: Date.now(), optional: true },
    location: {
      type: "object",
      strict: true,
      props: {
        longitude: "number",
        latitude: "number",
      },
    },
    action: {
      type: "string",
      items: "string",
      enum: ["CHECK-IN", "CHECK-OUT"],
      optional: true,
    },
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  const office = await Office.findOne({
    order: [
      ['id']
    ]
  })
  const officeLocation = {longitude: office.longitude, latitude: office.latitude};
  const distanceFromOffice = checkDistance(req.body.location, officeLocation);
  if (!isLocationValid(distanceFromOffice)) {
    res.status(400);
    return res.json({
      status: "error",
      message:
        "jarak terlalu jauh dari kantor, jarak anda sebesar: " + 
        distanceFromOffice +" m",
    });
  }

  const action = req.body.action ? req.body.action : "CHECK-IN";

  //Define data parameter for register to database
  const data = {
    employeeId: req.body.employeeId,
    timestamp: req.body.timestamp,
    location: JSON.stringify(req.body.location),
    action: action,
    distanceFromOffice: distanceFromOffice,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    //Execute query register
    const employeeCheckIn = await StaffAttendance.create(data);

    return res.json({
      status: "success",
      data: {
        id: employeeCheckIn.id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      status: "error",
      message: "gagal melakukan check-in",
    });
  }
};
