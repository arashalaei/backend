/* jslint esversion:6 */

const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
process.on("uncaughtException", (ex) => {
  console.log("UNCAUGHT EXEPTION! Shtting down...");
  console.log(ex.name, ex.message);
  process.exit(1);
});

const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection succesddful"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("HUNHANDLER REJECTION! Shtting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
