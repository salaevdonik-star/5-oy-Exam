const express = require('express')
const cors = require('cors');
const connectDB = require("./config/db.config");
const brandRouter = require("./router/brand.routes");
const carRouter = require("./router/car.routes");
const errorMiddleware = require("./middleware/error.middleware");
const authRouter = require('./router/auth.routes');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path")
const logger = require("./utils/logger");
const YAML = require("yamljs");
const swaggerUI = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({
  extended: true
}))

 
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads/images")))

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(YAML.load(path.join(__dirname, "docs/documantation.yml"))))
 
app.use(brandRouter);
app.use(carRouter);
app.use(authRouter);    

app.use(errorMiddleware);     
 
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection: " + (reason && reason.message ? reason.message : reason));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + err.message, { stack: err.stack });
});

app.listen(PORT, () => {
  logger.info("Server is running at: " + PORT);
  console.log("Server is running at: " + PORT); 
});
