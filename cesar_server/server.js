global.serverPath = __dirname + "\\";
const mainPage = "/main";
const notFoundPage = serverPath + "\\cesar_view\\NotFound.html";

var aplConfig;
var trgtFile;

const http = require("http");
const url = require("url");
const fs = require("fs");
const util = require("./utilModule.js");

const aplList = getAplList();

const server = http.createServer();
server.on("request", doRequest)
server.listen(8080);

// サーバにリクエストが投げられたら動くfunction
function doRequest(request, response) {
    // 渡されたURLを解析
    var urlFilePath = url.parse(request.url).pathname;
    console.log(urlFilePath);

    // javascriptのalert表示で呼ばれた場合は無視する
    if (urlFilePath == "/favicon.ico") return;

    //var data = "";

    // 判定に使うため、trgtFileはサーバにリクエストが投げられるたびに一度nullにする
    trgtFile = null;

    // アプリケーション変更されていれば、新しくconfigファイルを定義しなおす
    if (isAplChanged(urlFilePath)) {
        let config = getAplConfig(urlFilePath);
        // config==nullだったら、unknownページを表示して終了
        if (config == null) {
            writePage(response, notFoundPage, "");
            return;
        }
        aplConfig = util.jsonParse(config.path);
        console.log("初期化。aplNameとurlが一致。遷移先は" + mainPage);
        setTrgtPage(mainPage);
    }

    // if postだったら→request.on("data", function(data) をやって
    // postされたデータをここで取得する
    if (request.method == "POST") {
        console.log("POSTに入りました");
        var qs = require("querystring");
        var posData = "";

        request.on("data", function(pData) {
            posData += pData;
        });

        request.on("end", function() {
            var form = qs.parse(posData);
            //console.log("渡されてきた値は")
            //console.log(form);
            showTrgtPage(response, form);
        });
    } else {
        showTrgtPage(response);
    }

}

function getAplList() {
    return util.jsonParse(serverPath + "aplList.json");
}

function getAplConfig(url) {
    for (let i in aplList) {
        if (aplList[i].aplName == url) {
            console.log("確認箇所→" + aplList[i].path);
            return aplList[i];
        }
    }
}

function writePage(response, path, parm) {    
    var content = util.getHtml(path, parm);
    response.writeHead(200, {"Content-Type":"text/html"});
    response.write(content);
    response.end();
}

function getActionRsltData(actionPath, form) {
    var acc = require(actionPath);
    acc.execute(form);
    return acc.getData();
}

// アプリケーションが変更されたかどうかの判定処理
function isAplChanged(url) {
    // configファイルが定義されていない場合はアプリケーション変更と判定
    if (aplConfig == null) return true;

    // 現在定義されているconfigファイルのaplNameとurlが一致した場合
    // アプリケーション変更なしと判定
    if (aplConfig.aplName == url) {
        console.log("aplNameとurlが一致。遷移先は" + mainPage);
        setTrgtPage(mainPage);
        return false;
    }

    // 現在定義されているconfigファイルのaplNameとurlが不一致だった場合
    // configファイル内に定義されているページを走査し
    // urlと一致するものがあれば、アプリケーション変更なしと判定
    setTrgtPage(url);
    return (trgtFile == null)
}

// aplConfigに定義されている飛び先ページを設定
function setTrgtPage(url) {
    for (let i in aplConfig.pages) {
        if (aplConfig.pages[i].url != url && aplConfig.pages[i].action?.url != url) continue;
        trgtFile = aplConfig.pages[i];
        return;
    }
}

// 表示用の処理実行
function showTrgtPage(response, form) {
    // trgtFile.action?.urlが設定されているものはまずActionの処理をする
    if (trgtFile.action?.url != null && trgtFile.action.url != "")
        var data = getActionRsltData(trgtFile.action.path, form);
    writePage(response, trgtFile.path, data);
}