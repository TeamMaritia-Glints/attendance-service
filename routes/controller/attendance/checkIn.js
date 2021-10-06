const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance } = require("../../../models"); // Call Model StaffAttendance
const checkDistance = require("./checkDistance");
const isLocationValid = require("./isLocationValid");
const { Office } = require("../../../models");
const Sequelize = require("sequelize");
const formatDistance = require("../../../utils/formatDistance");

module.exports = async (req, res) => {
  const id = req.user.data.id;
  //Validate Data
  const schema = {
    checkInTime: {
      type: "date",
      default: Date.now(),
      optional: true,
      convert: true,
    },
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
  console.log(req.body.checkInTime);
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  try {
    const office = req.user.data.Office;
    if (!office) {
      res.status(404);
      return res.json({
        status: "error",
        message: "Anda Belum Terdaftar di Kantor Manapun",
      });
    }
    const checkInDay = new Date(req.body.checkInTime)
      .toISOString()
      .slice(0, 10);
    const passCheckInDataIsExist = await StaffAttendance.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("checkInTime")),
          "=",
          checkInDay
        ),
        employeeId: id,
      },
    });

    if (passCheckInDataIsExist) {
      res.status(403);
      return res.json({
        status: "error",
        message: "Anda Telah Melakukan Check-in",
      });
    }
    //Execute query register

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
          formatDistance(distanceFromOffice),
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
      message: "Anda Berhasil Melakukan Check-in",
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
