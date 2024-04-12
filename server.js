const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Array to store user-selected answers
let userSelectedAnswers = [];

// Endpoint to get questions
app.get('/api/questions', (req, res) => {
    // Read questions from JSON file
    fs.readFile(path.join(__dirname, 'questions.json'), (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const questions = JSON.parse(data);
        res.json(questions);
    });
});

// Endpoint to save user-selected answers
// Endpoint to save user-selected answers along with user details
app.post('/api/save-answers', (req, res) => {
    const { name, email, selectedAnswers } = req.body;
    const userSelection = { name, email, selectedAnswers };
    userSelectedAnswers.push(userSelection); // Store user-selected answers along with user details
    console.log('User selected answers:', userSelection); // Log user-selected answers to the console (for demonstration)
    res.sendStatus(200); // Send success response
});


// Endpoint to get user-selected answers
app.get('/api/user-selected-answers', (req, res) => {
    res.json({ userSelectedAnswers });
});

// Mock user data (ideally, this should be stored securely in a database)
const users = [
    { username: 'admin@satsangtechnologies.com', password: 'Admin' },
    // Add more users as needed
];

// Route for handling login requests
app.post('/login', (req, res) => {
const { username, password } = req.body;

    // Check if user exists in the mock database
const user = users.find(user =>user.username === username &&user.password === password);

    if (user) {
        // Authentication successful
res.redirect('/admin');
    } else {
        // Authentication failed
res.status(401).send('Invalid username or password');
    }
});

// Serve the login page
app.get('/', (req, res) => {
res.sendFile(__dirname + '/login.html');
});

// Serve the admin page (after successful login)
app.get('/admin', (req, res) => {
res.sendFile(__dirname + '/admin.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});