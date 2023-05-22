import './App.css';
import { TileLayer, Marker, MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import icon from './images/icon-location.svg';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

import React, { useState, useRef } from 'react';

let DefaultIcon = L.icon({
  iconUrl: icon,
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const mapRef = useRef();

  const [ipifyDetails, setIpifyDetails] = useState({
    'ip': '-',
    'location': '-',
    'timezone': '-',
    'isp': '-',
    'lat': 0,
    'lng': 0
  });
  const [markerPosition, setMarkerPosition] = useState([0, 0]);

  function setMapLocation(lat, lng) {
    const { current = {} } = mapRef;
    current.setView([lat, lng], 14)
    setMarkerPosition([lat, lng])
  }
  function getIpifyDetails(event) {
    event.preventDefault();
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_kBszqdeB2Fe67oGl0T7LKTZsXjkQ8&domain=${event.target[0].value}`)
      .then((response) => response.json())
      .then((data) => {
        setIpifyDetails({
          'ip': data.ip,
          'location': data.location.country + ' , ' + data.location.region,
          'timezone': 'UTC ' + data.location.timezone,
          'isp': data.isp,
          'lat': data.location.lat,
          'lng': data.location.lng
        })
        setMapLocation(data.location.lat, data.location.lng)
      })
      .catch((err) => {
        console.log('erroring')
        console.log(err.message);
      });
  }

  return (
    <div className="App p-container">
      <header className='p-header'>
        <h1>IP Address Tracker</h1>
        <form className='c-ip-info__input' onSubmit={getIpifyDetails}>
          <input placeholder='Search for any IP address or domain' required></input>
          <button type='submit'>
            <svg focusable="false" aria-label='look up IP information' xmlns="http://www.w3.org/2000/svg" width="11" height="14"><path fill="none" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6" /></svg>
          </button>
        </form>
      </header>
      <main className='c-map__section'>
        <section className='c-ip-info__container'>
          <div className='c-ip-info__box'>
            <span className='c-ip-info__title'>IP ADDRESS</span>
            <span className='c-ip-info__value'>{ipifyDetails.ip}</span>
          </div>
          <div className='c-ip-info__box'>
            <span className='c-ip-info__title'>LOCATION</span>
            <span className='c-ip-info__value'>{ipifyDetails.location}</span>
          </div>
          <div className='c-ip-info__box'>
            <span className='c-ip-info__title'>TIMEZONE</span>
            <span className='c-ip-info__value'>{ipifyDetails.timezone}</span>
          </div>
          <div className='c-ip-info__box'>
            <span className='c-ip-info__title'>ISP</span>
            <span className='c-ip-info__value'>{ipifyDetails.isp}</span>
          </div>
        </section>
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition}>
          </Marker>
        </MapContainer>
        <footer className="attribution">
          Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>.
          Coded by <a href="https://github.com/alevalenti44" target='_blank'>alevalenti44</a>.
        </footer>
      </main>
    </div>
  );
}

export default App;
