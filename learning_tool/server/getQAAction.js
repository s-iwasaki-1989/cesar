const baseClasses = require(global.serverPath + "baseClasses.js");
const jsonDataPath = __dirname + "\\QAs.json";


class jsonAction extends baseClasses.baseAction {
//class jsonAction extends actionClass {
    constructor () {
        super("");
    }
    
    // GET通信のロジッククラス取得
    getGLogic() {
        return new getJsonLogic();
    }

    // POST通信のロジッククラス取得。
    getPLogic(form) {
        return new postJsonLogic(form);
    }

    // 表示用のデータ取得
    getData() {
        var strData = "";
        //console.log(this.data);
        return this.data;
    }
    
}

class getJsonLogic extends baseClasses.baseLogic {
    constructor() {
        super(jsonDataPath);
    }

    dealJson() {
        console.log("getメソッド実行");
        return execDealJson(super.dealJson(), 0);
    }
}

class postJsonLogic extends baseClasses.baseLogic {
    constructor(postData) {
        super(jsonDataPath);
        this.postData = postData;
    }

    dealJson() {
        console.log("postメソッド実行");
        return execDealJson(super.dealJson(), this.postData.qno);
    }
}

var jAction = new jsonAction();

exports.b_execute = function(request, form) {
    console.log("readJsonが実行されます");
    jAction.execute(request, form);
}

exports.execute = function(form) {
    console.log("readJsonが実行されます");
    jAction.execute(form);
}

exports.getData = function() {
    return jAction.getData();
}

function execDealJson(obj, currNo) {
    var qNo = getNo(currNo, obj.length - 1);
    
    var question = obj[qNo].question;
    var answer = obj[qNo].answer;
    return {valQNo: qNo, valQuestion: question, valAnswer: answer};
}

function getNo(currNo, maxNo) {
    var rndmNo = Math.random();
    while(rndmNo < 1) {
        rndmNo *= 10;
    }

    rndmNo = Math.round(rndmNo);

    var nextNo = Math.max(currNo, rndmNo) +
     ((rndmNo % 2 == 0) ? -1 : 1) * Math.min(currNo, rndmNo);

    return Math.min(nextNo, maxNo);
}