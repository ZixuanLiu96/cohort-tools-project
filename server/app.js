const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const Cohorts = require("./models/cohortsModel");
const Students = require("./models/studentsModel");
const { log } = require("console");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((res) => {
    console.log(
      `Connected to Mongo! Database name: "${res.connections[0].name}"`
    );
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts = JSON.parse(fs.readFileSync(`${__dirname}/cohorts.json`));
// const students = JSON.parse(fs.readFileSync(`${__dirname}/students.json`));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "127.0.0.1:5005/api/students",
      "127.0.0.1:5005/api/cohorts",
      "127.0.0.1:5005/docs",
    ],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// cohorts CRUD
app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohorts.find();
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohorts.findById(req.params.cohortId);
    res.status(200).json(cohort);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

app.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = await Cohorts.create(req.body);
    res.status(201).json(newCohort);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
});

app.patch("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohorts.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(cohort);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent! ",
    });
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohorts.findByIdAndDelete(req.params.cohortId);
    res.status(200).json(null);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent! ",
    });
  }
});

// students CRUD
app.get("/api/students", async (req, res) => {
  try {
    const students = await Students.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Students.findById(req.params.studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Students.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
});

app.patch("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Students.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent! ",
    });
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  try {
    await Students.findByIdAndDelete(req.params.studentId);
    res.status(200).json(null);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent! ",
    });
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const cohortId = req.params.cohortId;
    console.log(cohortId);

    const studentCohort = await Students.find({ cohort: cohortId }).populate(
      "cohort"
    );
    res.status(200).json(studentCohort);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
