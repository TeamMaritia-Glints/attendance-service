const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance, User } = require("../../../models"); // Call Model StaffAttendance
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  const schema = {
    year: {
      type: "number",
      default: new Date().getFullYear(),
      optional: true,
      convert: true,
    },
    month: {
      type: "number",
      default: new Date().getMonth(),
      optional: true,
      convert: true,
    },
    day: {
      type: "number",
      default: new Date().getDay(),
      optional: true,
      convert: true,
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
    //Get data user attendances
    const day = req.query.day;
    const month = req.query.month;
    const year = req.query.year;

    const userAttendances = await StaffAttendance.findAll({
      attributes: [
        "id",
        "employeeId",
        "checkInTime",
        [Sequelize.literal(`CONVERT_TZ(checkInTime, @@session.time_zone, '+07:00')`), "checkInTimeUTC"],
        "checkInLocation",
        "checkOutTime",
        [Sequelize.literal(`CONVERT_TZ(checkOutTime, @@session.time_zone, '+07:00')`), "checkOutTimeUTC"],
        "checkOutLocation",
        "workingHour",
        "workingHourView",
        "status",
      ],
      include: {
        model: User,
        attributes: ["name", "email", "role"],
      },
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.literal(`day(checkInTime)`), day),
          Sequelize.where(Sequelize.literal(`month(checkInTime)`), month),
          Sequelize.where(Sequelize.literal(`year(checkInTime)`), year),
        ],
      },
    });

    res.status(200);
    return res.json({
      status: "success",
      data: userAttendances,
    });

  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      status: "error",
      message: "gagal mengambil data all user atendances",
    });
  }
};
