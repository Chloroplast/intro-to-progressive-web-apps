const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/data/:numberOfItems', function (req, res) {
    const numberOfItems = req.params.numberOfItems;
    const fakeData = [];
    for (let i=0; i < numberOfItems; i++){
        const randomNumber = Math.floor(Math.random() * 100);
        fakeData.push(randomNumber)
    }
    return res.json(fakeData);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);