const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// const JWT = require('jsonwebtoken');
const UID = require('uid2');
const { FILE } = require('dns');

app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());


const FILE_PATH = "./data/users.json"
const DIR_PATH = path.dirname(FILE_PATH);

// Check if the directory exists, if not, create it
if (!fs.existsSync(DIR_PATH)) {
  fs.mkdirSync(DIR_PATH, { recursive: true });
}

if(!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]');
}

const readProducts = () => { 
    const data = fs.readFileSync(FILE_PATH)
    return JSON.parse(data)

}

const writeProducts = (products) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(products))
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/products', (req, res) => { 
    const products = readProducts();
    res.json(products);

})


app.post('/products', (req, res) => {
    const { category, name, description, price } = req.body;
    if (!category || !name || !description || !price) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const products = readProducts();
    const newProduct = { id: UID(32), category, name, description, price };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json({ message: 'Product added successfully.' });
})


app.get('/products/:id', (req, res) => { 
    const { id } = req.params;
    const products = readProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
})

app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { category, name, description, price } = req.body;
    if (!category || !name || !description || !price) {
        return res.status(400).json({ message: 'All fields are required.' });
    }   
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    products[productIndex] = { id, category, name, description, price };
    writeProducts(products);
    res.json({ message: 'Product updated successfully.' });
})

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found.' });
    }   
    products.splice(productIndex, 1);
    writeProducts(products);
    res.json({ message: 'Product deleted successfully.' });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});