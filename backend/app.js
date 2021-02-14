const express = require('express')
const app = express()
const path = require("path");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(require(path.resolve(__dirname, "./routers/router")));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const dbConnection = require(path.resolve(__dirname, "./database"));

app.listen(port, () => {
  console.log(`Dubb Club backend listening at http://localhost:${port}`)
})