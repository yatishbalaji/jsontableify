const moment = require('moment');

function isValidDate(date) {
    const regExp = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');

    return regExp.test(date);
}

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

function convert(key) {
    return capitalize(key.replace(/([a-z])([A-Z])/g, '$1 $2'));
}

class Jsontableify {
    /**
     * 
     * @param {object} config Options allow editing of information in html
     * @param {array} config.headerList Level 1 headers for the returned table
     * @param {string} config.dateFormat Date format is displayed in the table
     * @param {object} config.replaceTextMap Override the text contained in the return table
     * @param {array} config.excludeKeys Remove sensitive fields from the return table
     * @param {array} config.embeds Embed the code into the returned html
     */
    constructor(config = {}) {
        const defaultConfig = {
            headerList : [],
            dateFormat : 'DD-MM-YYYY',
            replaceTextMap : {},
            excludeKeys : [],
            embeds : [],
        };

        Object.assign(this, defaultConfig, config);
    }

    /**
     * @private
     */
    toDate(date) {
        return moment(new Date(date)).format(this.dateFormat);
    }

    /**
     * @private
     */
    jsonToHtml(obj, columns, parentsTmp) {
        const buf = [];
        const type = typeof obj;
        let cols;

        const parents = parentsTmp || [];

        if (!(type !== 'object' || obj == null || obj === undefined)) {
            // eslint-disable-next-line no-bitwise
            if (~parents.indexOf(obj)) {
                return '[Circular]';
            }

            parents.push(obj);
        }

        if (Array.isArray(obj)) {
            if (Array.isArray(obj[0]) && obj.every(Array.isArray)) { // array of array
                buf.push('<table>', '<tbody>');
                cols = [];

                obj.forEach((row, ix) => {
                    cols.push(ix);

                    row.forEach((val) => {
                        buf.push('<tr><td>', this.jsonToHtml(val, cols, parents), '</td></tr>');
                    });
                });

                buf.push('</tbody>', '</table>');
            } else if (typeof obj[0] === 'object') { // array of objects
                const tmpBuf = [];
                let isNodeEmpty = true;
                tmpBuf.push('<table>', '<tbody>');
                tmpBuf.push('<tr><td>');

                obj.forEach((o, i) => {
                    if (typeof o === 'object' && !Array.isArray(o)) {
                        if (i && !isNodeEmpty) tmpBuf.push('<hr/>');

                        tmpBuf.push('<table>');
                        Object.keys(o)
                            .filter(x => (!this.excludeKeys.includes(x)))
                            .forEach((k) => {
                                const val = o[k];

                                if (val) {
                                    isNodeEmpty = false;
                                    let label = this.replaceTextMap[k] ? this.replaceTextMap[k] : k;
                                    label = convert(label);

                                    tmpBuf.push('<tr><th>', label, '</th>');
                                    tmpBuf.push(
                                        '<td>',
                                        isValidDate(val) ? this.toDate(val) : this.jsonToHtml(val, cols, parents),
                                        '</td></tr>',
                                    );
                                }
                            });
                        tmpBuf.push('</table>');
                    }
                });

                tmpBuf.push('</td></tr>', '</tbody></table>');

                if (!isNodeEmpty) {
                    buf.push(...tmpBuf);
                }
            } else { // array of primitives
                buf.push('<table>', '<tbody>');
                cols = [];

                obj.forEach((val, ix) => {
                    cols.push(ix);
                    buf.push('<tr>', '<td>', this.jsonToHtml(val, cols, parents), '</td>', '</tr>');
                });

                buf.push('</tbody>', '</table>');
            }
        } else if (
            obj && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)
        ) { // object
            const tmpBuf = [];
            let isNodeEmpty = true;

            if (!columns) {
                tmpBuf.push('<table>');
                if (obj.type === 'link') {
                    isNodeEmpty = false;
                    let files = obj.value;

                    if (!Array.isArray(files)) {
                        files = [files];
                    }

                    tmpBuf.push('<td><table>');

                    // eslint-disable-next-line no-restricted-syntax
                    for (const { link, name } of files) {
                        tmpBuf.push('<tr><td>');
                        tmpBuf.push(`<a href='${link}' target='_blank'>${name}</a></td></tr>`);
                    }

                    tmpBuf.push('</table></td>');
                } else {
                    const keys = Object.keys(obj)
                        .filter(x => (!this.excludeKeys.includes(x)));

                    // eslint-disable-next-line no-restricted-syntax
                    for (const key of keys) {
                        let label = this.replaceTextMap[key] ? this.replaceTextMap[key] : key;
                        label = convert(label);

                        if (key === 'link') {
                            isNodeEmpty = false;
                            const files = obj[key];

                            tmpBuf.push(
                                "<tr class='no-break'><th>",
                                label,
                                '</th>',
                                '<td><table>',
                            );

                            // eslint-disable-next-line no-restricted-syntax
                            for (const { link, name } of files) {
                                tmpBuf.push('<tr><td>');
                                tmpBuf.push(`<a href='${link}' target=_blank'>${name}</a>`);
                                tmpBuf.push('</td></tr>');
                            }

                            tmpBuf.push('</table></td></tr>');
                        } else {
                            const x = this.jsonToHtml(obj[key], false, parents);

                            if (x) {
                                isNodeEmpty = false;

                                if (this.headerList.includes(key)) {
                                    tmpBuf.push(
                                        "<tr class='allow-break'>",
                                        "<tr><th class='thead' colspan=2>", label, '</th></tr></td>',
                                        '<td colspan=2>', x, '</td>',
                                        '</tr>',
                                    );
                                } else {
                                    tmpBuf.push(
                                        "<tr class='no-break'><th>",
                                        label,
                                        '</th><td>', x, '</td></tr>',
                                    );
                                }
                            }
                        }
                    }
                }

                tmpBuf.push('</table>');

                if (!isNodeEmpty) {
                    buf.push(...tmpBuf);
                }
            } else {
                columns.forEach((key) => {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        buf.push('<td>', this.jsonToHtml(obj[key], false, parents), '</td>');
                    } else {
                        buf.push('<td>', this.jsonToHtml(obj[key], columns, parents), '</td>');
                    }
                });
            }
        } else if (isValidDate(obj)) {
            buf.push(this.toDate(obj));
        } else {
            buf.push(obj);
        }

        if (!(type !== 'object' || obj == null || obj === undefined)) {
            parents.pop(obj);
        }

        return buf.join('');
    }

    /**
     * Convert json/jsobject to html
     * @param {object} obj The data used to display as html 
     */
    toHtml(obj) {
        var embedCode = this.embeds.join('\n');
        const html = embedCode + this.jsonToHtml(obj);
        return html;
    }
}

module.exports = Jsontableify;
