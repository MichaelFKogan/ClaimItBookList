/* CLAIM IT! ASSIGNMENT
 * BACKEND
 * ==================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");

var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));


// DATABASE CONFIGURATION
var databaseUrl = "BOOK-LIST";
var collections = ["books"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
    console.log("Database Error:", error);
});


// ROUTES
// ======

// WHEN SUBMIT BUTTON IS PRESSED, BOOK AND AUTHOR SUBMISSION IS SAVED TO MONGO DB
app.post("/submit", function(req, res) {
    console.log(req.body);
    // INSERT THE BOOK INTO THE BOOK COLLECTION
    db.books.insert(req.body, function(error, saved) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise, send the book back to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(saved);
            res.send(saved);
        }
    });
});



// Retrieve results from mongo
app.get("/all", function(req, res) {
    // Find all books in the books collection
    db.books.find({}, function(error, found) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise, send json of the books back to user
        // This will fire off the success function of the ajax request
        else {
            res.json(found);
        }
    });
});


// Select just one book by an id
app.get("/find/:id", function(req, res) {

    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IDYOUWANTTOFIND))

    // Find just one result in the books collection
    db.books.findOne({
        // Using the id in the url
        "_id": mongojs.ObjectId(req.params.id)
    }, function(error, found) {
        // log any errors
        if (error) {
            console.log(error);
            res.send(error);
        }
        // Otherwise, send the note to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(found);
            res.send(found);
        }
    });
});




// UPDATE just one note by an id
app.post("/update/:id", function(req, res) {

    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IDYOUWANTTOFIND))

    // Update the note that matches the object id
    db.books.update({
        "_id": mongojs.ObjectId(req.params.id)
    }, {
        // Set the title, note and modified parameters
        // sent in the req's body.
        $set: {
            "title": req.body.title,
            "note": req.body.note,
            "modified": Date.now()
        }
    }, function(error, edited) {
        // Log any errors from mongojs
        if (error) {
            console.log(error);
            res.send(error);
        }
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(edited);
            res.send(edited);
        }
    });
});




// DELETE One from the DB
app.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    db.books.remove({
        "_id": mongojs.ObjectID(req.params.id)
    }, function(error, removed) {
        // Log any errors from mongojs
        if (error) {
            console.log(error);
            res.send(error);
        }
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(removed);
            res.send(removed);
        }
    });
});




// CLEAR THE DB (WHEN THE DELETE ALL books BUTTON IS PRESSED) 
app.get("/clearall", function(req, res) {
    // Remove every note from the books collection
    db.books.remove({}, function(error, response) {
        // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        }
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(response);
            res.send(response);
        }
    });
});




// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});