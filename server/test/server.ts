
import * as express from "express";
import * as bodyParser from "body-parser";
// let express = require('express');
let querystring = require('querystring');
let http = require('http');
let fs = require('fs');
let app = express();

let parseString = require('xml2js').parseString;
let path = require('path');

declare let global:any;
declare let ROOT:string;
declare let WWW:string;
declare let SERVER:string;


const port: number = 5000;
const PLAYERS = require('./devices');
console.log('PLAYERS', PLAYERS);

global.ROOT = __dirname;
global.WWW = path.resolve(ROOT + '/client/');
global.SERVER = path.resolve(ROOT + '/server/');

//authorization
let username = "admin",
    password = "DjGaZ8AIxTUrbJXIFH5Q";
// let username = "BellCanada",
//     password = "vIgU9N1u1X4c7w6Ry0";
let auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
let token = '';
let tokenTimestamp = 0;

let playlists, playlist_content, allDevices, devices, devicesDisconnection, devicesConnection, deviceConnectionEntity;

// app.use('libs', express.static(ROOT + '/client/libs/'));
// app.use(express.static(ROOT + '/client/libs/'));
app.use(express.static(WWW));

let getToken = function (req, res, next) {
    if(Date.now()-tokenTimestamp > 10*60*1000){
        token = null;
    }

    if(token){
        next();
        return;
    }

    const options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/getAuthToken',
        method: 'GET',
        headers: {
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept-Language':'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
            'Connection':'keep-alive',
            'Upgrade-Insecure-Requests':1,
            // 'Content-Length': Buffer.byteLength(data),
            "Authorization" : auth,
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // res.send(rawData);
            // console.log('end', rawData);
            parseString(rawData, function (err, result) {
                console.log('result: ', result.response.responseClass[0]._);
                token = result.response.responseClass[0]._;
                tokenTimestamp = Date.now();
                // console.log('parseString', result.response.responseClass[0]._);
                next();
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    // console.log('getTokenFunc');
    http_req.end();
};

app.use(getToken);



app.use('/',bodyParser.urlencoded({extended: true}));
app.use('/',bodyParser.json());

// app.use('/api',require('./server/api/api_requests'));

app.get('/', function (req: express.Request, res: express.Response) {
    res.sendFile('index.html',{'root':WWW});
});

app.get('/getAuthToken', getToken);

app.get('/getCategoryList', function (req, res) {
  let data = querystring.stringify({
    // _csrf:'b3862bdd-115d-4f28-b182-50dfe001e3f5',
    service:'CommonContentService.getCategoryList',
    token:token,
    groupId:''
  });

  let options = {
    host: '34.196.180.158',
    port: 7001,
    path: '/MagicInfo/openapi/open',
    method: 'POST',
    headers: {
      'Connection':'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent':'Mozilla/5.0'
    }
  };

  let http_req = http.request(options, function(response) {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', function (chunk) {
      rawData += chunk;
      // console.log("body: " + chunk);
    });
    response.on('end', function() {
      res.send(rawData);
      // console.log('rawData', rawData);
    }).on('error', function(err) {
      console.error(err);
    });
  });

  http_req.write(data);
  http_req.end();
}); /// ??? DELETE

app.get('/addContent', function (req, res) {
  let data = querystring.stringify({
    // _csrf:'b3862bdd-115d-4f28-b182-50dfe001e3f5',
    service:'CommonContentService.addContent',
    token:token,
    isSecure:false,
    locale:'en_US'
  });

  let options = {
    host: '34.196.180.158',
    port: 7001,
    path: '/MagicInfo/openapi/open',
    method: 'POST',
    headers: {
      'Connection':'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent':'Mozilla/5.0'
    }
  };

  let http_req = http.request(options, function(response) {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', function (chunk) {
      rawData += chunk;
      // console.log("body: " + chunk);
    });
    response.on('end', function() {
      res.send(rawData);
      // console.log('rawData', rawData);
    }).on('error', function(err) {
      console.error(err);
    });
  });

  http_req.write(data);
  http_req.end();
});  /// ??? DELETE

