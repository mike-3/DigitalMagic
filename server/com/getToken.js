"use strict";
exports.__esModule = true;
var parseString_1 = require("./parseString");
var http = require("http");
var tokenTimestamp = 0;
exports.username = "admin";
var password = "DjGaZ8AIxTUrbJXIFH5Q";
var interval = 10 * 60 * 1000;
// let username = "BellCanada",
//     password = "vIgU9N1u1X4c7w6Ry0";
var auth = "Basic " + new Buffer(exports.username + ":" + password).toString("base64");
function getToken(req, respnse, next) {
    if (req) {
        if (!exports.token)
            respnse.status(503).send('cant get token');
        else
            next();
        return;
    }
    /* if(Date.now()-tokenTimestamp > 10*60*1000){
       token = null;
     }*/
    console.log(' requesting token ');
    var options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/getAuthToken',
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': 1,
            // 'Content-Length': Buffer.byteLength(data),
            "Authorization": auth,
            'User-Agent': 'Mozilla/5.0'
        }
    };
    var http_req = http.request(options, function (response) {
        response.setEncoding('utf8');
        var rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function () {
            // res.send(rawData);
            // console.log('end', rawData);
            parseString_1.parseString(rawData, function (err, result) {
                if (err) {
                    console.log(err);
                    //respnse.status(500).send(err);
                    return;
                }
                if (result.response && Array.isArray(result.response.responseClass) && result.response.responseClass[0]._) {
                    exports.token = result.response.responseClass[0]._;
                    console.log('token: ', exports.token);
                    tokenTimestamp = Date.now();
                    // next();
                }
                else {
                    exports.token = null;
                    console.error(result);
                    // respnse.status(500).send('cant get token');
                }
            });
        }).on('error', function (err) {
            exports.token = null;
            console.error('error in response getToken', err);
        });
    });
    http_req.on('error', function (err) {
        exports.token = null;
        console.error('error getToken', err);
    });
    // console.log('getTokenFunc');
    http_req.end();
}
exports.getToken = getToken;
setInterval(function () { return getToken(); }, interval);
getToken();
//# sourceMappingURL=getToken.js.map