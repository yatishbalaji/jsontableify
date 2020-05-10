# JSON to Table (HTML)

### Install

`npm i jsontableify`

### Features
* `toHTML(<json_object>)`: converts json to html code.
  * Format Date (Configurable formatting)
  * Embed Links
  * complex data in json/jsobject format
  * Labels get capitalized
  * Hide few labels from table
  * Replace text
  * Define section headers / main json keys
  * Embed code

## Usage

**Example:**

```js
const Jsontableify = require('jsontableify');

var jsonData = {"CandidateName":"Yatish Balaji","YearsOfExperience":3,"Current CTC":10,"Expected CTC":25.0,"Address":{"CountryCode":"India","Leaving from":"12-11-2017","Leaved Till":"2019-11-06T07:00:30.103Z"},"Phone":[{"Number":"8828558654","Label":"personal","Preferred":"primary"},{"Number":"8828558123","Label":"official"}],"PersonCompetency":[{"CompetencyName":"Java","Synonyms":["sr j2ee resource","java stack","jpa","advance java"]},{"CompetencyName":"AWS","Synonyms":["aws","amazon webservice","amazon web service"]}],"Attachments":{"type":"link","value":[{"name":"Quezx Posh","link":["https://www.quezx.com/safeplace/"]},{"name":"Quezx Posh Attacment","link":["https://www.quezx.com/safeplace/"]}]}};

const html = new Jsontableify({
  headerList: ['Phone', 'Attachments', 'PersonCompetency'], // optional - will be shown as level 1 header to table
  dateFormat: 'DD-MM-YYYY', // optional - date format to be converted to if date found
  replaceTextMap: { YearsOfExperience: 'Years Of Experience' }, // optional - key will be replaced by its value
  excludeKeys: ['Current CTC'], // optional - these fields will not be displayed
  embeds: [
    `<link rel="stylesheet" type="text/css" href="https://gitcdn.link/repo/yatishbalaji/jsontableify/master/examples/toHtml.css">`
  ], // optional - embed code into html response
}).toHtml(jsonData)

console.log(html);
```

## Reference
```ts
function constructor( options: object ) : this
```
Used to convert jsobject/json to html and enable features
|properties|type|description|
|---|---|---|
|headerList|array(string)|Level 1 headers for the returned table|
|dateFormat|string|Date format is displayed in the table|
|replaceTextMap|object(string, string)|Override the text contained in the return table|
|excludeKeys|array(string)|Remove sensitive fields from the return table|
|embeds|array(string)|Embed the code into the returned html|

```ts
function toHtml( obj: object ) : string 
```
Convert input object to dist html
|properties|type|description|
|---|---|---|
|obj|any|data object in json/object/array format|

### Output

HTML preview result

![JsonTableify](examples/toHtml.png)

### Templates
> Note : you can use [GitCDN](https://gitcdn.link/) to receive CDN link from git repo. another themes was stored in `/themes` dir 

- classic theme : https://gitcdn.link/repo/yatishbalaji/jsontableify/master/themes/classic.css

### For fun :))
If you feel useful, please contribute and build this library with other interfaces and features
