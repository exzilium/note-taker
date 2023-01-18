const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
const { isArray } = require("util");
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// Read and Append functions for POST route
// write file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
// read and append file
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route
notes.get("/", (req, res) =>
  readFromFile("db/db.json", "utf8")
    .then((data) => {
      res.json(JSON.parse(data));
    })
    .catch((e) => console.error(e))
);

// POST Route
notes.post("/", (req, res) => {
  // deconstruct assignment for items in req.body
  const { title, text } = req.body;
  if (title && text) {
    // Var for object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    readAndAppend(newNote, "db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };
    res.json(response);
  } else {
    res.json("Error in posting new note");
  }
});

// DELETE Route - Req id, read all notes from JSON, remove for that id, rewrite notes to JSON
/* Options: Keep as an array, use filter method to get the id (everyuthing but this id) then writefile the filtered content*/
// for the delete route
notes.delete(
  "/:id",
  (req, res) => {
    // DELETE ID TO FILTER
    deleteID = req.params.id;
    console.log(`deleteID = ${deleteID}`);

    // GET JSON FROM DB
    readFromFile("db/db.json", "utf8")
      // THEN USING DELETEID AND DB
      .then((dbArr) => {
        // parse JSON from db to create array
        dbArr = JSON.parse(dbArr);
        console.log(dbArr);
        // Filter dbArr by deleteID
        newArray = dbArr.filter((db) => db.id !== deleteID);
        console.log(newArray);
        // Write to File
        writeToFile("db/db.json", newArray);
        // Read and respond new data back to frontend to remove deleted note from list
        readFromFile("db/db.json", "utf8")
          .then((data) => {
            res.json(JSON.parse(data));
          })
          .catch((e) => console.error(e));
      });
  }
  // get all the values from the db
);
// write the filtered array to the db as json

// Export routes
module.exports = notes;
