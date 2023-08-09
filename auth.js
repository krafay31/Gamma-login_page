const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // for password hashing
const User = require('./user'); // Import the User model

// ...

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/login?error=user_not_found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/login?error=invalid_password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('/login?error=login_error');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: email,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/register');
    }
});

// ...
module.exports = router;
