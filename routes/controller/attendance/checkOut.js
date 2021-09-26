const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance } = require("../../../models"); // Call Model StaffAttendance
const checkDistance = require("./checkDistance");
const isLocationValid = require("./isLocationValid");
const { Office } = require("../../../models");
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  //Validate Data
  const schema = {
    checkOutTime: { type: "date", default: Date.now(), optional: true },
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
          distanceFromOffice +
          " m",
      });
    }

    //Execute query register
    const today = new Date().toISOString().slice(0, 10);

    const checkInData = await StaffAttendance.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("checkInTime")),
          "=",
          today
        ),
        employeeId: req.user.data.id,
      },
    });
    
    if (!checkInData) {
      throw new Error("Tidak ada data Check-In pada hari ini");
    }
    //Define data parameter for register to database
    const data = {
      employeeId: req.user.data.id,
      checkOutTime: req.body.checkOutTime,
      checkOutLocation: JSON.stringify(req.body.checkOutLocation),
      updatedAt: Date.now(),
    };

    const employeeCheckOut = await StaffAttendance.update(data, {where: {id: checkInData.id}});

    return res.json({
      status: "success",
      data: {
        id: employeeCheckOut.employeeId,
      },
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
