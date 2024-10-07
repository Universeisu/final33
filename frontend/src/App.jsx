import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";
import Swal from "sweetalert2";
import LocationMap from "./component/LocationMap";

const base_url = import.meta.env.VITE_API_BASE_URL;

// Define custom icon for house
const sevenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/11891/11891781.png", // URL for house icon
  iconSize: [38, 38], // size of the icon
  iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/619/619153.png", // URL for house icon
  iconSize: [38, 38], // size of the icon
  iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

function App() {
  const center = [13.838500199744178, 100.02534412184882];
  const [stores, setStores] = useState([]);
  const [myLocation, setMylocation] = useState({ lat: "", lng: "" });
  const [selectedStore, setSelectedStore] = useState(null); // Store selected location

  const [deliveryZone, setDeliveryZone] = useState({
    lat: 13.8145263, //ว่องพชรพันธ์
    lng: 100.04178689,
    radius: 1000,
  });

  //ฟังชั่นในการหาcalculateDistance ระหว่าง 2 จุด โดยใข้  Haversine Formular
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; //Eath radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //Distance in  meters
  };

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

  const handlerGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleLocationCheck = () => {
    if (!myLocation.lat || !myLocation.lng) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!deliveryZone.lat || !deliveryZone.lng) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid Store Location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      deliveryZone.lat,
      deliveryZone.lng
    );
    if (distance <= deliveryZone.radius) {
      Swal.fire({
        title: "Success",
        text: "You are within the delivery zone",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You are outside the delivery zone",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <h1>STORE DELIVERY ZONE CHECKER</h1>
      <button className="get-location-btn" onClick={handlerGetLocation}>
        Get My Location
      </button>
      <button className="get-location-btn" onClick={handleLocationCheck}>
        Check Delivery Availability
      </button>

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

          {stores.length > 0 &&
            stores.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store); // Set selected store
                  },
                }}
              >
                <Popup>
                  <b>{store.name}</b>
                  <p>{store.address}</p>
                  <a href={store.direction}>Get Direction</a>
                </Popup>
              </Marker>
            ))}

          <LocationMap
            myLocation={myLocation}
            icon={houseIcon}
            onLocationSelect={setMylocation}
          />

          {/* Optional: Add selected store marker if any */}
          {selectedStore && (
            <Marker
              position={[selectedStore.lat, selectedStore.lng]}
              icon={sevenIcon}
            >
              <Popup>
                <b>{selectedStore.name}</b>
                <p>{selectedStore.address}</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default App;
