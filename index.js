const express = require('express');
const auth = require('./auth')
const config = require('./config')
const request = require('request')

const app = express();

let token = null;

app.use((req, res, next) => {
    auth.requestToken().then(token => {
        this.token = token;
        next();
    }, err => {
        console.log(err);
    })
});

app.get('/', (req, res, next) => {
    res.json({"status": "success"})
})

app.get('/lookup', (req, res, next) => {
    var options = {
        method: 'GET',
        url: `https://api.tealiumiq.com/v2/visitor/accounts/${config.account}/profiles/${config.profile}`,
        qs:
        {
            attributeId: config.attributeId,
            attributeValue: config.attributeValue,
            prettyName: 'true'
        },
        headers:
        {
            'Postman-Token': 'bfe41502-1949-4243-b591-bfac90817922',
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.token}`
        },
        form: { undefined: undefined }
    };

    request(options, function (error, response, body) {
        if (error) {
            return JSON.stringify(error);
        };
        let data = JSON.parse(body);
        res.json(data);
    });
})

app.listen(8080);