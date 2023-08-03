import React from 'react'
import { useState, useEffect, useRef } from 'react'

import "leaflet"
import L, { latLng, polyline } from "leaflet"
import * as turf from '@turf/turf'
import * as wkt from 'wkt'
import "leaflet/dist/leaflet.css"
// import buffer from "@turf/buffer"
import Select from 'react-select'
import  axios from 'axios'
import my_location from '../assets/my_location.svg'
import car from '../assets/car.png'
import bus from '../assets/bus.png'
import motor from '../assets/motor.png'
import walk from '../assets/walk.png'
import '../index.css'

const Map = () => {



    const [baseMaps, setbaseMaps] = useState({})
    const [tab, setTab] = useState('')
    let map = useRef(null);
    let current_response = useRef(null)
    let point_response = useRef(null)
    let road_response = useRef(null)
    let current_county = useRef(null)
    let current_point = useRef(null)
    let isoline_response = useRef(null)
    let geojson_isoline = useRef(null)
    let global_locat = useRef(null)
    let geolocation_lat = useRef(null)
    let geolocation_lon = useRef(null)
    let travel_time = useRef(null)
    let distance_ = useRef(null)
    let roads = useRef(null)
    let polygon_buffer = useRef(null)
    let constituency_response = useRef(null)
    let current_constituency = useRef(null)

    let condition_response = useRef(null)
    const tabs = ['By travel time', 'By distance']
    const [fontColor, setFontColor] = useState('black');
    const [mode, setMode] = useState('')
    const [modecolor, setmodecolor] = useState()
    const [query_method, setQuery_method] = useState(null)
    const [buffer_value, setbuffer_value] = useState('')

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
     
    const data_options = [
      { value:'roads', label:'roads'},
       {value:'points', label:'points'},
       {value:'Constituencies', label:'Constituencies'},
 
     ]

     const query_options = [
      { value:'Buffer', label:'Buffer'},
       {value:'Intersect', label:'Intersect'},
       {value:'Completely Within', label:'Completely Within'},
 
     ]
     const timeOption = time_options.map( selection => (
      selection
  ))

    const distanceOption = distance_options.map( selection => (
      selection
  ))
  const dataOption = data_options.map( selection => (
    selection
))

const queryOption = query_options.map( selection => (
  selection
))



    
    const setLeafletMap = () => {


   const osm =   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
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
            OSM: osm,
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
            zoom: 11.5,
            // measureControl: true,
            // defaultExtentControl: true,
            layers:[mapbox]
          }); // add the basemaps to the controls
      
          L.control.layers(basemaps_object).addTo(map.current);
    }

    const fetchBoundary = async () => {
      const response = await axios.get('https://api.geoapify.com/v1/boundaries/part-of?id=51b39a4e810a6e4240592d785a424cc5f4bff00101f90148278c00000000009203074e6169726f6269&geometry=geometry_1000&apiKey=45acfe9c47f34a3cb3a5542a4093a147')
      current_response.current = response.data

         current_county.current = L.geoJSON(current_response.current, {
            style: {
              color: "black",
              opacity: 1,
              fillOpacity:0,
              weight: 3
            }
            // pane: 'pane1000'
          })
          // map.current.flyToBounds(current_county.current.getBounds(), {
          //   padding: [50, 50],
          // });
          current_county.current.addTo(map.current)
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
              global_locat.current = e.latlng
                geolocation_lat.current = e.latlng.lat
                geolocation_lon.current = e.latlng.lng
    
      var myLocation =  L.marker(e.latlng, {draggable: true, icon: rest_icon}).addTo(map.current)
      
      
            .bindPopup("You are within " + radius + " meters from this point")
           

            var newPos = [myLocation.getLatLng().lat, myLocation.getLatLng().lng];
      
            const onDragEnd = () => {
              newPos = [myLocation.getLatLng().lat, myLocation.getLatLng().lng]; //the dragged position becomes the new position
              console.log(newPos, 'new position');

              global_locat.current = newPos
              geolocation_lat.current = myLocation.getLatLng().lat
              geolocation_lon.current = myLocation.getLatLng().lng
            
              }
              myLocation.on('dragend', onDragEnd );

            
            // .openPopup();
    
        // L.circle(e.latlng, radius).addTo(map.current);
    }
    
    map.current.on('locationfound', onLocationFound);
    
    

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

    
  // }

  // const error = () => {
  //   alert("<Sorry, your browser does not support Geolocation");
  // }

  // if (!navigator.geolocation) {
  //   alert("Sorry, your browser does not support Geolocation");
  // } else {
  //   alert("Locating...");
  //   navigator.geolocation.getCurrentPosition(success, error); //also not accurate
  // }
    }

    const fetchRestaurants = async () => {
        const API_KEY = '54b25989bdee4b6e866aa6dd9b661791'
        const restaurant_response = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=rect:36.7276,-1.3656,36.9415,-1.2304&limit=100&apiKey=54b25989bdee4b6e866aa6dd9b661791`)
        console.log(restaurant_response.data, 'response')
        point_response.current = restaurant_response.data

        var latlng = restaurant_response.data.features[0].geometry.coordinates
     
    
       
    var markers = L.geoJSON(point_response.current, {

        pointToLayer: function (feature, latlng){
          // console.log(feature, 'featre')
            var rest_icon = new L.icon({
                // iconUrl: "src/assets/restaurant.svg", 
                iconUrl:"https://api.geoapify.com/v1/icon/?type=material&color=%23f15080&icon=restaurant&apiKey=ab9f95db3fa946ef94c87701358bc22d",
                iconSize:     [20, 25], // width and height of the image in pixels
                shadowSize:   [35, 20], // width, height of optional shadow image
                iconAnchor:   [10, 24], // point of the icon which will correspond to marker's location
                shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
                popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
    
          });
          var marker = L.marker(latlng, {icon: rest_icon}).bindTooltip(`<strong> Name:  </strong> ${feature.properties.name} `).openTooltip();
          return marker;

        }

    })
    markers.addTo(map.current)

    
 
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

   //for spatial queries
   //roads data
   const fetchData = async (e) => {
    console.log(e.value, 'query data')
   var data_option = e.value

   if(roads.current)map.current.removeLayer(roads.current)
   if(current_constituency.current)map.current.removeLayer(current_constituency.current)

   if(data_option === 'roads'){
    if(roads.current)map.current.removeLayer(roads.current)
    const response = await axios.get('http://localhost:8005/geoserver/Nairobi_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Nairobi_data%3ANairobi_roads&maxFeatures=50&outputFormat=application%2Fjson')
    console.log(response.data, 'roads data')
    road_response.current = response.data

    roads.current = L.geoJSON(road_response.current, {
      style: {
        color: "#ee7245",
        opacity: 1,
        fillOpacity:0.1,
        weight: 3
      }
      // pane: 'pane1000'
    })
    roads.current.addTo(map.current)
   }

   
   if(data_option === 'Constituencies'){
    if(current_constituency.current)map.current.removeLayer(current_constituency.current)
    const response = await axios.get('http://localhost:8005/geoserver/Nairobi_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Nairobi_data%3Anairobi_constinuencies&maxFeatures=50&outputFormat=application%2Fjson')
    console.log(response.data, 'adm4 data')
    constituency_response.current = response.data

    
    current_constituency.current = L.geoJSON(constituency_response.current, {
      style: {
        color: "#c850f2",
        opacity: 1,
        fillOpacity:0,
        weight: 3
      }
      // pane: 'pane1000'
    })
    current_constituency.current.addTo(map.current)
   }
   
   
    
    



   }


   const fetchRoad = async () => {
    const response = await axios.get('http://localhost:8005/geoserver/Nairobi_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Nairobi_data%3Acondition&maxFeatures=50&outputFormat=application%2Fjson')
    condition_response.current = response.data

    roads.current = L.geoJSON(condition_response.current, {
      style: {
        color: "#ee7245",
        opacity: 1,
        fillOpacity:0.1,
        weight: 3
      }
      // pane: 'pane1000'
    })
    roads.current.addTo(map.current)
   }
   const queryChange = (e) => {
      
      console.log(e.value)
      setQuery_method(e.value)

   }
   const onInputChange = (e) => {
    console.log(e.target.value, 'range value')
    setbuffer_value(e.target.value)
   }

   const runQuery = () => {

    //buffer query
    if(query_method === 'Buffer') {
      var road = road_response.current
      var constituencies = constituency_response.current
      if(polygon_buffer.current)map.current.removeLayer(polygon_buffer.current)
      
      var polygon = turf.buffer(road, buffer_value, {
        units: 'meters'
      });
  
     polygon_buffer.current =  L.geoJSON(polygon, {
        style: function(feature) {
          return {
            color: '#80cdc1'
          };
        }
      })
      polygon_buffer.current.addTo(map.current);

    }
  
    //intersect query

    if(query_method === 'Intersect') {
      var restaurants = point_response.current
    var constituencies = constituency_response.current



    // console.log(constituencies.features, 'constituencies')
    var geometry_object = constituencies.features.map((item) => {
      return item.geometry
    })

    
    // console.log(geometry_object, 'geometry object')
  
    var str = wkt.stringify(geometry_object[0])
    console.log(str, 'str')
    // const multiPolygon = turf.multiPolygon([[[[36.82788086 -1.27367997, 36.82857132 -1.274997, 36.82923126 -1.27671099, 36.82886887 -1.27830899, 36.82817841 -1.28018904, 36.82743835 -1.28133595, 36.82690048 -1.28278995, 36.82653046 -1.28380203, 36.82624054 -1.28551805, 36.82543182 -1.28676403, 36.82455826 -1.28755105, 36.82347107 -1.28727305, 36.82196045 -1.28682399, 36.82004166 -1.28637505, 36.81829834 -1.28565705, 36.81726074 -1.28487301, 36.81568146 -1.28442395, 36.81394958 -1.28456998, 36.81301117 -1.28414798, 36.81029892 -1.28243601, 36.80879974 -1.28226805, 36.8071785 -1.28136802, 36.80635071 -1.280779, 36.80500031 -1.28023195, 36.80572128 -1.27893996, 36.80614853 -1.27769399, 36.80683899 -1.27633095, 36.8081398 -1.27547801, 36.81050873 -1.27528703, 36.81298065 -1.27469599, 36.813797 -1.27482903, 36.81457901 -1.27495396, 36.817379 -1.27492404, 36.81961823 -1.27450502, 36.8225708 -1.27403104, 36.82472992 -1.27371204, 36.82666016 -1.27313995, 36.8271904 -1.27269804, 36.82788086 -1.27367997]]]]);
    var road = condition_response.current

    var polygon = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "coordinates": [
              [
                [
                  36.780416259494814,
                  -1.3148432772835434
                ],
                [
                  36.780416259494814,
                  -1.330197051947124
                ],
                [
                  36.79642077229363,
                  -1.330197051947124
                ],
                [
                  36.79642077229363,
                  -1.3148432772835434
                ],
                [
                  36.780416259494814,
                  -1.3148432772835434
                ]
              ]
            ],
            "type": "Polygon"
          }
        }
      ]
    }



    


    var mylocat = global_locat.current

   var ttt =  L.geoJSON(intersect, {
      style: {
        color: "#66b7fe",
        opacity: 1,
        fillOpacity:0.7,
        weight: 2
      }
    })


    var intersect = turf.intersect( polygon.coordinates, road)
    var intersectLayer = L.geoJSON(intersect, {
      style: {
        color: "#66b7fe",
        opacity: 1,
        fillOpacity:0.7,
        weight: 2
      }
    })
    intersectLayer.addTo(map.current)

    }

    

    

   }

   const clearQuery = () => {
    if(polygon_buffer.current)map.current.removeLayer(polygon_buffer.current)
   }

   
    const getNearbyRestaurants = async () => {
      if(geojson_isoline.current)map.current.removeLayer(geojson_isoline.current)
      const lat = geolocation_lat.current
      const lon = geolocation_lon.current
      var time = travel_time.current
      var distance = distance_.current
      console.log(mode, 'mode')
      if(tab === 'By travel time') {
        const response = await axios.get(`https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=time&mode=${mode}&range=${time}&traffic=approximated&apiKey=45acfe9c47f34a3cb3a5542a4093a147`)
      console.log(response.data)
      isoline_response.current = response.data

      }

      if(tab === 'By distance') {
        const response = await axios.get(`https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=distance&mode=${mode}&range=${distance}&traffic=approximated&apiKey=45acfe9c47f34a3cb3a5542a4093a147`)
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
        fetchBoundary()
        
        
    
      
    }, [])
  //   useEffect(() => {
  //     // setLeafletMap()
  //     // fetchBoundary()
      
      
  
    
  // }, [query_method])

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
            <button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#fff', cursor:'pointer'}} onClick={fetchRoad}>Real Estate</button>
            {/* <button type="button" onClick={getNearbyRestaurants}>near me</button> */}
            

            
            
        </div>

        
        <div className="params" style={{fontFamily:'sans-serif',  zIndex:104, position:'absolute', top:'8vh', left:'0.5vw', width:'17vw', height:'30vh', display:'flex', justifyContent:'center', alignItems:'center', paddingTop:'0', flexDirection:'column', gap:'1rem', backgroundColor:'#fff'}}>
          <p style={{fontWeight:'600'}}>Accessibility</p>

          <div className="means" style={{ display:'flex',flexDirection:'row', gap:'1rem',  backgroundColor:'#f7f7f7', width:'200px', justifyContent:'space-evenly',
           paddingLeft:'20px',  paddingRight:'20px', paddingBottom:'10px',  paddingTop:'10px', borderRadius:'10px'}}>
            {/* <div style={{borderRightColor:'red'}}> */}
            <img src={car} alt="" style={{height:'25px', width:'25px', padding:'2px', backgroundColor: mode === 'drive' ? modecolor : '' }}  onClick={ () => { setMode('drive');setmodecolor('#d9dcd6') }}/>
            <div style={{borderRight:' #9a9d98 2px solid',}}></div>
            {/* </div> */}
            
            
            <img src={bus} alt=""  style={{height:'19px', width:'25px', marginTop:'2px', padding:'2px', backgroundColor: mode === 'bus' ? modecolor : ''  }} onClick={ () => { setMode('bus');setmodecolor('#d9dcd6') }}/>
            <div style={{borderRight:' #9a9d98 2px solid',}}></div>
            <img src={motor} alt=""  style={{height:'25px', width:'25px',padding:'2px',  backgroundColor: mode === 'motorcycle' ? modecolor : ''}} onClick={ () => { setMode('motorcycle');setmodecolor('#d9dcd6') }}/>
            <div style={{borderRight:' #9a9d98 2px solid',}}></div>
            <img src={walk} alt="" 
            
             style={{height:'25px', width:'25px', padding:'2px', backgroundColor: mode === 'walk' ? modecolor : ''  }} onClick={ () => { setMode('walk');setmodecolor('#d9dcd6') }}/>

          </div>
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

      



<button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#087c70',
 width:'5vw', height:'3vh', color:'#fff'}} onClick={getNearbyRestaurants}>Find</button>
</div>
        
        <div className="spatial" 
        style={{ backgroundColor:'#fff', 
        height:'40vh', 
        width:'17vw', 
        zIndex:104, 
        position:'absolute',
         top:'40vh', 
         left:'0.5vw',
          display:'flex',
          // justifyContent:'center',
          // alignItems:'center'
          }}>
          <div className="spatial_queries" 
          style={{fontFamily:'sans-serif',
          height:'40vh', 
        width:'17vw',
          fontWeight:'bold',
          display:'flex',
          justifyContent:'center',
          marginTop:'3vh',
          // alignItems:'center'

         }}> Spatial Queries</div>
         

              <div className="query_data"
              style={{ 
                width:'150px', 
              // height:'30px',
               outline:'none',
               border:'none', 
               borderRadius:'10px',
                // backgroundColor:'#eee',
                marginTop:'7vh',
                marginLeft:'-15vw',
                 cursor:'pointer'}}>

<p style={{fontFamily:'sans-serif',
          // height:'40vh', 
        // width:'17vw',
          fontWeight:'bold',
          // display:'flex',
          // justifyContent:'center',
          // marginTop:'3vh',
          // alignItems:'center'

         }} >Select data</p>

<Select 

defaultValue={'Roads'}
onChange={fetchData}
options={dataOption}
placeholder={'Roads'}
/>

<p
style={{fontFamily:'sans-serif',
// height:'40vh', 
// width:'17vw',
fontWeight:'bold',
// display:'flex',
// justifyContent:'center',
// marginTop:'3vh',
// alignItems:'center'

}}>Select query</p>

<Select 

defaultValue={'Intersect'}
onChange={queryChange}
options={queryOption}
placeholder={'Intersect'}
/>



{
  query_method === 'Buffer' || query_method === 'Intersect' ?

  <div className="buffer" >
    <input type="range" name="" id="" min={0} max={10000} onChange={onInputChange} style={{ marginTop:'1.5vh'}}/> <p> {buffer_value} meters</p>
    <div className="query_buttons" style={{display:'flex', flexDirection:'row', gap:'1rem', width:'500px'}}>
    <button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#087c70',
 width:'5vw', height:'3vh', color:'#fff'}}
 onClick={runQuery} >Run Query</button>
 <button type="button" style={{ outline:'none', border:'none', borderRadius:'10px', backgroundColor:'#087c70',
 width:'5vw', height:'3vh', color:'#fff'}}
 onClick={clearQuery} >Clear</button>

    </div>
    
    
  </div>
  : ''
}



              </div>



        </div>

    </div>
  )
}

export default Map