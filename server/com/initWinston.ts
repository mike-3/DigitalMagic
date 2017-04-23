/**
 * Created by Vlad on 2017-04-18.
 */

import * as fs from 'fs';

export function initWinston(options){



     /*   env.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });*/
  let dir = './logs';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
    var winston = require('winston');


    const tsFormat = function() { return (new Date()).toLocaleString();};

    var logger = new (winston.Logger)({
        transports: [
            new (require('winston-daily-rotate-file'))({
                name: 'info',
                timestamp: tsFormat,
                prepend: true,
                filename: dir + '/info.log',
                level: 'info'
            }),
            new (require('winston-daily-rotate-file'))({
                timestamp: tsFormat,
                name: 'error',
                prepend: true,
                filename: dir + '/error.log',
                level: 'error'
            })
        ]
    });

    logger.info(options);

    if(options.env ==='prod'){
        winston.handleExceptions(new winston.transports.File({ filename: 'logs/exceptions.log' }));
        console.log = logger.info;
        console.error = logger.error;
    }

}