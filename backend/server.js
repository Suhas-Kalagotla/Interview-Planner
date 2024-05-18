const express = require("express");
var cors = require('cors')
const app = express();
var path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/logger").getLoggerByName("START");
require("dotenv").config();
var db_connect = require("./db/connect");
const configValue = require("./config");
const auth_router = require("./routes/auth");
const plagiarism_router = require("./routes/plag");

logger.info("SETTING LOG LEVEL TO " + configValue.log_level);

// Connecting to the database
db_connect.connect(true);

// Middleware setup

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())



// Serving static files (frontend) from the specified directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Routing setup
app.use("/api/auth", auth_router);
app.use("/api/plagiarism", plagiarism_router);



// Catch-all route to serve the frontend application's HTML file
app.get("/*", async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
app.listen(configValue.port, function (err) {
  if (err) logger.error("Error in server setup");
  logger.info("Server listening on Port", configValue.port);
});

module.exports = app;
