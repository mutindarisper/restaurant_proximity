import React from 'react'
import { useState, useEffect, useRef } from 'react'

import "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Select from 'react-select'
import  axios from 'axios'
import my_location from '../assets/my_location.svg'

const Map = () => {



    const [baseMaps, setbaseMaps] = useState({})
    const [tab, setTab] = useState('')
    let map = useRef(null);
    let current_response = useRef(null)
    let current_point = useRef(null)
    let isoline_response = useRef(null)
    let geojson_isoline = useRef(null)
    let geolocation_lat = useRef(null)
    let geolocation_lon = useRef(null)
    let travel_time = useRef(null)
    let distance_ = useRef(null)
    const tabs = ['By travel time', 'By distance']
    const [fontColor, setFontColor] = useState('black');

    const time_options = [
     { value:'2.5 min', label:'2.5 min'},
      {value:'5 min', label:'5 min'},
      {value:'10 min', label:'10 min'},

    ]

    const distance_options = [
      { value:'1 km', label:'1 km'},
       {value:'5 km', label:'5 km'},
       {value:'10 km', label:'10 km'},
 
     ]
     const timeOption = time_options.map( selection => (
      selection
  ))

    const distanceOption = distance_options.map( selection => (
      selection
  ))


    
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

    //geolocation function
    const findMe = () => {
      
      map.current.locate({setView: true, maxZoom: 30});

      const onLocationFound = (e) => {
        var radius = e.accuracy;
        var rest_icon = new L.icon({
                      // iconUrl: "src/assets/my_location.svg", 
                      iconUrl:"https://api.geoapify.com/v1/icon/?type=material&color=%2325a0b0&icon=person&apiKey=ab9f95db3fa946ef94c87701358bc22d",
                      iconSize:     [30, 40], // width and height of the image in pixels
                      shadowSize:   [35, 20], // width, height of optional shadow image
                      iconAnchor:   [15, 39], // point of the icon which will correspond to marker's location
                      shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
                      popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
          
                });
                console.log(e.latlng, 'geoposition latlng')
                geolocation_lat.current = e.latlng.lat
                geolocation_lon.current = e.latlng.lng
    
        L.marker(e.latlng, {icon: rest_icon}).addTo(map.current)
            .bindPopup("You are within " + radius + " meters from this point")
            // .openPopup();
    
        // L.circle(e.latlng, radius).addTo(map.current);
    }
    
    map.current.on('locationfound', onLocationFound);
      

  //     const status = document.querySelector("#status");
  // const mapLink = document.querySelector("#map-link");

  // const success = (position) => {
  //   const latitude = position.coords.latitude;
  //   const longitude = position.coords.longitude;
  //   console.log(position, 'position')

    

  //      var rest_icon = new L.icon({
  //             iconUrl: "src/assets/my_location.svg", 
  //             // iconUrl:"https://api.geoapify.com/v1/icon/?type=material&color=%23f15080&icon=restaurant&apiKey=ab9f95db3fa946ef94c87701358bc22d",
  //             iconSize:     [20, 25], // width and height of the image in pixels
  //             shadowSize:   [35, 20], // width, height of optional shadow image
  //             iconAnchor:   [10, 24], // point of the icon which will correspond to marker's location
  //             shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
  //             popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
  
  //       });
  
  // var marker = L.marker([latitude, longitude], {icon: rest_icon,
  //   setView: true,
  //    maxZoom: 16});
  // marker.addTo(map.current)
  // // map.flyTo(marker.getBounds())

  //   // status.textContent = "";
  //   // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  //   // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  // }

  // const error = () => {
  //   status.textContent = "Unable to retrieve your location";
  // }

  // if (!navigator.geolocation) {
  //   status.textContent = "Geolocation is not supported by your browser";
  // } else {
  //   status.textContent = "Locating…";
  //   navigator.geolocation.getCurrentPosition(success, error);
  // }
    }

    const fetchRestaurants = async () => {
        const API_KEY = '54b25989bdee4b6e866aa6dd9b661791'
        const restaurant_response = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=rect:36.7276,-1.3656,36.9415,-1.2304&limit=100&apiKey=54b25989bdee4b6e866aa6dd9b661791`)
        // console.log(restaurant_response.data, 'response')
        current_response.current = restaurant_response.data

        var latlng = restaurant_response.data.features[0].geometry.coordinates
     
    
       
    var markers = L.geoJSON(current_response.current, {

        pointToLayer: function (feature, latlng){
            var rest_icon = new L.icon({
                // iconUrl: "src/assets/restaurant.svg", 
                iconUrl:"https://api.geoapify.com/v1/icon/?type=material&color=%23f15080&icon=restaurant&apiKey=ab9f95db3fa946ef94c87701358bc22d",
                iconSize:     [20, 25], // width and height of the image in pixels
                shadowSize:   [35, 20], // width, height of optional shadow image
                iconAnchor:   [10, 24], // point of the icon which will correspond to marker's location
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

    const onDistanceChange = (e) => {
      console.log(e.value, 'time')
      const distance = e.value
      if(distance === '1 km'){
        distance_.current = 1000
      }
      if(distance === '5 km'){
        distance_.current = 5000
      }
      if(distance === '10 km'){
        distance_.current = 10000
      }
    }

    const onTimeChange = (e) => {
      console.log(e.value, 'time')
      const time = e.value
      if(time === '2.5 min'){
        travel_time.current = 150
      }
      if(time === '5 min'){
        travel_time.current = 300
      }
      if(time === '10 min'){
        travel_time.current = 900
      }
    }

    const changeFontColor = () => {
      var newColor = 'black'
      if(fontColor === 'black'){
        newColor = '#00688f'
        setFontColor(newColor);

      }
      // const newColor = fontColor === 'black' ? '#00688f' : 'black'; // Toggle between black and red
      
    };
  

   
    const getNearbyRestaurants = async () => {
      if(geojson_isoline.current)map.current.removeLayer(geojson_isoline.current)
      const lat = geolocation_lat.current
      const lon = geolocation_lon.current
      var time = travel_time.current
      var distance = distance_.current
      if(tab === 'By travel time') {
        const response = await axios.get(`https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=time&mode=drive&range=${time}&traffic=approximated&apiKey=45acfe9c47f34a3cb3a5542a4093a147`)
      console.log(response.data)
      isoline_response.current = response.data

      }

      if(tab === 'By distance') {
        const response = await axios.get(`https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=distance&mode=drive&range=${distance}&traffic=approximated&apiKey=45acfe9c47f34a3cb3a5542a4093a147`)
      console.log(response.data)
      isoline_response.current = response.data

      }
      
      geojson_isoline.current = L.geoJSON(isoline_response.current, {
            style: {
              color: "#25a0b0",
              opacity: 1,
              fillOpacity:0.1,
              weight: 4
            }
            // pane: 'pane1000'
          })
          geojson_isoline.current.addTo(map.current)

          map.current.flyToBounds(geojson_isoline.current.getBounds(), {
            padding: [50, 50],
          });
          // var radius = distance_.current

          // L.circle([lat,lon], radius).addTo(map.current);
    }
   
 




useEffect(() => {
        setLeafletMap()
        
        
    
      
    }, [])

  return (
    <div>

        <div id="map" style={{ height:'100vh', width:'100vw',zIndex:99}}></div>

        <div className="buttons" style={{zIndex:104, position:'absolute', top:'1vh', left:'0.5vw', display:'flex', gap:'1rem'}}>
          <div className="find_me" 
          style={{zIndex:104, 
          backgroundColor:'#fff',
           width:'100px', 
           height:'50px', 
           borderRadius:'10px', 
           display:'flex', 
           flexDirection:'row',
           gap:'0.3rem',
           justifyContent:'center',
           cursor:'pointer',
           alignItems:'center',
          fontFamily:'sans-serif'}}
           onClick={findMe}>
            <p>Find Me</p>
          <img src={my_location} alt="" />

          </div>

          
            <button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#fff', cursor:'pointer'}} onClick={fetchRestaurants}>Restaurants</button>
            <button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#fff', cursor:'pointer'}} >Real Estate</button>
            {/* <button type="button" onClick={getNearbyRestaurants}>near me</button> */}
            

            
            
        </div>

        
        <div className="params" style={{fontFamily:'sans-serif',  zIndex:104, position:'absolute', top:'8vh', left:'0.5vw', width:'15vw', height:'30vh', display:'flex', justifyContent:'center', alignItems:'center', paddingTop:'0', flexDirection:'column', gap:'1rem', backgroundColor:'#fff'}}>
          <p style={{fontWeight:'600'}}>Accessibility</p>
          <div className="selections"
          style={{display:'flex',
          flexDirection:'row',
          gap:'1.5rem',
          marginTop:'-2vh',
          marginLeft:'-1vw',
          fontWeight:'600'

          }}>
         
         {
           tabs.map( (tab_) => 
           <p 
           style={{cursor:'pointer',
           color: fontColor,
           borderBottomColor: fontColor 
          //  marginLeft:'-1vw'
          }}
           onClick={  () => {setTab(tab_);changeFontColor()}  }
           >{tab_}</p> )
         }
          </div>
          {
            tab === 'By travel time' ?
            <Select 
        defaultValue={'Max travel time'}
        onChange={onTimeChange}
        options={timeOption}
        placeholder={'Max travel time'}
        />
        :
        <Select 
        defaultValue={'Max distance'}
        onChange={onDistanceChange}
        options={distanceOption}
        placeholder={'Max distance'}
        />

          }

      



<button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#087c70', width:'5vw', height:'3vh', color:'#fff'}} onClick={getNearbyRestaurants}>Find</button>
</div>
        <p id="status"></p>
<a id="map-link" target="_blank"></a>

    </div>
  )
}

export default Map