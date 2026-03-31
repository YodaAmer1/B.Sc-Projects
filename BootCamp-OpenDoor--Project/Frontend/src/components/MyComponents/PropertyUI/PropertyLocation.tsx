import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPicker } from "../ui/MapPicker";
import { PropertyInputField } from "./PropertyInputField";

interface PropertyLocationProps {
  latitude: string;
  longitude: string;
  openMap: boolean;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  setOpenMap: (open: boolean) => void;
}

export const PropertyLocation = ({latitude,longitude,openMap,setLatitude,
    setLongitude,setOpenMap}: PropertyLocationProps) => {
  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <h3 className="text-base font-semibold text-gray-800">
            Location
          </h3>

          <Button
            type="button"
            size="sm"
            onClick={() => setOpenMap(true)}
            className="gap-2 rounded-xl border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 shadow-sm hover:border-sky-300 hover:from-sky-100 hover:to-blue-100 hover:text-sky-800"
          >
            <MapPinned className="h-4 w-4" />
            Choose on map
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PropertyInputField
            label="Latitude"
            value={latitude}
            placeholder="e.g. 32.0853"
            onChange={setLatitude}
            type="number"
          />

          <PropertyInputField
            label="Longitude"
            value={longitude}
            placeholder="e.g. 34.7818"
            onChange={setLongitude}
            type="number"
          />
        </div>
      </div>

      <Dialog open={openMap} onOpenChange={setOpenMap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold">
              Pick location
            </DialogTitle>
          </DialogHeader>

          <MapPicker
            onSelect={(lat, lng) => {
              setLatitude(lat.toString());
              setLongitude(lng.toString());
              setOpenMap(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};