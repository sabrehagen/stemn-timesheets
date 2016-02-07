const path = require('path');
const inquirer = require('inquirer-bluebird');
const chalk = require('chalk');
const low = require('lowdb');
const storage = require('lowdb/file-async');
const db = low(path.join(__dirname, 'timesheet.json'), { storage });

// get the last task from the db
const timesheet = db('timesheet');
const lastTask = timesheet.last();
const lastTaskTimeAgo = ((Date.now() - lastTask.start) / (1000 * 60)).toFixed(1);
const lastTaskUpdated = ((Date.now() - lastTask.updated) / (1000 * 60)).toFixed(1);

// question to determine if the user is working on a new task
const isNewTask = {
    type : 'list',
    name : 'newTask',
    message : `Are you working on a new task since ${chalk.yellow(lastTask.task)} (started ${chalk.red(`${lastTaskTimeAgo} mins`)} ago in ${chalk.cyan(lastTask.category)})?`,
    choices : [{ name : 'No', value : false }, { name : 'Yes', value : true }]
};

// questions to get the new task
const getNewTask = [{
    type : 'input',
    name : 'newTask',
    message : `What ${chalk.yellow('new task')} have you done in the last ${chalk.red(lastTaskUpdated + ' mins')}?`
}, {
    type : 'list',
    name : 'taskCategory',
    message : `What ${chalk.cyan('category')} is this new task?`,
    choices : ['Development', 'Internal', 'Meeting', 'Personal', 'Contract work', 'Dinner', 'Email', 'Lunch', 'Management', 'Marketing', 'Product', 'Social Media']
}];

// question to get the recent progress on the current task
const getRecentProgress = {
    type : 'input',
    name : 'recentlyDone',
    message : `What have you done in the last ${chalk.red(lastTaskUpdated + ' mins')}? (default: still ${chalk.yellow(lastTask.task)})`
};

// error handler for when database access fails
const dbErrorHandler = (err) => {
    console.log(`Encountered error '${err}' when saving to database`);
    process.exit(1);
}

// create a new task and close off the old task
const createNewTask = (answers) => {
    // update the closed off task
    const updateOldTask = timesheet
        .chain()
        .find({ task : lastTask.task })
        .assign({ duration : Date.now() - lastTask.start })
        .value();

    // create a new task
    const createNewTask = timesheet.push({
        start : Date.now(),
        task : answers.newTask,
        category : answers.taskCategory,
        updated : Date.now()
    });

    return Promise.all([updateOldTask, createNewTask])
};

// if new progress was provided, add it to the existing task
const updateExistingTask = (answers) => {
    if (answers.recentlyDone) {
        return timesheet
            .chain()
            .find({ task : lastTask.task })
            .assign({ task : lastTask.task + ', ' + answers.recentlyDone, updated : Date.now() })
            .value();
    }
};

// run question sequence
inquirer.prompt(isNewTask).then((answers) => {
    return answers.newTask ?
        inquirer.prompt(getNewTask).then(createNewTask) :
        inquirer.prompt(getRecentProgress).then(updateExistingTask);
}).catch(dbErrorHandler);
