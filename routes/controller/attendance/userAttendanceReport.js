const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance, User } = require("../../../models"); // Call Model StaffAttendance
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  const id = req.user.data.id;

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

  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }
  //Get data user attendances
  try {
    const month = req.query.month;
    const year = req.query.year;

    const userAttendances = await StaffAttendance.findAll({
      attributes: [
        "id",
        [
          Sequelize.fn("date_format", Sequelize.col("checkInTime"), "%Y-%m-%d"),
          "date",
        ],
        [
          Sequelize.fn("date_format", Sequelize.col("checkInTime"), "%H:%m:%S"),
          "checkInTime",
        ],
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("checkOutTime"),
            "%H:%m:%S"
          ),
          "checkOutTime",
        ],
        "employeeId",
        "workingHour",
        "workingHourView",
        "status",
      ],
      include: {
        model: User,
        attributes: ["name"],
      },
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.literal(`month(checkInTime)`), month),
          Sequelize.where(Sequelize.literal(`year(checkInTime)`), year),
          Sequelize.where(Sequelize.literal(`employeeId`), id),
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
      message: "gagal mengambil data report",
    });
  }
};
