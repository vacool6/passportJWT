const jwt = require("jsonwebtoken");
const User = require("./user");

module.exports.wrapper = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};

module.exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, "12345@abc");
      const user = await User.findById(decode.id);

      if (!user) {
        return res.send({ message: "Unauthorized access" });
      }
      req.user = user;
      next();
    } catch (e) {
      //Error here can be token error / token expiration error.
      return res.send({ message: "Something went wrong!" });
    }
  }
};
