const Validator = require("fastest-validator"); //Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) => {
  //Validate Data
  const schema = {
    employeeId: { type: "number", empty: false },
    timestamp: { type: "date", default: Date.now() , optional: true},
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
    },
  };

  const validate = v.validate(req.body, schema);

  if(validate.length){
    return res.status(400).json({
        status: 'error',
        message: validate
    });
}

  return res.json(req.body);
};
