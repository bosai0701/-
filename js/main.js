function GetyyyyMMddHHmmss(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();

    var month = (today.getMonth() + 1).toString();
    month = ("0" + month).slice(-2);

    var day = today.getDate().toString();
    day = ("0" + day).slice(-2);

    var hour = today.getHours().toString();
    hour = ("0" + hour).slice(-2);

    var minute = today.getMinutes().toString();
    minute = ("0" + minute).slice(-2);

    var second = today.getSeconds().toString();
    second = ("0" + second).slice(-2);

    return year + month + day + hour + minute + second;
}

function GetyyyyMMdd(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();

    var month = (today.getMonth() + 1).toString();
    month = ("0" + month).slice(-2);

    var day = today.getDate().toString();
    day = ("0" + day).slice(-2);

    return year + month + day;
}

var map = L.map('map', {
    center: [36.2048, 138.2529], // 日本の中心地 (例: ここでは長野市の座標)
    zoom: 6,
    zoomControl: false,
    maxZoom: 9,
    minZoom: 1,
    maxBounds: L.latLngBounds(
        L.latLng(20.0, 122.0), // 日本の南西端の座標 (例: 沖縄周辺)
        L.latLng(45.0, 153.0)  // 日本の北東端の座標 (例: 北海道周辺)
    )
});

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

// 以下の部分は地震波のマーカーの初期化コード
var pwave = L.circle([0, 0], {
    radius: 0,
    color: 'blue',
    fillColor: '#399ade',
    fillOpacity: 0.5,
}).addTo(map);

var swave = L.circle([0, 0], {
    radius: 0,
    color: '#dc143c',
    fillColor: '#dc143c',
    fillOpacity: 0.1,
}).addTo(map);

// 地図の更新を行う関数
function updateMap() {
    $.when(
        $.getJSON(`https://weather-kyoshin.west.edge.storage-yahoo.jp/RealTimeData/${GetyyyyMMdd()}/${GetyyyyMMddHHmmss()}.json?${new Date().getTime()}`)
    ).done(function (yahoo_data) {
        if (yahoo_data.psWave === null) {
            swave.setRadius(0);
            pwave.setRadius(0);
            return;
        }
        let p = yahoo_data.psWave.items[0].pRadius * 1000;
        let s = yahoo_data.psWave.items[0].sRadius * 1000;

        let lat = yahoo_data.psWave.items[0].latitude.replace("N", "");
        let lng = yahoo_data.psWave.items[0].longitude.replace("E", "");
        let psCenter = new L.LatLng(lat, lng);

        swave.setLatLng(psCenter);
        swave.setRadius(s);
        pwave.setLatLng(psCenter);
        pwave.setRadius(p);
    }).fail(function () {
        console.log("error");
    });
}

$(function () {
    // 初回の更新
    updateMap();
    // 1秒ごとに更新
    setInterval(updateMap, 1000);
});
