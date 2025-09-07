const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const JWT = require('jsonwebtoken');
const UID = require('uid2');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());


const FILE_PATH = "./data/messages.json";
const DIR_PATH = path.dirname(FILE_PATH);

if(!fs,existSync(DIR_PATH)) {
    fs.mkdirSync(DIR_PATH, { recursive: true });

}

if(!fs.existSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]');

}

const ReadMessages = () => {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
}

const WriteMessages = (messages) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(messages));
}


app.get('/', (req, res) => {
    res.json(
        "Hello World!"
    )
})



app.post('/messages', (req, res) => {
    const { name, email, message, receipient } = req.body;
    if(!name || !email || !message || !receipient) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const messages = ReadMessages();
    const newMessage = { id: UID(32), name, email, message, receipient };
    messages.push(newMessage);
    WriteMessages(messages);
    res.status(201).json({ message: 'Message sent successfully.' });


})

app.post('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, message} = req.body;


    const messages = ReadMessages();
    const newMessage = { id: UID(32), name, email, message, receipient : id };
    messages.push(newMessage);
    WriteMessages(messages);
    res.status(201).json({message : "Message sent successfully."})
} )


app.get('/messages', (req, res) => {
    const messages = ReadMessages();
    res.json(messages);




})


app.get('/messages/:id', (req, res) => {
    const {id} = req.params;
    const messages = ReadMessages();
    const message = messages.find(m => m.id === id);
    if(!message) {
        return res.status(404).json({ message: 'Message not found.' });
    }
    res.status(201).json(message);
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})





