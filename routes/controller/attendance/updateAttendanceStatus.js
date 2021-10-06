const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();
const { StaffAttendance, User } = require("../../../models"); // Call Model StaffAttendance
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
  const schema = {
    id: {
      type: "number",
    },
    status: {
      type: "string",
      enum: ["Approved", "Declined"],
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
    const updatedAttendance = await StaffAttendance.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.status(200);
    return res.json({
      status: "success",
      data: updatedAttendance,
      message: "status berhasil diupdate",
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      status: "error",
      message: "gagal update status",
    });
  }
};
