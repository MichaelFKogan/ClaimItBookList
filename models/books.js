// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the books schema
var BooksSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  author: {
    type: String
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the books
// These ids are referred to in the Article model

// Create the books model with the booksSchema
var Books = mongoose.model("Books", BooksSchema);

// Export the books model
module.exports = Books;
