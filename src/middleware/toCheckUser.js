const heshPassword = require("sha256");
const { ClientError } = require("../utils/error");
const toCheck = (req, res, next) => {
  req.replaceEmailToGmail = function (mail) {
    const toCheckEmail = mail.includes("@email");
    const toCheckGmail = mail.includes("@gmail");
    return toCheckEmail
      ? mail.replace("@email", "@gmail")
      : toCheckGmail
      ? mail.replace("@gmail", "@email")
      : false;
  };
  req.toCheckUser = function (type) {
    const users = req.getData("users");
    if (
      type == "register" &&
      !users.some(
        (user) =>
          user.email == req.body.email ||
          user.email == req.replaceEmailToGmail(req.body.email)
      )
    ) {
      req.body = {
        ...req.body,
        userId: users.length ? users[users.length - 1].userId + 1 : 1,
        password: heshPassword(req.body.password),
      };
      return true;
    }
    const userCondition = (user) => user.email == req.body.email || user.email == req.replaceEmailToGmail(req.body.email)
    if ( type == "login" && users.some(userCondition) && users.find(userCondition).password == heshPassword(req.body.password)) {
      req.body = users.find(userCondition);
      return true;
    } else

      throw new ClientError(type == "register" ? 400: 404 ,
        type == "register"
          ? "Cannot user has ben created !"
          : "User not found !"
      );
  };
  return next();
};

module.exports = { toCheck };
