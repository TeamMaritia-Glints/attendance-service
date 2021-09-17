const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const {StaffAttendance} = require('../../../models');// Call Model StaffAttendance


module.exports = async (req, res) => {
  //Validate Data
  const schema = {
    employeeId: { type: "number", empty: false },
    timestamp: { type: "date", default: Date.now(), optional: true },
    location: {
      type: "object",
      strict: true,
      props: {
        long: "number",
        lat: "number",
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

  const action = req.body.action ? req.body.action:"CHECK-IN" ;

  //Define data parameter for register to database
  const data = {
    employeeId: req.body.employeeId,
    timestamp: req.body.timestamp,
    location: JSON.stringify(req.body.location),
    action: action,
    distanceFromOffice: 0.0,
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
    return res.json({
      status: "error",
      message: "gagal melakukan check-in"
    }); 
  }
};
