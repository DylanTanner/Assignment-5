/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Rosco Taner____________ Student ID: 126154236___ Date:3/25/2024 _______________
*  Online (Cycliic) Link: https://courageous-houndstooth-seal.cyclic.app/
Now the cyclic is not working after I tried to create a new app. Below is the error I get:

We've reached our maximum beta capacity (for now)
Meanwhile, we've added you to the wait list and saved your spot in line!

Give us some feedback or check up on what we're up to:

Reach out to us on discord 
Email us at hello@cyclic.sh 
********************************************************************************/ 

// Required modules
const express = require("express");
const app = express();
const path = require("path");
const collegeData = require("./modules/collegeData.js");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');

// Define paths
const publicPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "views");

// Serve static files
app.use(express.static(publicPath));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Express Handlebars as the view engine
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    layoutsDir: path.join(viewsPath, 'layouts'),
    partialsDir: path.join(viewsPath, 'partials')
}));
app.set('view engine', '.hbs');

// Initialize college data
collegeData.initialize()
    .then(() => {
        // Routes handling
        // GET /students
        app.get("/students", (req, res) => {
            let course = req.query.course;
            if (course) {
                collegeData.getStudentsByCourse(course)
                    .then(students => {
                        res.render('students', { students: students });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).render('error', { message: "Internal Server Error" });
                    });
            } else {
                collegeData.getAllStudents()
                    .then(students => {
                        res.render('students', { students: students });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).render('error', { message: "Internal Server Error" });
                    });
            }
        });

        // GET /tas
        app.get("/tas", (req, res) => {
            collegeData.getTAs()
                .then(tas => {
                    res.render('tas', { tas: tas });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render('error', { message: "Internal Server Error" });
                });
        });

        // GET /courses
        app.get("/courses", (req, res) => {
            collegeData.getCourses()
                .then(courses => {
                    res.render('courses', { courses: courses });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render('error', { message: "Internal Server Error" });
                });
        });

        // GET /student/num
        app.get("/student/:num", (req, res) => {
            let num = req.params.num;
            collegeData.getStudentByNum(num)
                .then(student => {
                    res.render('student', { student: student });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render('error', { message: "Internal Server Error" });
                });
        });

        // GET /htmlDemo
        app.get("/htmlDemo", (req, res) => {
            res.render('htmlDemo');
        });

        // GET /about
        app.get("/about", (req, res) => {
            res.render('about');
        });

        // GET /
        app.get("/", (req, res) => {
            res.render('home');
        });

        // GET /addStudent
        app.get("/addStudent", (req, res) => {
            res.render('addStudent');
        });

        // POST /addStudent
        app.post("/addStudent", (req, res) => {
            collegeData.addStudent(req.body)
                .then(() => {
                    res.redirect("/students");
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render('error', { message: "Internal Server Error" });
                });
        });

        // Handling unmatched routes
        app.use((req, res) => {
            res.status(404).render('error', { message: "Page Not Found" });
        });

        // Start the server
        const HTTP_PORT = process.env.PORT || 8080;
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch(err => {
        console.error(err);
        console.error("Failed to initialize college data. Server not started.");
    });