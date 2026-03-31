import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/MyComponents/ui/DateRangePicker";
import { createAvailabilitySlot, updateAvailabilitySlot } from "@/features/availabilitySlots/availabilitySlots";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AvailabilitySlotFormProps {
  propertyId?: number;
  slotId?: number;
  startDate?: string;
  endDate?: string;
  onSuccess: () => void;
  mode?: "create" | "update";
}

export const AvailabilitySlotForm = ({propertyId,onSuccess,slotId,startDate,endDate,mode = "create"}: AvailabilitySlotFormProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (open && mode === "update" && startDate && endDate) {
        setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
        });
    }
    }, [open, mode, startDate, endDate]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
        if (mode === "create") {
        setDateRange(undefined);
        } else {
        setDateRange({
            from: startDate ? new Date(startDate) : undefined,
            to: endDate ? new Date(endDate) : undefined,
        });
        }
    }
    setOpen(nextOpen);
    };

  const handleAddSlot = async () => {
    try {

      if (!user.token) {
        toast.error("User token is missing");
        return;
      }

      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Please select start and end date");
        return;
      }
      
      const payload = {
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd"),
        };

        if (mode === "create") {
            if (!propertyId) {
                toast.error("Property ID is missing");
                return;
        }

      await createAvailabilitySlot(user.token, {
        property_id: propertyId,
        ...payload,
      });
      } else {
        if (!slotId) {
            toast.error("Slot ID is missing");
            return;
        }

        await updateAvailabilitySlot(user.token, slotId, payload);
        }
      toast.success(
        mode === "create" ? "Slot created" : "Slot updated",
        {
          description:
            mode === "create"
              ? "Availability slot created successfully."
              : "Availability slot updated successfully.",
        }
      );
      handleClose(false);
      onSuccess();
    } catch (e) {
      console.error("Error saving  availability slot:", e);
      toast.error(mode === "create"
          ? "Failed to create availability slot"
          : "Failed to update availability slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === "create" ? (
        <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-sky-600 text-white hover:bg-sky-700"
        >
            <Plus className="h-4 w-4" />
            <span>Add Slot</span>
        </Button>
        ) : (
        <Button
          type="button"
          className="rounded-full bg-blue-100 p-2 text-black shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-3 w-3" />
      </Button>
        )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center text-2xl font-bold">
             {mode === "create" ? "Add Availability Slot" : "Update Availability Slot"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select availability dates"
              />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className={"bg-blue-600"}
                onClick={handleAddSlot}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Adding..." : "Updating..."}
                  </>
                ) : mode === "create" ? (
                  "Save Slot"
                ) : (
                  "Update Slot"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
     
    </>
  );
};