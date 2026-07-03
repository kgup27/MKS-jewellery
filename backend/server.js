const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
// This line allows your server to read JSON sent from your frontend signup/login forms
app.use(express.json()); 

const JWT_SECRET = "super_secret_jewelry_key_123"; // In production, keep this hidden!
const usersDb = []; // Temporary array acting as a user database

// 1. SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Securely scramble the password so hackers can't read it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = { email, password: hashedPassword };
        usersDb.push(newUser);

        res.status(201).json({ message: "User registered successfully for the Jewelry store!" });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});

// 2. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = usersDb.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare the typed password with the scrambled password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create the JWT Token (VIP Pass) valid for 1 hour
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token back to the frontend
        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));