const express = require('express');
const auth = require('./auth')
const config = require('./config')
const request = require('request')
const path = require('path');
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

let token = null;

app.use((req, res, next) => {
    auth.requestToken().then(token => {
        this.token = token;
        next();
    }, err => {
        console.log(err);
    })
})

app.get('/', (req, res, next) => {
    res.render('index', {
        category: null
    });
})

app.get('/lookup', (req, res, next) => {
    const preference = req.query.preference;
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
        const data = JSON.parse(body);
        console.log(preference);
        const top3 = [...data["visitor"]["property_sets"]["Top 3 Product Categories"]];
        const top3WithPreferences = calculateNewTop3Categories(top3, preference, 0.45)
        const category = {
            'top3': top3WithPreferences,
            'views': {...data["visitor"]["metric_sets"]["Category"]}
        } 
        console.log(category);
        return res.render('index', {
            category: category
        });
    });
})

const calculateNewTop3Categories = (categories, preference, preferenceWeight) => {
    if (preference === "None") {
        return categories;
    }
    const index = categories.indexOf(preference);
    let weight = [0.5 * (1 - preferenceWeight), 0.3 * (1 - preferenceWeight), 0.2 * (1 - preferenceWeight)]
    if (index !== -1) {
        weight[index] += preferenceWeight;
    } else {
        categories.push(preference)
        weight.push(preferenceWeight);
    }
    console.log(categories);
    console.log(weight);
    const result = []
    for (let i = 0; i < 3; i++) {
        let maxIndex = weight.indexOf(Math.max(...weight));
        result.push(categories[maxIndex]);
        weight[maxIndex] = 0.0
    }    
    console.log(result)
    return result;
}

app.listen(8080);