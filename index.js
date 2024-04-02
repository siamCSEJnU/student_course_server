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
  database: "student_class_db",
});

//get api
app.get("/students", (req, res) => {
  const query = `
    SELECT 
        s.Student_Id,
        s.Name AS StudentName,
        c.Name AS ClassName,
        s.DOB,
        s.Gender
        
    FROM 
        student s
    INNER JOIN 
        class c ON s.Class_Id = c.Class_Id
    `;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/students/:Student_Id", (req, res) => {
  const { Student_Id } = req.params;
  const query = `
    SELECT 
        s.Student_Id,
        s.Name,
        s.Class_Id,
        s.DOB,
        s.Gender,
        s.CreatedDate,
        s.ModificationDate
    FROM 
        student s
    WHERE 
        s.Student_Id = ?
    `;
  db.query(query, [Student_Id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

//update api
app.put("/edit/:Student_Id", (req, res) => {
  const { Student_Id } = req.params;
  const { name, classId, dob, gender } = req.body;

  const modifiedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const genderValue = gender === "male" ? 1 : 2;

  const sql =
    "UPDATE Student SET Name = ?, Class_Id = ?, DOB = ?, Gender = ?,ModificationDate=? WHERE Student_Id = ?";
  db.query(
    sql,
    [name, classId, dob, genderValue, modifiedDate, Student_Id],
    (err, result) => {
      if (err) return res.json(err);
      return res.json("updated");
    }
  );
});

//post api
app.post("/create", (req, res) => {
  const { name, classId, dob, gender } = req.body;
  // console.log(name, classId, dob, gender);
  const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const genderValue = gender === "male" ? 1 : 2;
  const sql =
    "INSERT INTO Student (Name, Gender, DOB, Class_Id, CreatedDate) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, genderValue, dob, classId, createdDate],
    (err, result) => {
      if (err) return res.json(err);
      return res.json("created");
    }
  );
});

//delete api
app.delete("/students/:Student_Id", (req, res) => {
  const { Student_Id } = req.params;

  const sql = "DELETE FROM Student WHERE Student_Id = ?";
  db.query(sql, [Student_Id], (err, result) => {
    if (err) return res.json(err);
    return res.json("deleted");
  });
});

app.get("/", (req, res) => {
  res.send("student server is running");
});
app.listen(port, () => {
  console.log(`Student server is running on port ${port}`);
});
