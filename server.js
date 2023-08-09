const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 5000;



const mongoURL = 'mongodb+srv://GammaCities:RafayRehman1@gammacities.7guo0w9.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URL
const dbName = 'GammaCities';

app.use(express.json());


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Use cors middleware
app.use(cors());

// Middleware to parse JSON data

app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose connection
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

 

// User model
const User = require('./user');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const flash = require('connect-flash');
app.use(flash());


const authRoutes = require('./auth'); // Update the path based on your project structure
app.use('/', authRoutes);

app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error');
    next();
});




// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/login');
    }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match, consider user logged in
            // You can set a session or JWT here if needed
            res.redirect('/dashboard'); // Replace with your desired redirect route
        } else {
            // Passwords do not match, redirect back to login page with error message
            res.redirect('/login?error=invalid_password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('/login?error=login_error');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: email,
            password: hashedPassword
        });

        await user.save();
        console.log('User registered successfully:', user);
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/register');
    }
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