app.get('/downloadContent', function (req, res) {
  let data = querystring.stringify({
    // _csrf:'b3862bdd-115d-4f28-b182-50dfe001e3f5',
    service:'CommonContentService.downloadContent',
    token:token,
    contentIdList:'',
    isSecure:false,
    locale:'en_US'
  });

  let options = {
    host: '34.196.180.158',
    port: 7001,
    path: '/MagicInfo/openapi/open',
    method: 'POST',
    headers: {
      'Connection':'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent':'Mozilla/5.0'
    }
  };

  let http_req = http.request(options, function(response) {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', function (chunk) {
      rawData += chunk;
      // console.log("body: " + chunk);
    });
    response.on('end', function() {
      res.send(rawData);
      // console.log('rawData', rawData);
    }).on('error', function(err) {
      console.error(err);
    });
  });

  http_req.write(data);
  http_req.end();
});  /// ??? DELETE

app.get('/getPlaylistListByUser', function (req, res) {
    // console.log('TOKEN ', token);

    let data = querystring.stringify({
        service:'PremiumPlaylistService.getPlaylistListByUser',
        token:token,
        userId:username
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                playlists = result.response.responseClass[0].resultList[0].Playlist;
                res.send(playlists);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('rawData', rawData);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});

app.get('/getContentListOfPlaylist', function (req, res) {
    // console.log('getContentListOfPlaylist ', req);
    // console.log('req.query ', req.query.playlistId);
    // console.log('req.query ', req.query.versionId);
    let data = querystring.stringify({
        service:'PremiumPlaylistService.getContentListOfPlaylist',
        token:token,
        playlistId:req.query.playlistId,
        versionId:req.query.versionId
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                playlist_content = result.response.responseClass[0].resultList[0].Content;
                res.send(playlist_content);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('rawData', rawData);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});

////////////////// DEVICES START ///////////////////

let dataDevices = {
    service:'PremiumDeviceService.getDeviceListWithDeviceType',
    token:'',
    condition: '<DeviceCondition><statusViewMode>device_status_view_all</statusViewMode></DeviceCondition>',
    deviceType:'ALL'
};

let optionsDevices = {
    host: '34.196.180.158',
    port: 7001,
    path: '/MagicInfo/openapi/open',
    method: 'POST',
    headers: {
        'Connection':'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(dataDevices)),
        'User-Agent':'Mozilla/5.0'
    }
};

let getDevices = function (req, res, next) {
    console.log('GD');

    let http_req = http.request(optionsDevices, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData  !!! ', rawData);
            parseString(rawData, function (err, result) {
                // console.log('err', err);
                // console.log('res ', result);
                // devices = result.response.responseClass[0].resultList[0].Device;
                next();
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // next();
            // console.log('rawData', devices);
        }).on('error', function(err) {
            console.error(err);
        });
    });
    dataDevices.token = token;
    // console.log('optionsDevices', optionsDevices);
    http_req.write(querystring.stringify(dataDevices));
    // console.log('devices', devices);
    http_req.end();
};

let getDevicesConnection = function (req, res, next) {
    console.log('GDС');

    let http_req = http.request(optionsDevices, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                // devicesConnection = result.response.responseClass[0].resultList[0].Device;
                next();
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('rawData', devices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    dataDevices.token = token;
    dataDevices.condition = '<DeviceCondition><statusViewMode>device_status_view_connection</statusViewMode></DeviceCondition>';
    http_req.write(querystring.stringify(dataDevices));
    console.log('devicesConnection', devicesConnection);
    http_req.end();
};

let getDevicesDisconnection = function (req, res, next) {
    console.log('GDD');
    let http_req = http.request(optionsDevices, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                // devicesDisconnection = result.response.responseClass[0].resultList[0].Device;
                next();
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('rawData', devices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    dataDevices.token = token;
    dataDevices.condition = '<DeviceCondition><statusViewMode>device_status_view_disconnection</statusViewMode></DeviceCondition>';
    http_req.write(querystring.stringify(dataDevices));
    console.log('devicesDisconnection', devicesDisconnection);
    http_req.end();
};

app.get('/getDevices', [getDevices, getDevicesConnection, getDevicesDisconnection], function (req, res) {
    res.send('GOOD');
});

app.get('/getAllDevices', function (req, res) {
    let data = querystring.stringify({
        service:'PremiumDeviceService.getDeviceListWithDeviceType',
        token:token,
        condition: '<DeviceCondition><statusViewMode>device_status_view_all</statusViewMode></DeviceCondition>',
        deviceType:'ALL'
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                allDevices = result.response.responseClass[0].resultList[0].Device;
                res.send(allDevices);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('allDevices', allDevices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
}); /// !!! USED

app.get('/getAllDevices2', function (req, res) {
    let data = querystring.stringify({
        service:'PremiumDeviceService.getDeviceListWithDeviceType',
        token:token,
        condition: '<DeviceCondition><statusViewMode>device_status_view_all</statusViewMode></DeviceCondition>',
        deviceType:'ALL'
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                allDevices = result.response.responseClass[0].resultList[0].Device;
                // res.send(allDevices);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('rawData', allDevices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    let deviceIds = function (allDevices) {
        let dIds: string = '';
        allDevices.forEach(function(item, i, arr){
            dIds = item.device_id[0] + ',';
        });
        // console.log('dIds', dIds);
        return dIds;
    };

    let data2 = {
        service: 'PremiumDeviceService.getDeviceConnectionList',
        token: token,
        deviceIds: deviceIds
    };

    let http_req2 = http.request(options, function(response) {

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                deviceConnectionEntity = result.response.responseClass[0].resultList[0].DeviceConnectionEntity;
                res.send(deviceConnectionEntity);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('deviceConnectionEntity', devices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.write(querystring.stringify(data2));
    http_req.end();
});

app.get('/getDeviceConnection', function (req, res) {
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDeviceConnection',
        token: token,
        deviceId: req.query.deviceId
    });

    let options = {
        host: "34.196.180.158",
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                // console.log('getDeviceConnection ', result.response.responseClass[0]._);
                deviceConnectionEntity = result.response.responseClass[0]._;
                res.send(deviceConnectionEntity);
            });
            // console.log('deviceConnectionEntity', deviceConnectionEntity);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});  /// !!! USED

app.get('/getDeviceConnectionList', function (req, res) {
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDeviceConnectionList',
        token: token,
        deviceIds: req.query.deviceIds
    });

    let options = {
        host: "34.196.180.158",
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                deviceConnectionEntity = result.response.responseClass[0].resultList[0].DeviceConnectionEntity;
                res.send(deviceConnectionEntity);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('deviceConnectionEntity', deviceConnectionEntity);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});

app.get('/getDeviceListWithDeviceType', function (req, res) {
    // console.log('getContentListOfPlaylist ', req);
    // console.log('req.query ', req.query.playlistId);
    // console.log('req.query ', req.query.versionId);
    let data = querystring.stringify({
        service:'PremiumDeviceService.getDeviceListWithDeviceType',
        token:token,
        // condition: "<DeviceCondition><statusViewMode>device_status_view_connection</statusViewMode></DeviceCondition>",
        deviceType:'ALL'
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            parseString(rawData, function (err, result) {
                devices = result.response.responseClass[0].resultList[0].Device;
                res.send(devices);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
            });
            // console.log('devices', devices);
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});

app.get('/getDeviceThumbnailURL', function (req, res) {
    // console.log('getDeviceThumbnailURL ', req.query.device_id);
    // console.log('req.query ', req.query.playlistId);
    // console.log('req.query ', req.query.versionId);
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDeviceThumbnailURL',
        token: token,
        device_id: req.query.device_id
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                res.send(result.response.responseClass[0]._);
                // console.log('parseString', result.response.responseClass[0]._);
                // console.log('rawData', result.response.responseClass[0]);
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
}); /// !!! USED

app.get('/getDevicePlayingContent', function (req, res) {
    // console.log('getDevicePlayingContent ', req.query.deviceId);
    // console.log('req.query ', req.query.playlistId);
    // console.log('req.query ', req.query.versionId);
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDevicePlayingContent',
        token: token,
        deviceId: req.query.deviceId
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                delete result.response.responseClass[0]['$'];
                res.send(result.response.responseClass[0]);
                // console.log('programId: ', result.response.responseClass[0].$);
                // console.log('programId: ', result.response.responseClass[0].programId[0]);
                // console.log('frameIndex: ', result.response.responseClass[0].contentLists[0].ContentList[0].frameIndex[0]);
                // console.log('parseString', result.response.responseClass[0].resultList[0].Playlist);
                // console.log('rawData', result.response.responseClass[0]);
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
}); /// !!! USED

////////////////// DEVICES END ///////////////////

app.get('/getContentInfo', function (req, res) {
    // console.log('getDeviceThumbnailURL ', req.query.device_id);
    // console.log('req.query ', req.query.playlistId);
    // console.log('req.query ', req.query.versionId);
    let data = querystring.stringify({
        service: 'CommonContentService.getContentInfo',
        token: token,
        contentId: req.query.contentId
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                console.log('parseString', result.response.responseClass[0]);
                res.send(result.response.responseClass[0]);
                // console.log('parseString', result.response.responseClass[0]._);
                // console.log('rawData', result.response.responseClass[0]);
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});

app.get('/getPlayingContent', function (req, res) {
    // console.log('getPlaylists ', req.query.deviceId);
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDevicePlayingContent',
        token: token,
        deviceId: req.query.deviceId
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                // console.log('getDevicePlayingContent ', result.response.responseClass[0]);
                let devicePlayingContent = result.response.responseClass[0];



                let data = querystring.stringify({
                    service: 'CommonContentService.getContentInfo',
                    token: token,
                    contentId: result.response.responseClass[0].contentLists[0].ContentList[0].contentId[0]
                });

                let options = {
                    host: '34.196.180.158',
                    port: 7001,
                    path: '/MagicInfo/openapi/open',
                    method: 'POST',
                    headers: {
                        'Connection':'keep-alive',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(data),
                        'User-Agent':'Mozilla/5.0'
                    }
                };

                let http_req = http.request(options, function(response) {
                    response.setEncoding('utf8');
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                        // console.log("body: " + chunk);
                    });
                    response.on('end', function() {
                        // console.log('rawData', rawData);
                        parseString(rawData, function (err, result) {
                            // console.log('getContentInfo', result.response.responseClass[0]);
                            if(result.response.responseClass[0].media_type[0] == 'MOVIE'){
                                res.send(result.response.responseClass[0]);
                            } else {
                                let data = querystring.stringify({
                                    service: 'PremiumScheduleService.getContentScheduleList',
                                    token: token,
                                    programId: devicePlayingContent.programId[0],
                                    frameIndex: devicePlayingContent.contentLists[0].ContentList[0].frameIndex[0],
                                    ScheduleCondition: '<ScheduleCondition><pageSize>10</pageSize><startPos>1</startPos></ScheduleCondition>'

                                });

                                let options = {
                                    host: '34.196.180.158',
                                    port: 7001,
                                    path: '/MagicInfo/openapi/open',
                                    method: 'POST',
                                    headers: {
                                        'Connection':'keep-alive',
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Content-Length': Buffer.byteLength(data),
                                        'User-Agent':'Mozilla/5.0'
                                    }
                                };

                                let http_req = http.request(options, function(response) {
                                    response.setEncoding('utf8');
                                    let rawData = '';
                                    response.on('data', function (chunk) {
                                        rawData += chunk;
                                        // console.log("body: " + chunk);
                                    });
                                    response.on('end', function() {
                                        // console.log('rawData', rawData);
                                        parseString(rawData, function (err, result) {
                                            // console.log('getContentScheduleList ', result.response.responseClass[0].resultList[0].ContentsScheduleEntity[0]);

                                            let data = querystring.stringify({
                                                service: 'PremiumPlaylistService.getPlaylistActiveVerInfo',
                                                token: token,
                                                playlistId: result.response.responseClass[0].resultList[0].ContentsScheduleEntity[0].content_id[0]
                                            });

                                            let options = {
                                                host: '34.196.180.158',
                                                port: 7001,
                                                path: '/MagicInfo/openapi/open',
                                                method: 'POST',
                                                headers: {
                                                    'Connection':'keep-alive',
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Content-Length': Buffer.byteLength(data),
                                                    'User-Agent':'Mozilla/5.0'
                                                }
                                            };

                                            let http_req = http.request(options, function(response) {
                                                response.setEncoding('utf8');
                                                let rawData = '';
                                                response.on('data', function (chunk) {
                                                    rawData += chunk;
                                                    // console.log("body: " + chunk);
                                                });
                                                response.on('end', function() {
                                                    // console.log('getPlaylistActiveVerInfo rawData ', rawData);
                                                    parseString(rawData, function (err, result) {
                                                        // console.log('getPlaylistActiveVerInfo-> version_id: ', result.response.responseClass[0]);

                                                        let data = querystring.stringify({
                                                            service: 'PremiumPlaylistService.getContentListOfPlaylist',
                                                            token: token,
                                                            playlistId: result.response.responseClass[0].playlist_id[0],
                                                            versionId: result.response.responseClass[0].version_id[0]
                                                        });

                                                        let options = {
                                                            host: '34.196.180.158',
                                                            port: 7001,
                                                            path: '/MagicInfo/openapi/open',
                                                            method: 'POST',
                                                            headers: {
                                                                'Connection':'keep-alive',
                                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                                'Content-Length': Buffer.byteLength(data),
                                                                'User-Agent':'Mozilla/5.0'
                                                            }
                                                        };

                                                        let http_req = http.request(options, function(response) {
                                                            response.setEncoding('utf8');
                                                            let rawData = '';
                                                            response.on('data', function (chunk) {
                                                                rawData += chunk;
                                                                // console.log("body: " + chunk);
                                                            });
                                                            response.on('end', function() {
                                                                // console.log('rawData', rawData);
                                                                parseString(rawData, function (err, result) {
                                                                    // console.log('getContentListOfPlaylist ', result.response.responseClass[0].resultList[0].Content);
                                                                    res.send(result.response.responseClass[0].resultList[0].Content);
                                                                });
                                                            }).on('error', function(err) {
                                                                console.error(err);
                                                            });
                                                        });

                                                        http_req.write(data);
                                                        http_req.end();
                                                    });
                                                }).on('error', function(err) {
                                                    console.error(err);
                                                });
                                            });

                                            http_req.write(data);
                                            http_req.end();
                                        });
                                    }).on('error', function(err) {
                                        console.error(err);
                                    });
                                });

                                http_req.write(data);
                                http_req.end();
                            }
                        });
                    }).on('error', function(err) {
                        console.error(err);
                    });
                });

                http_req.write(data);
                http_req.end();

            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
});  /// !!! USED


app.get('/getPlayingContent2', function (req, res) {
    console.log('getPlaylists ', req.query.deviceId);
    let data = querystring.stringify({
        service: 'PremiumDeviceService.getDevicePlayingContent',
        token: token,
        deviceId: req.query.deviceId
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                console.log('getDevicePlayingContent ', result.response.responseClass[0]);

                let data = querystring.stringify({
                    service: 'PremiumScheduleService.getContentScheduleList',
                    token: token,
                    programId: result.response.responseClass[0].programId[0],
                    frameIndex: result.response.responseClass[0].contentLists[0].ContentList[0].frameIndex[0],
                    ScheduleCondition: '<ScheduleCondition><pageSize>10</pageSize><startPos>1</startPos></ScheduleCondition>'

                });

                let options = {
                    host: '34.196.180.158',
                    port: 7001,
                    path: '/MagicInfo/openapi/open',
                    method: 'POST',
                    headers: {
                        'Connection':'keep-alive',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(data),
                        'User-Agent':'Mozilla/5.0'
                    }
                };


                let http_req = http.request(options, function(response) {
                    response.setEncoding('utf8');
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                        // console.log("body: " + chunk);
                    });
                    response.on('end', function() {
                        // console.log('rawData', rawData);
                        parseString(rawData, function (err, result) {
                            console.log('getContentScheduleList ', result.response.responseClass[0].resultList[0].ContentsScheduleEntity[0]);

                            let data = querystring.stringify({
                                service: 'PremiumPlaylistService.getPlaylistActiveVerInfo',
                                token: token,
                                playlistId: result.response.responseClass[0].resultList[0].ContentsScheduleEntity[0].content_id[0]
                            });

                            let options = {
                                host: '34.196.180.158',
                                port: 7001,
                                path: '/MagicInfo/openapi/open',
                                method: 'POST',
                                headers: {
                                    'Connection':'keep-alive',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Content-Length': Buffer.byteLength(data),
                                    'User-Agent':'Mozilla/5.0'
                                }
                            };

                            let http_req = http.request(options, function(response) {
                                response.setEncoding('utf8');
                                let rawData = '';
                                response.on('data', function (chunk) {
                                    rawData += chunk;
                                    // console.log("body: " + chunk);
                                });
                                response.on('end', function() {
                                    console.log('getPlaylistActiveVerInfo rawData ', rawData);
                                    parseString(rawData, function (err, result) {
                                        console.log('getPlaylistActiveVerInfo-> version_id: ', result.response.responseClass[0]);

                                        let data = querystring.stringify({
                                            service: 'PremiumPlaylistService.getContentListOfPlaylist',
                                            token: token,
                                            playlistId: result.response.responseClass[0].playlist_id[0],
                                            versionId: result.response.responseClass[0].version_id[0]
                                        });

                                        let options = {
                                            host: '34.196.180.158',
                                            port: 7001,
                                            path: '/MagicInfo/openapi/open',
                                            method: 'POST',
                                            headers: {
                                                'Connection':'keep-alive',
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Content-Length': Buffer.byteLength(data),
                                                'User-Agent':'Mozilla/5.0'
                                            }
                                        };

                                        let http_req = http.request(options, function(response) {
                                            response.setEncoding('utf8');
                                            let rawData = '';
                                            response.on('data', function (chunk) {
                                                rawData += chunk;
                                                // console.log("body: " + chunk);
                                            });
                                            response.on('end', function() {
                                                // console.log('rawData', rawData);
                                                parseString(rawData, function (err, result) {
                                                    // console.log('getContentListOfPlaylist ', result.response.responseClass[0].resultList[0].Content);
                                                    res.send(result.response.responseClass[0].resultList[0].Content);
                                                });
                                            }).on('error', function(err) {
                                                console.error(err);
                                            });
                                        });

                                        http_req.write(data);
                                        http_req.end();
                                    });
                                }).on('error', function(err) {
                                    console.error(err);
                                });
                            });

                            http_req.write(data);
                            http_req.end();
                        });
                    }).on('error', function(err) {
                        console.error(err);
                    });
                });

                http_req.write(data);
                http_req.end();
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
}); /// ??? DELETE

app.get('/getOrganizationList', function (req, res) {
    let data = querystring.stringify({
        service: 'CommonUserService.getOrganizationList',
        token: token
    });

    let options = {
        host: '34.196.180.158',
        port: 7001,
        path: '/MagicInfo/openapi/open',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'User-Agent':'Mozilla/5.0'
        }
    };

    let http_req = http.request(options, function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
            // console.log("body: " + chunk);
        });
        response.on('end', function() {
            // console.log('rawData', rawData);
            parseString(rawData, function (err, result) {
                // console.log('OrgList', result.response.responseClass[0]);
                res.send(result.response.responseClass[0].resultList[0].UserGroup);
            });
        }).on('error', function(err) {
            console.error(err);
        });
    });

    http_req.write(data);
    http_req.end();
}); /// ??? USED

app.listen(port, function () {

  console.log('app listening on port ' + port + '! http://localhost:' + port + '/');
});