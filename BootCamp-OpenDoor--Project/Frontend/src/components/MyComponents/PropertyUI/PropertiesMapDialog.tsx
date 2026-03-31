import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import type { Property } from "@/types/types";
import { useMemo, useState } from "react";

interface PropertiesMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
}

export const PropertiesMapDialog = ({
  open,
  onOpenChange,
  properties,
}: PropertiesMapDialogProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const propertiesWithLocation = useMemo(() => {
    return properties.filter(
      (property) =>
        property.latitude !== null &&
        property.latitude !== undefined &&
        property.longitude !== null &&
        property.longitude !== undefined
    );
  }, [properties]);

  const selectedProperty = propertiesWithLocation.find(
    (property) => property.id === selectedPropertyId
  );

  const mapCenter = useMemo(() => {
    if (propertiesWithLocation.length > 0) {
      return {
        lat: Number(propertiesWithLocation[0].latitude),
        lng: Number(propertiesWithLocation[0].longitude),
      };
    }

    return { lat: 32.0853, lng: 34.7818 };
  }, [propertiesWithLocation]);

  if (!isLoaded) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle className="text-center">Properties Map</DialogTitle>
          </DialogHeader>
          <div className="flex h-[500px] items-center justify-center text-sm text-muted-foreground">
            Loading map...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle className="text-center">Properties Map</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {propertiesWithLocation.length === 0 && (
            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              No properties with saved location were found.
            </div>
          )}

          <GoogleMap
            zoom={propertiesWithLocation.length > 0 ? 8 : 7}
            center={mapCenter}
            mapContainerStyle={{ width: "", height: "600px", borderRadius: "16px" }}
          >
            {propertiesWithLocation.map((property) => (
              <Marker
                key={property.id}
                position={{
                  lat: Number(property.latitude),
                  lng: Number(property.longitude),
                }}
                onClick={() => setSelectedPropertyId(property.id)}
              />
            ))}

            {selectedProperty && (
              <InfoWindow
                position={{
                  lat: Number(selectedProperty.latitude),
                  lng: Number(selectedProperty.longitude),
                }}
                onCloseClick={() => setSelectedPropertyId(null)}
              >
                <div className="min-w-[180px] space-y-1">
                  <p className="font-semibold">{selectedProperty.name}</p>
                  <p className="text-sm text-gray-600">{selectedProperty.city}</p>
                  <p className="text-sm text-gray-600">{selectedProperty.street_address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </DialogContent>
    </Dialog>
  );
};