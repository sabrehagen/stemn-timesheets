const dateFormat = require('dateformat');
const low = require('lowdb');
const storage = require('lowdb/file-async');
const db = low('timesheet.json', { storage });
const chalk = require('chalk');

const formatDuration = (ms) => Math.floor(ms / (1000 * 60));
// const categoryMaxLength = ['Development', 'Internal', 'Meeting', 'Personal', 'Contract work', 'Dinner', 'Email', 'Lunch', 'Management', 'Marketing', 'Product', 'Social Media'].map(c => c.length).reduce((acc, val) => Math.max(acc, val));
const categories = ['Development', 'Internal', 'Meeting', 'Personal', 'Contract work', 'Dinner', 'Email', 'Lunch', 'Management', 'Marketing', 'Product', 'Social Media'];
const categoryMaxLength = Math.max(...categories.map(c => c.length));
const padCategory = (category) => String(category + Array(categoryMaxLength).join(' ')).slice(0, categoryMaxLength);

const timesheet = db('timesheet');
timesheet
    .value()
    .map(entry => console.log(`${chalk.green(dateFormat(entry.start, 'dddd hh:MM TT'))} | ${chalk.cyan(padCategory(entry.category))} | ${chalk.red((formatDuration(entry.duration) || '...') + ' mins')} | ${chalk.yellow(entry.task)}`));
