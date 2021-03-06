"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var getToken_1 = require("./server/com/getToken");
var initApi_1 = require("./server/initApi");
var initWinston_1 = require("./server/com/initWinston");
// let express = require('express');
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
process.on('uncaughtException', function (err) {
    console.error('uncaughtException', err);
});
initWinston_1.initWinston({ env: '!production' });
var app = express();
var parseString = require('xml2js').parseString;
var path = require('path');
var port = 8989;
var PLAYERS = require('./server/models/devices');
console.log('PLAYERS', PLAYERS);
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", getToken_1.getToken);
initApi_1.initApi(app);
app.listen(port, function () {
    console.log('app listening on port ' + port + '! http://localhost:' + port + '/');
});
//# sourceMappingURL=server.js.map