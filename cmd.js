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
/**
 * Set the log level
 * Defaults to 'error'
 */
var logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
logger.warn('LogLevel: ', logLevel);
logger.level = logLevel;

var loopCnt = process.env.LOOP_CNT ? process.env.LOOP_CNT : 100;

logger.info('Running command: ', {
    logLevel: logLevel,
    loopCnt: loopCnt
});

var Task = function (data) {
    this.name = data.name;
    this.priority = data.priority;
    this.project = data.project;
    this.user = data.user;
    this.completed = data.completed;
};

Task.prototype.getPriority = function () {
    return this.priority;
};

function TaskCollection() {
    var tasks = {};
    var count = 0;
    var add = function (data) {
        tasks[data.name] =
            new Task(data);
        count++;
    };
    var get = function (name) {
        return tasks[name];
    };
    var getCount = function () {
        return count;
    };
    return {
        add: add,
        get: get,
        getCount: getCount
    };
}

var tasks = new TaskCollection();

var projects = ['none', 'courses', 'training', 'project'];
var priorities = [1, 2, 3, 4, 5];
var users = ['Jon', 'Erica', 'Amanda', 'Nathan'];
var completed = [true, false];

var initialMemory = process.memoryUsage().heapUsed;
var hrStart = process.hrtime();

function _addTask(task, cb) {
    logger.debug('addTask: ', {
        task: task
    });
    var delay = Math.round(Math.random() * 1);
    cb();
    // setTimeout(function () {
    //     cb();
    // }, delay);
}

// var waitLoop = utils.loopWait(loopCnt, function (loop) {
//     var i = loop.iteration();
//     _addTask({
//         name: 'task' + i,
//         priority: priorities[Math.floor((Math.random() * 5))],
//         project: projects[Math.floor((Math.random() * 4))],
//         user: users[Math.floor((Math.random() * 4))],
//         completed: completed[Math.floor((Math.random() * 2))]
//     }, function () {

//         logger.debug('callback: ', i);
//         loop.next();
//     });
// }, function (done) {
//     logger.info('Loop Completed: ', {
//         done: done
//     });
//     var afterMemory = process.memoryUsage().heapUsed;
//     var end = process.hrtime(hrStart);

//     logger.info('used memory ' + (afterMemory - initialMemory) / 1000000);
//     logger.info('timetake: ', end[1] / 1000000);
//     logger.info("tasks: " + tasks.getCount());
// });

for (var i = 0; i < loopCnt; i++) {
    tasks.add({
        name: 'task' + i,
        priority: priorities[Math.floor((Math.random() * 5))],
        project: projects[Math.floor((Math.random() * 4))],
        user: users[Math.floor((Math.random() * 4))],
        completed: completed[Math.floor((Math.random() * 2))]
    });

    // _addTask({
    //         name: 'task' + i,
    //         priority: priorities[Math.floor((Math.random() * 5))],
    //         project: projects[Math.floor((Math.random() * 4))],
    //         user: users[Math.floor((Math.random() * 4))],
    //         completed: completed[Math.floor((Math.random() * 2))]
    //     }, function(){
    //         logger.debug('callback: ', i++);
    //     });
    // var delay = Math.round(Math.random() * 10);
    // logger.debug('Delay: ', delay);
    // setTimeout(function () {
    //     tasks.add({
    //         name: 'task' + i,
    //         priority: priorities[Math.floor((Math.random() * 5))],
    //         project: projects[Math.floor((Math.random() * 4))],
    //         user: users[Math.floor((Math.random() * 4))],
    //         completed: completed[Math.floor((Math.random() * 2))]
    //     });
    // }, delay);
};

var afterMemory = process.memoryUsage().heapUsed;
var end = process.hrtime(hrStart);

logger.info('used memory ' + (afterMemory - initialMemory) / 1000000);
logger.info('timetake: ', end[1] / 1000000);
logger.info("tasks: " + tasks.getCount());