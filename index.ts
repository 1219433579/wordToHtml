let fs = require("node-fs")
let AdmZip = require('adm-zip-iconv')
var mammoth = require("mammoth");
let path = require('path');
import fileDisplay from './fileDisplay';
const _ = require('underscore');
const template = require('./template');
// let zip = new AdmZip('./word/zip.zip');


function transformElement(element:any) {
    if (element.children) {
        var children = _.map(element.children, transformElement);
        element = { ...element, children: children };
    }
    if (element.type === 'paragraph') {
        element = transformParagraph(element);
    }
    return element;
}

function transformParagraph(element: { alignment: string; styleId: any; }) {
    if (element.alignment === 'center' && !element.styleId) {
        return { ...element, styleName: 'center' };
    } else {
        return element;
    }
}


var options = {
    styleMap: ['u => u', "p[style-name='center'] => p.center"],
    transformDocument: transformElement,
};


var filePath = path.resolve(`E:\\程序设计\\nodeJs word转富文本\\word`);
let extractAllTo = new fileDisplay(filePath)

extractAllTo.start((res) => {
    let filePath = res as string;

    let name = filePath.split('.');

    // console.log(filePath)
    if (name[1] == 'docx') {
        mammoth.convertToHtml({ path: filePath, options })
            .then((result: { value: any; messages: any; }) => {
                var html = result.value; // The generated HTML
                var messages = result.messages; // Any messages, such as warnings during conversion
                console.log(html, messages);

                fs.writeFile(name[0] + '.html', template(html), (res:any) => {
                    console.log('文件写入成功：');
                });
            })
            .done();

    }
})
