const gitFolder = require('./../dist/index.js');
const fs = require('fs-extra');
const path = require('path');

let PASSED = true;

const testFailed = (message) => {
    console.log('Test FAILED!:',message);
    PASSED=false;
}

const testPass = (message) => {
    console.log('Test PASS!:',message);
}

const result = () => {
    fs.removeSync('test/tesdest');

    if(PASSED) {
        console.log('All tests PASSED!');
        process.exit(0);
    }else{
        console.log('Tests FAILED!');
        process.exit(1);
    }
}

console.log('Test started...')
gitFolder([
    {src:'alexxnb/svelte-docs/templates/default', dir:'test/tesdest'}
])
.then(r => {
    testPass('No errors during function work');

    if(fs.existsSync(path.resolve(path.join('test/tesdest','svelte-docs.config.js')))) 
        testPass('Source was copied');
    else
        testFailed('Source wasn\'t copied');

    result();
}).catch(err => {
    testFailed('Error due execution:', err);
    result();
})

