const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "student_course_db",
});

app.get("/students", (req, res) => {
  const query = `
    SELECT s.Name AS StudentName
    c.Name AS ClassName
    s.DOB
    s.Gender

    FROM student s
    INNER JOIN class c ON s.ClassId = c.Id
    `;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/", (req, res) => {
  res.send("student server is running");
});
app.listen(port, () => {
  console.log(`Student server is running on port ${port}`);
});
