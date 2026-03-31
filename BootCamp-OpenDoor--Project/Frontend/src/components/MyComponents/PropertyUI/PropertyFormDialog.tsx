import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createProperty, updateProperty } from "@/features/properties/properties";
import type { Property } from "@/types/types";
import { PropertyInputField } from "./PropertyInputField";
import { PropertyTagsSelector } from "./PropertyTagsSelector";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PropertyLocation } from "./PropertyLocation";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  initialData?: Property;
}

export const PropertyFormDialog = ({open,onOpenChange,onSuccess,mode,initialData}: PropertyFormDialogProps) => {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [capacity, setCapacity] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"Active" | "Suspended" | "Inactive">("Active");
    const {user} = useAuth();
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [openMap, setOpenMap] = useState(false);
    const tagsString = selectedTags.join(" , ");
    
    useEffect(() => {
      if (mode === "edit" && initialData) {
        setName(initialData.name);
        setCity(initialData.city);
        setStreetAddress(initialData.street_address);
        setCapacity(String(initialData.capacity));
        setStatus(initialData.status ?? "Active");
        setLatitude(
          initialData.latitude !== undefined && initialData.latitude !== null
            ? String(initialData.latitude)
            : ""
        );

        setLongitude(
          initialData.longitude !== undefined && initialData.longitude !== null
            ? String(initialData.longitude)
            : ""
        );
        if (initialData.specific_tags) {
          setSelectedTags(initialData.specific_tags.split(" , "));
        }
      }
    }, [mode, initialData]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
            ? prev.filter((item) => item !== tag)
            : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
      try {
        setLoading(true);

        if (!name || !city || !streetAddress || !capacity) {
          toast.error("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        
        if(!user.token){
          setLoading(false);
          return;
        }

        const params = {
          name: name,
          street_address: streetAddress,
          city: city,
          capacity: Number(capacity),
          specific_tags: tagsString,
          ...(user.role === "Admin" ? { status } : {}),
           ...(latitude !== "" && longitude !== ""
              ? {
                  latitude: Number(latitude),
                  longitude: Number(longitude),
                }
              : {}),
        };
        if (mode === "create") {
          await createProperty(user.token, params);
        } else {
          await updateProperty(user.token, initialData!.id, params);
        }

        onOpenChange(false);
        toast.success(
          mode === "create" ? "Property created" : "Property updated",
          {
            description:
              mode === "create"
                ? "The property has been created successfully."
                : "The property has been updated successfully.",
          }
        );
        onSuccess();
        if (mode === "create") {
          setName("");
          setCity("");
          setStreetAddress("");
          setCapacity("");
          setSelectedTags([]);
          setLatitude("");
          setLongitude("");
        }

      } catch (e) {
        toast.error(mode === "create" ? "Failed to create property" : "Failed to update property");
      } finally {
        setLoading(false);
      }
    };
    return (
      <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Home Assistant
            </p>
            <DialogTitle className="text-2xl font-bold">
              {mode === "create" ? "Add a new property" : "Update property"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <PropertyInputField label="Property name" value={name}
            placeholder="e.g. Pinewood Cottage" onChange={setName}/>

            <PropertyInputField label="City" value={city}
            placeholder="e.g. Tel Aviv" onChange={setCity}/>

            <PropertyInputField label="Street address" value={streetAddress}
            placeholder="e.g. 12 Herzl St" onChange={setStreetAddress}/>

            <PropertyInputField label="Capacity" value={capacity}
            placeholder="e.g. 4" onChange={setCapacity} type="number"/>

            <PropertyLocation
              latitude={latitude}
              longitude={longitude}
              openMap={openMap}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setOpenMap={setOpenMap}
            />

            <PropertyTagsSelector selectedTags={selectedTags} onToggle={handleTagToggle}/>
            {user.role === "Admin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status}
                  onValueChange={(value) => setStatus(value ?? "Active")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={loading}
            className={"bg-blue-600"}>
              {loading? mode === "create" ? "Creating..." : "Saving..."
                : mode === "create" ? "Create Property" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};