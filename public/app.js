/* CLAIM IT ASSIGNMENT!
 * FRONT-END
 * ==================== */


// LOADS ANY RESULTS FROM MONGO DB ONTO THE PAGE
function getResults() {
    // FIRST, EMPTY ANY RESULTS THAT ARE CURRENTLY ON THE PAGE
    $("#results").empty();

    // NEXT, GRAB THE CURRENT BOOKS THAT ARE IN THE LIST
    $.getJSON("/all", function(data) {
        // FOR EACH BOOK...
        for (var i = 0; i < data.length; i++) {
            // ...populate #results with a p-tag that includes the book's title and object id
            $("#results").prepend("<p class='dataentry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
                data[i]._id + ">" + data[i].title + "<button class=deleter>delete</button></span></p>");
        }
    });
}

// Runs the getResults function (top of this page), as soon as the script is executed
getResults();






// When the #submit button is clicked
$(document).on("click", "#submit", function() {
    // AJAX POST call to the submit route on the server
    // This will take the data from the form and send it to the server
    $.ajax({
            type: "POST",
            dataType: "json",
            url: "/submit",
            data: {
                title: $("#title").val(),
                author: $("#author").val(),
                created: Date.now()
            }
        })
        // If that API call succeeds, add the title and a delete button for the author to the page
        .done(function(data) {
            // Add the title and delete button to the #results section
            $("#results").prepend("<p class='dataentry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
                data._id + ">" + data.title + "<button class=deleter>delete</button></span></p>");
            // Clear the author and title inputs on the page
            $("#author").val("");
            $("#title").val("");
        });
});





// When the #clearall button is pressed
$("#clearall").on("click", function() {
    // Make an AJAX GET request to delete the authors from the db
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clearall",
        // On a successful call, clear the #results section
        success: function(response) {
            $("#results").empty();
        }
    });
});





// When user clicks the deleter button for a author
$(document).on("click", ".deleter", function() {
    // Save the p tag that encloses the button
    var selected = $(this).parent();
    // Make an AJAX GET request to delete the specific author
    // this uses the data-id of the p-tag, which is linked to the specific author
    $.ajax({
        type: "GET",
        url: "/delete/" + selected.data("id"),

        // On successful call
        success: function(response) {
            // Remove the p-tag from the DOM
            selected.remove();
            // Clear the author and title inputs
            $("#author").val("");
            $("#title").val("");
            // Make sure the #actionbutton is submit (in case it's update)
            $("#actionbutton").html("<button class='btn btn-default' id='submit'>Submit</button>");
        }
    });
});




// When user click's on BOOK title, show the BOOK, and allow for updates
$(document).on("click", ".dataTitle", function() {
    // Grab the element
    var selected = $(this);
    // Make an ajax call to find the author
    // This uses the data-id of the p-tag, which is linked to the specific author
    $.ajax({
        type: "GET",
        url: "/find/" + selected.data("id"),
        success: function(data) {
            // Fill the inputs with the data that the ajax call collected
            $("#author").val(data.author);
            $("#title").val(data.title);
            // Make the #actionbutton an update button, so user can
            // Update the author s/he chooses
            $("#actionbutton").html("<button class='btn btn-default' id='updater' data-id='" + data._id + "'><b>Update</b></button>");
        }
    });
});





// When user click's update button, update the specific author
$(document).on("click", "#updater", function() {
    // Save the selected element
    var selected = $(this);
    // Make an AJAX POST request
    // This uses the data-id of the update button,
    // which is linked to the specific author title
    // that the user clicked before
    $.ajax({
        type: "POST",
        url: "/update/" + selected.data("id"),
        dataType: "json",
        data: {
            title: $("#title").val(),
            author: $("#author").val()
        },
        // On successful call
        success: function(data) {
            // Clear the inputs
            $("#author").val("");
            $("#title").val("");
            // Revert action button to submit
            $("#actionbutton").html("<button class='btn btn-default' id='submit'>Submit</button>");
            // Grab the results from the db again, to populate the DOM
            getResults();
        }
    });
});