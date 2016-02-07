const dateFormat = require('dateformat');
const low = require('lowdb');
const storage = require('lowdb/file-async');
const db = low('timesheet.json', { storage });
const chalk = require('chalk');

const dayInMs = 1000 * 60 * 60 * 24;
const formatDuration = (ms) => Math.floor(ms / (1000 * 60));

const categories = ['Development', 'Internal', 'Meeting', 'Personal', 'Contract work', 'Dinner', 'Email', 'Lunch', 'Management', 'Marketing', 'Product', 'Social Media'];
const categoryMaxLength = Math.max(...categories.map(c => c.length));
const padCategory = (category) => String(category + Array(categoryMaxLength).join(' ')).slice(0, categoryMaxLength);

const dateMaxLength = 'Wednesday 00:00 AM'.length;
const padDate = (category) => String(category + Array(dateMaxLength).join(' ')).slice(0, dateMaxLength);

const minutesMaxLength = '10000 mins'.length;
const padMinutes = (minutes) => String(minutes + Array(minutesMaxLength).join(' ')).slice(0, minutesMaxLength);

const timesheet = db('timesheet');
timesheet
    .value()
    .forEach((entry, index, entries) => {
        const previousEntryDay = parseInt(dateFormat((entries[index - 1] || { start : 0 }).start, 'dd'));
        const currentEntryDay = parseInt(dateFormat(entry.start, 'dd'));
        const firstEntryOfDay = currentEntryDay > previousEntryDay || index === 0;
        const duration = entry.duration || entry.duration === 0 ? formatDuration(entry.duration) + ' mins' : 'unfinished';

        if (firstEntryOfDay) console.log(chalk.grey(`-------------------------------------------------------------------------------------- ${dateFormat(entry.start, 'dd mmmm yyyy')}`));

        console.log(`${chalk.green(padDate(dateFormat(entry.start, 'dddd hh:MM TT')))} | ${chalk.cyan(padCategory(entry.category))} | ${chalk.red(padMinutes(duration))} | ${chalk.yellow(entry.task)}`)
    });
