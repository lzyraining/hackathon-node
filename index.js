const express = require('express');
const auth = require('./auth')

const app = express();

let token = null;

app.use((req, res, next) => {
    auth.requestToken().then(token => {
        token = token;
        next();
    }, err => {
        console.log(err);
    })
});

app.get('/', (req, res, next) => {
    res.json({"status": "success"})
})

app.listen(8080);