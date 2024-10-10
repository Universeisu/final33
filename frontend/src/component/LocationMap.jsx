import { Marker, Popup, useMapEvent } from "react-leaflet";
import L from "leaflet";

const LocationMap = ({ myLocation, icon, onLocationSelect, customImage }) => {
  useMapEvent({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng }); // Pass selected location to parent
    },
  });

  return (
    <>
      {myLocation.lat && myLocation.lng && (
        <Marker
          position={[myLocation.lat, myLocation.lng]}
          icon={
            customImage
              ? new L.Icon({
                  iconUrl: customImage, // ใช้ custom image แทน icon ปกติ
                  iconSize: [38, 38],
                  iconAnchor: [22, 38],
                  popupAnchor: [0, -40],
                })
              : icon // ใช้ icon ปกติถ้าไม่มี custom image
          }
        >
          <Popup>My Current Location</Popup>
        </Marker>
      )}
    </>
  );
};

export default LocationMap;
