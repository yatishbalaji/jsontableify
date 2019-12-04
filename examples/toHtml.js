const fs = require('fs');
const path = require('path');

const JsonProcessor = require('../src/jsonProcessor');

const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, './example.json')), 'utf-8');

console.log(new JsonProcessor(['Phone', 'Attachments', 'PersonCompetency'], 'DD-MM-YYYY', { YearsOfExperience: 'Years Of Experience' }, ['Current CTC']).jsonToHtml(json));
