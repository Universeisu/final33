import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios"; // Corrected the import syntax
import "leaflet/dist/leaflet.css";
import "./App.css";

const base_url = import.meta.env.VITE_API_BASE_URL;

function App() {
  const center = [13.838500199744178, 100.02534412184882];
  const [stores, setStores] = useState([]);
  const [myLocation, setMylocation] = useState({ lat: "", long: "" });
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${base_url}/api/stores`);
        //console.log(response.data); // Log the response
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error();
      }
    };
    fetchStores();
  }, []);

  const handlerGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  };


  return (
    <>
      <h1>STORE DELIVERY ZONE CHECKER</h1>
      <button onClick={handlerGetLocation}>Get My Location</button>
      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              <b>{stores}</b>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}

export default App;
