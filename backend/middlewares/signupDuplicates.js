const path = require("path");
const User = require(path.resolve(__dirname, "../database/models/user"));

checkDuplicateUser = (req, res, next) => {
  // Username
  User.findOne({
    "$or": [{username: req.body.username}, {email: req.body.email}]
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! username or email is already in use!" });
      return;
    }

    next();
  });
  
};


const signupDuplicates = {
  checkDuplicateUser,
};

module.exports = signupDuplicates;
