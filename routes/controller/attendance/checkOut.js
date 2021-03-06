const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance } = require("../../../models"); // Call Model StaffAttendance
const checkDistance = require("./checkDistance");
const isLocationValid = require("./isLocationValid");
const calculateWorkingHour = require("./calculateWorkingHour");
const { Office } = require("../../../models");
const formatDistance = require("../../../utils/formatDistance");
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  const id = req.user.data.id;
  //Validate Data
  const schema = {
    checkOutTime: {
      type: "date",
      default: new Date(),
      optional: true,
      convert: true,
    },
    checkOutLocation: {
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

  try {
    const checkOutDay = new Date(req.body.checkOutTime)
      .toISOString()
      .slice(0, 10);
    const checkInData = await StaffAttendance.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("checkInTime")),
          "=",
          checkOutDay
        ),
        employeeId: req.user.data.id,
      },
    });

    if (!checkInData) {
      throw new Error("Anda Belum Check-in Hari Ini");
    }

    const passCheckOutDataIsExist = await StaffAttendance.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("checkOutTime")),
          "=",
          checkOutDay
        ),
        employeeId: id,
      },
    });

    if (passCheckOutDataIsExist) {
      res.status(403);
      return res.json({
        status: "error",
        message: "Anda Telah Melakukan Check-out",
      });
    }
    const office = req.user.data.Office;
    const officeLocation = {
      longitude: parseFloat(office.longitude),
      latitude: parseFloat(office.latitude),
    };
    const distanceFromOffice = checkDistance(
      req.body.checkOutLocation,
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

    //Execute query register

    //Define data parameter for register to database
    const workingHour = calculateWorkingHour(
      checkInData.checkInTime,
      req.body.checkOutTime
    );
    const data = {
      employeeId: req.user.data.id,
      checkOutTime: req.body.checkOutTime,
      checkOutLocation: JSON.stringify(req.body.checkOutLocation),
      workingHour: workingHour,
      updatedAt: Date.now(),
    };

    const employeeCheckOut = await StaffAttendance.update(data, {
      where: {
        $and: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("checkInTime")),
          "=",
          checkOutDay
        ),
        id: checkInData.id,
      },
    });

    return res.json({
      status: "success",
      data: {
        id: employeeCheckOut.employeeId,
      },
      message: "Anda Berhasil Melakukan Check-out",
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      status: "error",
      message: err.message ? err.message : "gagal melakukan check-out",
    });
  }
};
