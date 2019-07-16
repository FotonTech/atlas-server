const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    console.log("No Authorization header");
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Invalid Authorization header");
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey");
  } catch (err) {
    console.log("Wrong Authorization header");
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    console.log("Wrong2 Authorization header");
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userID = decodedToken.userID;
  next();
};
