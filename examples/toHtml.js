const fs = require('fs');
const path = require('path');

const Jsontableify = require('../src/jsontableify');

const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, './example.json')), 'utf-8');

console.log(new Jsontableify({
  headerList: ['Phone', 'Attachments', 'PersonCompetency'],
  dateFormat: 'DD-MM-YYYY',
  replaceTextMap: { YearsOfExperience: 'Years Of Experience' },
  excludeKeys: ['Current CTC'],
}).toHtml(json));
