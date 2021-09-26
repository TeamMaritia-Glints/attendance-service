const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance, User } = require("../../../models"); // Call Model StaffAttendance
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.data.id;

  //Get data user attendances

  const today = new Date().toISOString().slice(0, 10);

  const userAttendances = await StaffAttendance.findAll({
    attributes: [
      "employeeId",
      "checkInTime",
      "checkInLocation",
      "checkOutTime",
      "checkOutLocation",
      "User.name",
      "User.email",
      "User.role",
      "workingHour",
    ],
    include: {
      model: User,
      attributes: [],
    },
    where: Sequelize.where(
      Sequelize.fn("date", Sequelize.col("checkInTime")),
      "=",
      today
    ),
    //group:employeeId,
    raw: true,
  });

  res.status(200);
  return res.json({
    status: "success",
    data: userAttendances,
  });
};
