const inquirer = require('inquirer-bluebird');
const lastTask = 'developing stemn';
const yesNo = ['Yes', 'No'];

inquirer([{
    type : 'confirm',
    name : 'sameTask',
    message : `Are you working on a new task since ${lastTask}?`,
    choices : yesNo
}])
.then(function(answers) {
    console.log(answers);
});
