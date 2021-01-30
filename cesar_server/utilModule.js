const fs = require("fs");

// 文字コードUTF-8でファイルを読み込むfunction
exports.readFile = function(filePath) {
    return fs.readFileSync(filePath, "utf-8");
}

// 渡されたJSONファイルを解析する(objectを返す)function
exports.jsonParse = function(filePath) {
    var file = this.readFile(filePath);
    return JSON.parse(file);
}

// 表示するためのhtmlを返すfunction
exports.getHtml = function(filePath, parm) {
    var file = this.readFile(filePath);
    if (parm == "") return file;
    console.log(parm);
    var ejs = require("ejs");
    return ejs.render(file, parm);
}