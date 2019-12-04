# JSON to Table (HTML)

### Install
Install via npm
`npm install jsontableify`

### Include

`const Jsontableify = require('jsontableify')`

### Features
* `toHTML(<json_object>)`: converts json to html code
## Usage

```
const { html } = new JsonProcessor({
  headerList: ['Phone', 'Attachments', 'PersonCompetency'], // optional
  dateFormat: 'DD-MM-YYYY', // optional
  replaceTextMap: { YearsOfExperience: 'Years Of Experience' }, // optional
  excludeKeys: ['Current CTC'], // optional
}).toHtml(<JSON object>)
```

### Example
```
{
  "CandidateName": "Yatish Balaji",
  "YearsOfExperience": 3,
  "Current CTC": 10,
  "Expected CTC": 25.0,
  "Address": {
    "CountryCode": "India",
    "Leaving from": "12-11-2017",
    "Leaved Till": "2019-11-06T07:00:30.103Z"
  },
  "Phone": [
    {
      "Number": "8828558654",
      "Label": "personal",
      "Preferred": "primary"
    },
    {
      "Number": "8828558123",
      "Label": "official"
    }
  ],
  "PersonCompetency": [
    {
      "CompetencyName": "Java",
      "Synonyms": [
        "sr j2ee resource",
        "java stack",
        "jpa",
        "advance java"
      ]
    },
    {
      "CompetencyName": "AWS",
      "Synonyms": [
        "aws",
        "amazon webservice",
        "amazon web service"
      ]
    }
  ],
  "Attachments": {
    "type": "link",
    "value": [
      {
        "name": "Quezx Posh",
        "link": ["https://www.quezx.com/safeplace/"]
      },
      {
        "name": "Quezx Posh Attacment",
        "link": ["https://www.quezx.com/safeplace/"]
      }
    ]
  }
}
```
will convert into table like

![JsonTableify](https://photos.app.goo.gl/DXgnRCC1XXFJR75g8)


> CSS for HTML code is present in `examples/toHtml.css`