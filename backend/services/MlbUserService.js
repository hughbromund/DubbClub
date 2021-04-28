const path = require("path");
const axios = require("axios");
const User = require("../database/models/user");
const config = require(path.resolve(__dirname, "../config.json"));
const MLBgame = require(path.resolve(__dirname, "../database/models/MLBgame"));
const nodemailer = require("nodemailer");

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);

const phoneNumber = config.TWILIO_PHONE_NUMBER;

const transporter = nodemailer.createTransport({
  service: config.email_service,
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

exports.userVote = (req, res) => {
  var gameId = req.body.gameId;
  var homeAwayOpposite = "away";
  if (req.body.homeAway == "away") {
    var homeAwayOpposite = "home";
  }
  var votersVar = req.body.homeAway + "Voters";
  var votersOpp = homeAwayOpposite + "Voters";

  MLBgame.updateOne(
    { id: gameId },
    {
      $addToSet: { [votersVar]: req.userId },
      $pull: { [votersOpp]: req.userId },
    }
  ).exec((err, game) => {
    if (err) {
      return res.status(500).send({ err: err, message: "Database failure." });
    }

    if (!game) {
      return res.status(404).send({ message: "Game Not found." });
    }

    res.status(200).send({ message: "Successfully Voted." });
  });
};

exports.notifications = (game) => {
  game = game.toObject();

  let title =
    game.home.teamName + " vs. " + game.away.teamName + " is starting!";
  let body =
    game.home.teamName +
    " vs. " +
    game.away.teamName +
    " is starting! Go to https://dubb.club/game/MLB/" +
    game.id +
    " to the see the latest predictions and information.";

  let winner = game.home.teamName;

  if (game.predictedWinner === game.away.teamId) {
    winner = game.away.teamName;
  }

  let confidence = (game.confidence * 100).toFixed(2);

  let homeInfo =
    "To see more about the " +
    game.home.teamName +
    ", go to https://dubb.club/search/" +
    encodeURI(game.home.teamName)

  let awayInfo =
    "To see more about the " +
    game.away.teamName +
    ", go to https://dubb.club/search/" +
    encodeURI(game.home.teamName)

  let emailBody =
    '<div style="background-color: #181818; padding: 15px; margin: 15px; border-radius: 5px;"><div style="text-align: left;"><img  width="300px" src="https://storage.googleapis.com/dubb-club-logo-bucket/LogoWordmarkWhite.png"/></div><div style="background-color: #202020; padding: 15px; margin: 15px; border-radius: 5px;"><h1 style="color: #ffffff;">Dubb Club Live Game Alert!</h1><h3 style="color: #ffffff;">' +
    body +
    '</h3><h3 style="color: #ffffff;">The ' +
    winner +
    " are projected to win with a confidence of " +
    confidence +
    '%</h3><h3 style="color: #ffffff;">' +
    homeInfo +
    '</h3><h3 style="color: #ffffff;">' +
    awayInfo +
    "</h3></div></div>";

  User.find({
    "favoriteTeams.mlb": { $in: [game.home.teamId, game.away.teamId] },
  }).exec((err, user) => {
    if (err) {
      console.log(err);
    }

    for (var i = 0; i < user.length; i++) {
      if (user[i].notifications.email && user[i].verify.email) {
        const mailOptions = {
          from: config.email_user,
          to: user[i].email,
          subject: title,
          text: body,
          html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            //return res.status(500).send({ err: error, message: "Email failure." });
            console.log(err);
            console.log(info);
          }
        });
      }

      if (
        user[i].notifications.SMS &&
        user[i].phoneNumber &&
        user[i].phoneNumber.length == 12
      ) {
        twilio.messages
          .create({
            body: body,
            from: phoneNumber,
            to: user[i].phoneNumber,
          })
          .catch((e) => {
            console.error("Got an error:", e.code, e.message);
          });
      }
    }
  });
};

exports.notificationsTest = async (req, res) => {
  mlbgame.findOne({ id: req.body.id }).exec((err, game) => {
    this.notifications(game);
    return res.status(200).send({ message: "Success!" });
  });
};
