const fs = require('fs');
const path = require('path');

const JsonProcessor = require('../src/jsonProcessor');

const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, './example.json')), 'utf-8');

console.log(new JsonProcessor({
  headerList: ['Phone', 'Attachments', 'PersonCompetency'],
  dateFormat: 'DD-MM-YYYY',
  replaceTextMap: { YearsOfExperience: 'Years Of Experience' },
  excludeKeys: ['Current CTC'],
}).toHtml(json));
