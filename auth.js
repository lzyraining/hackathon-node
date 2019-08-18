const request = require('request');
const config = require('./config');
const fs = require('fs');

const options = {
    method: 'POST',
    url: 'https://api.tealiumiq.com/v2/auth',
    headers:
    {
        'Postman-Token': 'c6ad101a-968d-49c9-a8c9-cae1d7f8efec',
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form:
    {
        username: config.email,
        key: config.apiKey,
        undefined: undefined
    }
};


const requestToken = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('auth.txt', (err, data) => {
            if (err) {
                fs.writeFile('auth.txt', '', err => {

                })
                reject(err);
            } else {
                let token = data.toString();
                if (token.length === 0) {
                    request(options, function (error, response, body) {
                        if (error) {
                            reject(error);
                        } else {
                            const token = JSON.parse(body).token;
                            console.log(token);
                            fs.writeFile('auth.txt', token, err => {

                            })
                            resolve(token);
                        }
                    });
                } else {
                    console.log("read from file");
                    resolve(token);
                }
            }
        })
    })
}

module.exports.requestToken = requestToken;