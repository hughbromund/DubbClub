const jwt = require("jsonwebtoken");
const path = require("path");
const config = require(path.resolve(__dirname, "../config.json"));


verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

verifyTokenOptional = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return next();
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return next();
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
  verifyTokenOptional
};


module.exports = authJwt;
