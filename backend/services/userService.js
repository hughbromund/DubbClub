const path = require("path");
const User = require(path.resolve(__dirname, "../database/models/user"));
const config = require(path.resolve(__dirname, "../config.json"));

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var crypto = require("crypto")
var nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: config.email_service,
  auth: {
    user: config.email_user,
    pass: config.email_pass
  }
})


const expireSeconds = 86400;

exports.signup = (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
  
    user.save((err, user) => {
      if (err) {
        //console.log(err)
        return res.status(500).send({ err: err, message: "Database failure." });
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
          return res.status(500).send({ err: err, message: "Database failure." });
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
          expiresIn: expireSeconds // 24 hours
        });
  
        res.status(200).send({
          id: user._id,
          username: user.username,
          accessToken: token,
          expiresIn: expireSeconds
        });
      });
  };

  exports.refresh = (req, res) => {
    var token = jwt.sign({ id: req.userId }, config.secret, {
      expiresIn: expireSeconds // 24 hours
    });

    res.status(200).send({
      id: req.userId,
      accessToken: token,
      expiresIn: expireSeconds
    });
  }

  exports.userInfo = (req, res) => {
    User.findOne({_id: req.userId})
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var retObj = {
        username: user.username,
        email: user.email,
        message: "Success!",
      }

      if (user.phoneNumber) {
        retObj.phoneNumber = user.phoneNumber
      }
      else {
        retObj.phoneNumber = "none";
      }

      if (user.notifications) {
        retObj.notifications = user.notifications
      }
      else {
        retObj.notifications.SMS = false;
        retObj.notifications.email = false;
      }

      if (user.hideSpoilers) {
        retObj.hideSpoilers = user.hideSpoilers;
      }
      else {
        retObj.hideSpoilers = false;
      }


      res.status(200).send(retObj)
    })
  }

  exports.changePassword = (req, res) => {
    User.updateOne({_id: req.userId}, {password: bcrypt.hashSync(req.body.password, 8)})
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully Updated Password."})
    })
  }

  exports.changeEmail = (req, res) => {
    User.updateOne({_id: req.userId}, {email: req.body.email})
    .exec((err, user) => {
      if (err && err.name == "MongoError" && err.code === 11000) {
        return res.status(422).send({ err: err, message: "Email already exists."});
      }

      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully Updated Email."})
    })
  }

  exports.resetPasswordEmail = (req, res) => {
    var username = req.body.username

    var newHash = crypto.randomBytes(20).toString('hex')
    var expireDate = new Date()
    expireDate.setHours(expireDate.getHours() + 1)

    User.findOneAndUpdate({"$or": [{username: username}, {email: username}]}, {"resetPassword.hash": newHash, "resetPassword.expireDate": expireDate})
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(200).send({ message: "If the user exists, the email was sent" });
      }

      const mailOptions = {
        from: config.email_user,
        to: user.email,
        subject: "Password Reset",
        text: "Please go to: https://dubb.club/resetPassword/" + newHash + " to reset your password. This link will expire in 1 hour."
      } 

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({ err: error, message: "Email failure." });
        }

        return res.status(200).send({ message: "If the user exists, the email was sent" })
      })
    })
  }

  exports.resetPassword = (req, res) => {
    var hash = req.body.hash
    var newPassword = req.body.password
    var expireDate = new Date()
    var sent = false

    User.findOne({"resetPassword.hash": hash})
    .exec((err, user) => {
      if (err) {
        sent = true;
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        sent = true;
        return res.status(404).send({ message: "User Not found." });
      }

      if(user.resetPassword.expireDate < expireDate) {
        sent = true;
        return res.status(401).send({ message: "Reset link expired!" })
      }

      User.updateOne({"resetPassword.hash": hash}, {password: bcrypt.hashSync(newPassword, 8), "resetPassword.expireDate": expireDate.toISOString()})
      .exec((err, user) => {
        if (err) {
          return res.status(500).send({ err: err, message: "Database failure." });
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        return res.status(200).send({message: "Successfully Updated Password."})
      })
    })

    
  }

  exports.favoriteTeam = (req, res) => {
    //teamId
    //league
    var listName = "favoriteTeams." + req.body.league 

    User.updateOne({_id: req.userId}, {"$addToSet": {[listName]: req.body.teamId}})
    .exec((err, user) => {

      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully favorited teams."})
    })
  }

  exports.unfavoriteTeam = (req, res) => {
    var listName = "favoriteTeams." + req.body.league 
    
    User.updateOne({_id: req.userId}, {"$pull": {[listName]: req.body.teamId}})
    .exec((err, user) => {

      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully unfavorited teams."})
    })
  }

  exports.favoriteTeamList = (req, res) => {

    User.findOne({_id: req.userId})
    .exec((err, user) => {

      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({favoriteTeams: user.favoriteTeams, message: "Successfully returned teams."})
    })
  }

  exports.changePhoneNumber = (req, res) => {
    var re = new RegExp("[0-9]{10}")
    phoneNumberVal = req.body.phoneNumber
    if (!re.test(phoneNumberVal)) {
      return res.status(400).send({message: "Invalid phone number format"})
    }
    phoneNumberVal = "+1" + phoneNumberVal

    User.updateOne({_id: req.userId}, {phoneNumber: phoneNumberVal})
    .exec((err, user) => {
      if (err && err.name == "MongoError" && err.code === 11000) {
        return res.status(422).send({ err: err, message: "Phone number already exists."});
      }

      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully updated phone number."})
    })
  }

  exports.changeNotifications = (req, res) => {

    smsVal = req.body.sms;
    emailVal = req.body.email;

    User.updateOne({_id: req.userId}, {"notifications.SMS": smsVal, "notifications.email": emailVal})
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully updated notification preferences."})
    })
  }

  exports.updateSpoilers = (req, res) => {
    spoilersVal = req.body.hideSpoilers

    User.updateOne({_id: req.userId}, {"hideSpoilers": spoilersVal})
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ err: err, message: "Database failure." });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({message: "Successfully updated hiding spoilers."})
    })
  }

