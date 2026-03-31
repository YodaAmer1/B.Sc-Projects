import { useState } from "react";
import { MapPinned } from "lucide-react";
import { toast } from "sonner";
import { updateUserLocation } from "@/services/profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPicker } from "@/components/MyComponents/ui/MapPicker";

interface ProfileLocationSectionProps {
  token: string;
  userId: number;
}

export const ProfileLocationSection = ({token,userId}: ProfileLocationSectionProps) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const handleSaveLocation = async () => {
    try {
      if (!latitude || !longitude) {
        toast.error("Invalid input", {
          description: "Please enter both latitude and longitude",
        });
        return;
      }

      setLoadingLocation(true);

      await updateUserLocation(token, {
        user_id: userId,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      toast.success("Location updated", {
        description: "Your location has been saved successfully.",
      });
    } catch (e) {
      toast.error("Update failed", {
        description: "Failed to update location.",
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <>
      <div className="mt-6 space-y-4 rounded-lg border p-4">
        <div className="flex gap-6">
          <h3 className="text-lg font-semibold text-gray-800">
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

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-500">Latitude</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="e.g. 32.0853"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Longitude</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="e.g. 34.7818"
            />
          </div>
        </div>

        <button
          onClick={handleSaveLocation}
          disabled={loadingLocation}
          className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          {loadingLocation ? "Saving..." : "Save Location"}
        </button>
      </div>

      <Dialog open={openMap} onOpenChange={setOpenMap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={"text-center font-semibold"}>Pick location</DialogTitle>
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