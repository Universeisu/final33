import React from "react";
import { Marker, Popup, useMapEvent } from "react-leaflet";

const LocationMap = ({ myLocation, icon, onLocationSelect }) => {
  useMapEvent({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng }); // Pass selected location to parent
    },
  });

  return (
    <>
      {myLocation.lat && myLocation.lng && (
        <Marker position={[myLocation.lat, myLocation.lng]} icon={icon}>
          <Popup>My Current Location</Popup>
        </Marker>
      )}
    </>
  );
};

export default LocationMap;
