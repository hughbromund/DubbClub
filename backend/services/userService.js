const path = require("path");
const User = require(path.resolve(__dirname, "../database/models/user"));
const config = require(path.resolve(__dirname, "../config.json"));

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
  
    user.save((err, user) => {
      if (err) {
        //res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "User registered successfully!" });
    });
  
  };

exports.login = (req, res) => {
    User.findOne({
    "$or": [{username: req.body.username}, {email:req.body.username}]
    })
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
  
        res.status(200).send({
          id: user._id,
          username: user.username,
          accessToken: token
        });
      });
  };