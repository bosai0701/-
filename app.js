// クライアントID
const clientId = 'dj00aiZpPWZpcHl1U3JWU2lxYyZzPWNvbnN1bWVyc2VjcmV0Jng9ODE-';

// 地図の初期設定
const map = L.map('map').setView([35.6895, 139.6917], 5); // 東京を中心に

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 強震モニタAPIからデータを取得
async function fetchEarthquakeData() {
    const response = await fetch(`https://map.yahooapis.jp/OpenLocalPlatform/V1/FireInformation?appid=${clientId}`);
    const data = await response.json();
    return data;
}

// データを地図に表示
async function displayEarthquakeData() {
    const data = await fetchEarthquakeData();

    data.Feature.forEach(feature => {
        const [lng, lat] = feature.Geometry.Coordinates.split(',').map(Number);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>震度:</b> ${feature.Property.Shindo}`);
    });
}

// 地図にデータを表示
displayEarthquakeData();
