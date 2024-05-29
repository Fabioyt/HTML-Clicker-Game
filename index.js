// import * as maptilersdk from '@maptiler/sdk';
// import * as maptilersdk from "@maptiler/sdk";


let coins = 0
let UpgradePrice = 10
let clickValue = 1
let done = 0;
let coinTxt = document.getElementById("Coin");
let btn = document.getElementById("btnClick");
let UpgradeBtn = document.getElementById("btnUpgrade");
let startLongLat = navigator.geolocation.getCurrentPosition(showCurrentPosition)
let currentOrt = document.getElementById("currentOrt");
let currentCity = "null";
let PosLat;
let PosLong;
async function getCityFromLatLong(lat, long) {
   console.log(lat, long);

fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`, {

}).then(res => res.json())
  .then(res => {
    console.log(res.display_name)
    console.log(res.address)
    console.log(res.address.town)
   
    currentCity = (res.address)
    if(res.address.town)  {
    document.getElementById("currentOrt").innerHTML = (res.address.town + " "+ res.address.country+" "+ res.address.state)}
    else if(res.address.farm) {
        document.getElementById("currentOrt").innerHTML = (res.address.farm + " "+ res.address.country+" "+ res.address.state)
    }
    else if(res.address.road) {
        document.getElementById("currentOrt").innerHTML = (res.address.road + " "+ res.address.country+" "+ res.address.state)
    }
})

    


}

function showCurrentPosition(event) {
    console.log(event.coords.latitude, event.coords.longitude);
    PosLat = event.coords.latitude;
    PosLong = event.coords.longitude;
   currentCity = getCityFromLatLong(event.coords.latitude + coins/ 1000000, event.coords.longitude)
   console.log("currentCity: ", currentCity);
    document.getElementById("currentOrt").innerHTML = (currentCity.town + "");


}
function checkLocalStorage() {
if((localStorage.getItem("coins"))>= 0 ) 
    {
        coins = Math.floor(localStorage.getItem("coins"));
        UpgradePrice = Math.floor(localStorage.getItem("UpgradePrice"));
        clickValue = Math.floor(localStorage.getItem("clickValue"));
        updateText();

        document.getElementById("Coin").innerHTML = ('Distance: ' + Math.round(coins/10) + "m");
        document.getElementById("btnClick").innerHTML = ("Click " + Math.round(clickValue))
        document.getElementById("btnUpgrade").innerHTML = ("&emsp; &emsp; " + Math.round(UpgradePrice / 10))

       

        
    }
}
let ready = true;

function onBtnClick(){
    coins = coins + clickValue;
    updateText();
    saveToLocalStorage();
    
if (ready) {
    console.log("jetzt");
    console.log(PosLat , PosLong);
    getCityFromLatLong((PosLat),PosLong  + (coins / 1000000))
    updateMap();
    ready = false; 

setTimeout(() => {
   ready = true; 
}, 25000);
}


}

function onUpgrade() {
    if(coins >= UpgradePrice) {
        coins = coins - UpgradePrice;
        UpgradePrice = UpgradePrice * 1.25;
        clickValue = clickValue * 1.20;
        saveToLocalStorage();
    }
    document.getElementById("btnUpgrade").innerHTML = ("  Upgrade " + Math.round(UpgradePrice / 10))
    updateText();
    document.getElementById("btnClick").innerHTML = ("Click " + Math.round(clickValue))

}

function updateText() {
    document.getElementById("Coin").innerHTML = ('Distance: ' + Math.round(coins/10) + "m");
    document.getElementById("btnClick").innerHTML = ("Click " + Math.round(clickValue))
    document.getElementById("btnUpgrade").innerHTML = ("&emsp; &emsp; " + Math.round(UpgradePrice))
}

function btnUpgradeSeconds() {

}

function saveToLocalStorage() {
    localStorage.setItem("coins", coins)
        localStorage.setItem("UpgradePrice", UpgradePrice)
        localStorage.setItem("clickValue", clickValue)
}


const key = 'xm3lRZExJOMTGpLRGIAd';

const attribution = new ol.control.Attribution({
  collapsible: false,
});

const source = new ol.source.TileJSON({
  url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
  tileSize: 512,
  crossOrigin: 'anonymous'
});




// let map = new ol.Map({
//   layers: [
//     new ol.layer.Tile({
//       source: source
//     })
//   ],
//   controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
//   target: 'map',
//   view: new ol.View({
//     constrainResolution: true,
//     center: ol.proj.fromLonLat([PosLong,PosLat ]),
//     zoom: 18
//   })
// });

function updateMap() {

    

//    let map = new ol.Map({
//         layers: [
//           new ol.layer.Tile({
//             source: source
//           })
//         ],
//         controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
//         target: 'map',
//         view: new ol.View({
//           constrainResolution: true,
//           center: ol.proj.fromLonLat([PosLong,(PosLat + (coins / 100000)) ]),
//           zoom: 12
//         })
//       });
     

const geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'properties': {},
                'coordinates': [
                    [PosLong, PosLat],
                    [PosLong, (PosLat + (coins / 1000000))]
                ]
            }
        }
    ]
};

var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=xm3lRZExJOMTGpLRGIAd',
    center: [(PosLong+ (coins / 1000000)),(PosLat )],
    zoom: 12,
})



var marker = new maplibregl.Marker().setLngLat([PosLong, PosLat]).addTo(map);

}

// map.current.on('load', () => {
    // map.getCanvas().focus();

    // map.getCanvas().addEventListener(
    //     'keydown',
    //     (e) => {
    //         e.preventDefault();
    //         if (e.which === 38) {
    //             // up
    //             map.panBy([0, -deltaDistance], {
    //                 easing
    //             });
    //         } else if (e.which === 40) {
    //             // down
    //             map.panBy([0, deltaDistance], {
    //                 easing
    //             });
    //         } else if (e.which === 37) {
    //             // left
    //             map.easeTo({
    //                 bearing: map.getBearing() - deltaDegrees,
    //                 easing
    //             });
    //         } else if (e.which === 39) {
    //             // right
    //             map.easeTo({
    //                 bearing: map.getBearing() + deltaDegrees,
    //                 easing
    //             });
    //         }
    //     },
    //     true
    // );
// });

// this.map.panBy([10, -12], {
    // easing
// });

// map.on('idle', function() {
//     console.log('A idle event occurred.');
// });

    