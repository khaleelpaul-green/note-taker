const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, writeToFile, readFromFile } = require('./helpers/fsUtils');

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// route to landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// return the `notes.html` file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
})

// receive a new note to save on the request body, add it to the `db.json` file
app.post('/api/notes', (req, res) => {
    // console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note successfully added!')
    } else {
        res.error('Error in adding new note');
    }
});

// receive a query parameter that contains the id of a note to delete, then
// remove the note with the given `id` property, and rewrites the notes to 
// the `db.json` file
app.delete('/api/notes/:id', (req, res) => {
    const note = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {

            const newArray = json.filter((delnote) => delnote.id !== note);

            writeToFile('./db/db.json', newArray);

            res.json(`Note ${note} has been deleted`);
        });
});

// on false route, send user to homepage by returning the `index.html` file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// bind and listen the connections on the specified host and port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);