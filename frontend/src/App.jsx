import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

const base_url = import.meta.env.VITE_API_BASE_URL;

// Define custom icon for house
const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/69/69524.png", // URL for house icon
  iconSize: [38, 38], // size of the icon
  iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

function App() {
  const center = [13.838500199744178, 100.02534412184882];
  const [stores, setStores] = useState([]);
  const [myLocation, setMylocation] = useState({ lat: "", lng: "" });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${base_url}/api/stores`);
        console.log(response.data); // Log the response to check if data is correct
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  const LocationMap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMylocation({ lat, lng });
      },
    });
    return null; // Return null since we don't need to render anything
  };

  const handlerGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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
          <Marker
            position={[myLocation.lat, myLocation.lng]}
            icon={houseIcon} // ใช้ houseIcon ใน Marker ที่ถูกต้อง
          >
            <Popup>My Current Location</Popup>
          </Marker>

          {stores.length > 0 &&
            stores.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
              >
                <Popup>
                  <b>{store.name}</b>
                  <p>{store.address}</p>
                  <a href={store.direction}>Get Direction</a>
                </Popup>
              </Marker>
            ))}

          <LocationMap />
        </MapContainer>
      </div>
    </>
  );
}

export default App;
