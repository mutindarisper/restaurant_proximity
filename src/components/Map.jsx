import React from 'react'
import { useState, useEffect, useRef } from 'react'

import "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import  axios from 'axios'

const Map = () => {

    const [baseMaps, setbaseMaps] = useState({})
    let map = useRef(null);
    let current_response = useRef(null)
    let current_point = useRef(null)


    
    const setLeafletMap = () => {
        const mapboxLight =  L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            {
              attribution:
                'Restaurante |Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
              // maxZoom: 18,
              id: "mapbox/light-v11",
              accessToken:
                "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og",
            }
          );
      const mapboxSatellite =  L.tileLayer(
           "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}",
           {
             attribution:
             ' Restaurante | Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      
             id: "mapbox/satellite-v9",
             accessToken:
               "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og",
           }
         );
      
         const mapbox =  L.tileLayer(
           "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
           {
             attribution:
             ' Restaurante | Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
             // maxZoom: 18,
             id: "mapbox/streets-v11",
             accessToken:
               "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og",
           }
         );


         var basemaps_object = {
            MapBoxLight: mapboxLight,
            MapBox: mapbox,
            MapBoxSatellite: mapboxSatellite,
          };
          setbaseMaps(basemaps_object)

    //       var container = L.DomUtil.get('map');
    //   if(container != null){
    //     container._leaflet_id = null;
    //   }

    if (map.current !== undefined && map.current !== null) { map.current.remove(); }//added

           map.current = L.map("map", {
            zoomControl: false,
            layersControl: false,
            center: [-1.3,36.8 ],
            // drawControl: true,
            // minZoom: 6.5,
            // maxZoom: 20,
            zoom: 12,
            // measureControl: true,
            // defaultExtentControl: true,
            layers:[mapbox]
          }); // add the basemaps to the controls
      
          L.control.layers(basemaps_object).addTo(map.current);
    }

    const fetchRestaurants = async () => {
        const API_KEY = '54b25989bdee4b6e866aa6dd9b661791'
        const restaurant_response = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=rect:36.7276,-1.3656,36.9415,-1.2304&limit=100&apiKey=54b25989bdee4b6e866aa6dd9b661791`)
        console.log(restaurant_response.data, 'response')
        current_response.current = restaurant_response.data

        var latlng = restaurant_response.data.features[0].geometry.coordinates
     
    
       
    var markers = L.geoJSON(current_response.current, {

        pointToLayer: function (feature, latlng){
            var rest_icon = new L.icon({
                // iconUrl: "src/assets/restaurant.svg", 
                iconUrl:"https://api.geoapify.com/v1/icon/?type=material&color=%23f15080&icon=restaurant&apiKey=ab9f95db3fa946ef94c87701358bc22d",
                iconSize:     [20, 31], // width and height of the image in pixels
                shadowSize:   [35, 20], // width, height of optional shadow image
                iconAnchor:   [10, 30], // point of the icon which will correspond to marker's location
                shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
                popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
    
          });
          var marker = L.marker(latlng, {icon: rest_icon});
          return marker;

        }

    })
    markers.addTo(map.current)

    
 
        // var coords_lat = restaurant_response.data.features.map((item) =>{
        //     return item.geometry.coordinates[0]
        //     // item.geometry.coordinates[1]

        // } )
        // console.log(coords_lat, 'cords object')

        // var coords_lon = restaurant_response.data.features.map((item) =>{
        //     return item.geometry.coordinates[0]
        //     // item.geometry.coordinates[1]

        // } )
        // console.log(coords_lon, 'cords lon')

        // var rest_marker =  L.marker([coords_lat, coords_lon], {icon: rest_icon});
        // rest_marker.addTo(map.current)
    }





useEffect(() => {
        setLeafletMap()
        
        
    
      
    }, [])

  return (
    <div>

        <div id="map" style={{ height:'100vh', width:'100vw',zIndex:99}}></div>

        <div className="buttons" style={{zIndex:104, position:'absolute', top:'1vh', left:'0.5vw'}}>
            <button type="button" onClick={fetchRestaurants}>Restaurants</button>
        </div>

    </div>
  )
}

export default Map