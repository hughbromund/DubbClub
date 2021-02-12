const express = require('express')
const app = express()
const path = require("path")
var cors = require("cors")
const request = require("request")
const port = process.env.PORT || 5000

app.use(express.json());

app.use(require("./routers/router"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})