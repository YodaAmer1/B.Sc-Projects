import { Button } from "@/components/ui/button";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { LocateFixed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MapPickerProps {
  onSelect: (lat: number, lng: number) => void;
}

export const MapPicker = ({ onSelect }: MapPickerProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

  if (!isLoaded) return <div>Loading map...</div>;
  
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
        toast.error("Location unavailable", {
        description: "Your browser does not support geolocation.",
        });
        return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
        (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        onSelect(lat, lng);
        setGettingLocation(false);
        },
        () => {
        toast.error("Location denied", {
            description: "Unable to access your current location.",
        });
        setGettingLocation(false);
        }
    );
    };
  return (
    <>
    <div className="flex justify-center">
    <Button
        type="button"
        variant="default"
        onClick={handleUseCurrentLocation}
        disabled={gettingLocation}
        className="gap-2 flex bg-blue-600 text-white hover:bg-blue-700 w-[200px] rounded-xl"
        >
        <LocateFixed className="h-4 w-4" />
        {gettingLocation ? "Locating..." : "Use current location"}
    </Button>
    </div>
    <GoogleMap
      zoom={8}
      center={{ lat: 32.0853, lng: 34.7818 }}
      mapContainerStyle={{ width: "100%", height: "400px" }}
      onClick={(e) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (!lat || !lng) return;

        const position = { lat, lng };
        setMarker(position);
        onSelect(lat, lng);
      }}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
    </>
  );
};