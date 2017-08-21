/**
 * Command like module, to emulate a model that consumes
 * cpu resources
 * 
 * 2017/08/17
 */
'use strict';

var moment = require('moment');
var logger = require('./logger');
var utils = require('crc-utils');
var Task = require('./model/Task');
var TaskCollection = require('./model/TaskCollection');

/**
 * Set the log level
 * Defaults to 'error'
 */
var logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
logger.warn('LogLevel: ', logLevel);
logger.level = logLevel;

var loopCnt = process.env.LOOP_CNT ? process.env.LOOP_CNT : 150000;

logger.info('Running command: ', {
    logLevel: logLevel,
    loopCnt: loopCnt
});

var tasks = new TaskCollection();

var projects = ['none', 'courses', 'training', 'project'];
var priorities = [1, 2, 3, 4, 5];
var users = ['Jon', 'Erica', 'Amanda', 'Nathan'];
var completed = [true, false];

function execute() {

    var initialMemory = process.memoryUsage().heapUsed;
    var hrStart = process.hrtime();

    for (var i = 0; i < loopCnt; i++) {
        tasks.add({
            name: 'task' + i,
            priority: priorities[Math.floor((Math.random() * 5))],
            project: projects[Math.floor((Math.random() * 4))],
            user: users[Math.floor((Math.random() * 4))],
            completed: completed[Math.floor((Math.random() * 2))]
        });

    };

    var afterMemory = process.memoryUsage().heapUsed;
    var end = process.hrtime(hrStart);

    var returnObj = {
        pid: process.pid,
        memUsed: (afterMemory - initialMemory) / 1000000,
        timeTake: end[1] / 1000000,
        tasks: tasks.getCount()
    };
    return returnObj;
}

process.on('message', function (msg) {
    var signal = JSON.parse(msg);
    logger.verbose('on message: ', signal);
    var results = execute();
    results.origMsg = signal;
    process.send(JSON.stringify(results));
});