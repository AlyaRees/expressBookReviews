const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
   if (!doesExist(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "You have successfully registered. You may now log in."});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username) => {
    let samenameusers = users.filter((user) => {
        return user.username === username
    });
if (samenameusers.length > 0) {
    return true;
} else {
    return false;
}
}


// Get the book list available in the shop
public_users.get('/',(req, res) => {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
  return res.status(200).json(book); 
  } else {
    res.status(404).json({message: "Cannot find book by ISBN."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBook = Object.values(books).filter (book => book.author === author);
  if (authorBook.length > 0 ) {
    return res.status(200).json(authorBook);
  } else {
    res.status(404).json({message: "Cannot find book by author."});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBook = Object.values(books).filter(book => book.title === title);
  if (titleBook.length > 0) {
    return res.status(200).json(titleBook)
  } else {
    return res.status(404).json({message: "Cannot find book by title."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res){
  const isbnParam = req.params.isbn;
  const reviews = books[isbnParam]["reviews"];
  if (!reviews) {
    return res.status(404).json({message: "No reviews have been submitted yet!"});
  } else {
    return res.status(200).json(reviews);
  }
});

module.exports.general = public_users;
