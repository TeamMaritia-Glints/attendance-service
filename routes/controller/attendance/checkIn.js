const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance } = require("../../../models"); // Call Model StaffAttendance
const checkDistance = require("./checkDistance");
const isLocationValid = require("./isLocationValid");
const { Office } = require("../../../models");

module.exports = async (req, res) => {
  //Validate Data
  const schema = {
    checkInTime: { type: "date", default: Date.now(), optional: true },
    checkInLocation: {
      type: "object",
      strict: true,
      props: {
        longitude: "number",
        latitude: "number",
      },
    },
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // const office = await Office.findOne({
  //   order: [
  //     ['id']
  //   ]
  // });

  try {
    //Execute query register
    const office = req.user.data.Office;
    //console.log(office);
    const officeLocation = {
      longitude: parseFloat(office.longitude),
      latitude: parseFloat(office.latitude),
    };
    console.log(officeLocation);
    console.log(req.body.checkInLocation);
    const distanceFromOffice = checkDistance(
      req.body.checkInLocation,
      officeLocation
    );
    if (!isLocationValid(distanceFromOffice)) {
      res.status(400);
      return res.json({
        status: "error",
        message:
          "jarak terlalu jauh dari kantor, jarak anda sebesar: " +
          distanceFromOffice +
          " m",
      });
    }

    //Define data parameter for register to database
    const data = {
      employeeId: req.user.data.id,
      checkInTime: req.body.checkInTime,
      checkInLocation: JSON.stringify(req.body.checkInLocation),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
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
