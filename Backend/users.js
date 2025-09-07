const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const JWT = require('jsonwebtoken');
const UID = require('uid2');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = '1d6642e8d862f641bd8a048722a7e5d27d8f02b4d306cd2f6656c8d06f1b1c0ee54d29da570497ecf032e53236d60a037e9a5f08090fc70894cbf99da8ca1573';





app.use(bodyParser.json());
app.use(cors());

const FILE_PATH = "./data/users.json"
const DIR_PATH = path.dirname(FILE_PATH);

// Check if the directory exists, if not, create it
if (!fs.existsSync(DIR_PATH)) {
  fs.mkdirSync(DIR_PATH, { recursive: true });
}

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, '[]');
}


const readUsers = () => {
    const data = fs.readFileSync(FILE_PATH)
    return JSON.parse(data)
}

const writeUsers = (users) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users))
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/Register', (req, res) => {
    const { username, email,  password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    const users = readUsers();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }
    const newUser = { id: UID(32), username, email, password };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json({ message: 'User registered successfully.' });
})

app.post('/Login',  (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = JWT.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
    res.status(200).json({ message: 'Login successful.' });
})

app.get('/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const users = readUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }   
    res.json(user);
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);


})

