const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiroutes = require('./api/user');
const cors = require('cors');
const dot = require('dotenv').config();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// app.use(function(error, req, res, next) {
//     console.log(error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     res.status(status).json({ message: message });
// });


app.use('/api', apiroutes);

mongoose.connect(
        'mongodb+srv://admin-hrms:' + 'BUTTONS007' + '@cluster0-kldnh.mongodb.net/HRMS?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(console.log('hello'))
    .catch(err => console.log(err))

app.listen(process.env.PORT || 3000);