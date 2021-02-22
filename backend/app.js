const express = require("express");
const app = express();
const path = require("path");
var cors = require("cors");
var request = require("request");
const port = process.env.PORT || 5000;

/**
 * Check for development or production mode.
 * In development mode, we will disable CORS restrictions
 * When the website is deployed, we switch to production mode and enable CORS restrictions
 *
 * CORS restrictions enhance the security of the website
 */
if (process.env.REACT_APP_RUNTIME !== "production") {
  console.log("Running in DEVELOPMENT mode. CORS restrictions are DISABLED.");
  app.use(cors());
} else {
  console.log("Running in PRODUCTION mode. CORS restrictions are ENABLED.");
  /**
   * whitelist will store all the domains that the backend can be called from
   * For example, if the frontend is hosted at foo.com, we need to add "https://foo.com/" and "https://foo.com" to the whitelist
   * The "/" at the end is needed because some browsers will add a slash and some will not
   */
  var whitelist = [
    "https://dubb.club",
    "https://dubb.club/",
    "https://www.dubb.club",
    "https://www.dubb.club/",
  ];
  app.use(
    cors({
      origin: function (origin, callback) {
        /**
         * If we can find a match in the whitelist, we return true
         */
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          /**
           * Otherwise we throw a new Error
           * This will crash the backend, but when deployed it will automatically restart
           * Crashing the backend is the easiest way to get crash information
           */
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
}

app.use(express.json());
app.use(require(path.resolve(__dirname, "./routers/router")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const dbConnection = require(path.resolve(__dirname, "./database"));

app.listen(port, () => {
  console.log(`Dubb Club backend listening at http://localhost:${port}`);
});
// Small Change to Backend
