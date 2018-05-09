const express = require('express');  // Create express constant and require express
const mysql = require('mysql');         // create mysql constant and require mysql
const app = express();
app.use(express.static(__dirname + '/public'));             // Display files in public
app.set('view engine', 'ejs');                              //Set view engine to ejs
var session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Create mysql connection and assign to db var
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Website123',
    database: 'iReactSingle'
});


// Connect to the database
db.connect(function (error) {
    if (!!error) {
        console.log('connection error');                 // Error connecting to the database
    } else {
        console.log('Connected');                       // Succesfully connected to the database
    }
});


app.get('/', function (req, res) {
    res.render('index');

});
app.post('/', function (req, res) {
    res.render('index');

});


// Api to add questions to database

app.post('/api/addQuestions', function (req, res) {

    var oldQuestion = false;
    var questionFromAdd = req.body.questionFromAdd;                 // Get the user input from the form
    var value = {question: questionFromAdd};                        //Add it to an object

    let sql = 'SELECT * FROM questions';                    // Get all the questions from the database
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log("results.question is " + results.question);
        for (xsd in results)                     //For each result from the database
        {
            console.log("RESULT.question is : " + results[xsd].question);
            console.log("Compared value  is : " + questionFromAdd);
            if (results[xsd].question == questionFromAdd)                //Check if the input question is the same as any question in the database
            {
                oldQuestion = true;                                    // if so ... set oldQuestion true
                res.send(oldQuestion);
                console.log("oldQuestion value" + oldQuestion);
            }
        }

        if (oldQuestion == false) {                      // If oldQuestion is not true
            db.query('INSERT INTO questions SET ?', value, function (err, result, fields) {             // Add it to the database
                if (err) {
                    res.send(err);
                }
                oldQuestion = false;                // reset oldQuestion value

                res.send(oldQuestion);              // send from the server


            });
        }
        else                                                        // Otherwise display error message
        {
            console.log("Question already exists");

        }


    });
    console.log("oldQuestion value" + oldQuestion);


});


// Add a response to the database api
app.post('/api/addResponse', function (req, res) {

    var answerFromAdd = req.body.answerFromAdd;             // User input
    var currentQu = req.body.currentQu;                 // Current question
    console.log("answer " + answerFromAdd);
    console.log("currentqu " + currentQu);


    if (answerFromAdd !== undefined) {                     // if there is an user input

        db.query("UPDATE questions SET answer = '" + answerFromAdd + "' WHERE question = '" + currentQu + "'", function (err, result, fields) {
            if (err) {
                res.send(err);
            }

            res.send(result);                                       // Add to the database


        });

    }
    else {
        console.log(" something is undefined");                 // Display error message
    }


});


// Add a question to the database api
app.post('/api/getQList', function (req, res) {
    let sql = 'SELECT * FROM questions';    // Get all the questions
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results.question);              // send them
        res.send(results);

    });
});


// Find answer for specific question
app.post('/api/getAnswer', function (req, res) {
    console.log("The request body is " + req.body.browseSearchInput);
    var inputSearchbar = req.body.browseSearchInput;                        //Search input
    var answersObj = [];                                        // answer Array
    let sql = "SELECT * FROM questions WHERE question LIKE '%" + inputSearchbar + "%'"         //Get all question containing search input word

    let query = db.query(sql, (err, results) => {
        if (err) throw err;


        results.forEach(function (eachQuestion) {                     // For each question

            answersObj.push(eachQuestion.question);                 //add to array
            answersObj.push(eachQuestion.answer);


        });

        res.send(answersObj);
    });


});


app.listen(1337);               //Add webpage to port 1337