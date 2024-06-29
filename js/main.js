var map = L.map('map', {
    center: [34.9558, 139.8139],
    zoom: 9,
    zoomControl: false,
    maxZoom: 9,
    minZoom: 1,
});

// 地理院タイル（灰色）を使用
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
}).addTo(map);

// p波マーカー初期化
var pwave = L.circle([0, 0], {
    radius: 0,
    color: 'blue',
    fillColor: '#399ade',
    fillOpacity: 0.5,
}).addTo(map);

// s波マーカー初期化
var swave = L.circle([0, 0], {
    radius: 0,
    color: '#dc143c',
    fillColor: '#dc143c',
    fillOpacity: 0.1,
}).addTo(map);

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
