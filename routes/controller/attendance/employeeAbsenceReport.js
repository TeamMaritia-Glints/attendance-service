const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance, User } = require("../../../models"); // Call Model StaffAttendance
const Sequelize = require("sequelize");
const { where } = require("sequelize");
const {getWeekdaysInMonth} = require("./getWeekdaysInMonth")


module.exports = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.data.id;

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
  };

  const validate = v.validate(req.query, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  try {
    const month = req.query.month;
    const year = req.query.year;
    const weekdays = getWeekdaysInMonth(month, year);
    console.log(weekdays);
    //Execute query register
    const absenceReport = await StaffAttendance.findAll({
      attributes: [
        "employeeId",
        [Sequelize.literal(`${weekdays} - COUNT(employeeId)`), "absence count"],
      ],
      include: {
        model: User,
        attributes: ["name", "role"],
      },
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.literal(`month(checkInTime)`), month),
          Sequelize.where(Sequelize.literal(`year(checkInTime)`), year),         
        ],
      },     
      group: "employeeId",
      having: Sequelize.literal(`COUNT(employeeId) < ${weekdays}-3`)
    });

    return res.json({
      status: "success",
      data: {
        absenceReport,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      status: "error",
      message: "gagal melakukan get absence report",
    });
  }
};
