// Import modules
const WebSocAPI = require('./index.js');
const notifier = require('node-notifier');

// Specify search parameters
const opts = {
    term: '2021 Winter',
    department: 'COMPSCI',
    sectionCodes: '34100'
}

// sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// notification function
function notify(message) {
    notifier.notify(message);
}

function search() {
    const result = WebSocAPI.callWebSocAPI(opts);
    result.then((json) => {
        const course = json.schools[0].departments[0].courses[0];
        
        title = course.courseTitle
        code = course.sections[0].sectionCode;
        status = course.sections[0].status;
        num_curr_enrolled = course.sections[0].numCurrentlyEnrolled.totalEnrolled;
        capacity = course.sections[0].maxCapacity;
        num_req = course.sections[0].numRequested;
    
        console.log(code, title, `num_req:${num_req}`, `curr:${num_curr_enrolled}`, `max:${capacity}`, status);

        if (num_curr_enrolled < capacity || status != "FULL") {
            notify(`${opts.sectionCodes} OPEN SPACE!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            console.log('SPACE OPENED!!!!!!!!!!!!!!!!!!!!!!!!!');
        }

    }).catch((err) => {
        console.log(`ERROR: ${err}`);
    });
}

function getTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return `Time ${hour}:${min}:${sec}`;
}

async function init() {
    while(true) {
        console.log(getTime());
        search();
        await sleep(1000);
    }
}

init();