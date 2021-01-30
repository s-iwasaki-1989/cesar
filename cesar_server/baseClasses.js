// 呼び出し元クラス
// 各アプリケーションにて使用するActionメソッドはexport default classの形でこれを継承すること
//class baseAction {
exports.baseAction = class {
    constructor (data) {
        this.data = data;
    }

    // GET通信のロジッククラス取得。使用する場合は継承先でオーバライドすること
    getGLogic() {
        return baseLogic("");
    }

    // POST通信のロジッククラス取得。使用する場合は継承先でオーバライドすること
    getPLogic(form) {
        return baseLogic("");
    }

    // 基本、このメソッドは継承先でオーバーライドしない想定
    // crtServerで呼び出す為のメソッド
    b_execute(request, form) {
        var logic = (request.method == "GET") ? 
            this.getGLogic() : this.getPLogic(form);
        this.data = logic.dealJson();
    }
    execute(form) {
        var logic = (form === undefined) ? 
            this.getGLogic() : this.getPLogic(form);
        this.data = logic.dealJson();
    }

    // 表示用のデータ取得
    getData() {
        return this.data;
    }

    // postされたデータの取得
    getPostData(request) {
        var qs = require("querystring");
        var posData = "";
        request.on("data", function(data) {
            posData += data;
        })
        return qs.parse(posData);
    }
}

// Actionクラスから呼ばれるLogicクラス。JSONに対する処理を継承先で実装
// GET通信、POST通信でクラスを分けること
//class baseLogic {
exports.baseLogic = class {
    constructor(path) {
        this.path = path;
    }

    getObject() {
        var util = require("./utilModule.js");
        return util.jsonParse(this.path);
    }

    dealJson() {
        return this.getObject();
    }
}
