import { createBookingRequest } from "@/features/requests/bookingRequest";
import { useAuth } from "@/hooks/useAuth";
import type { AvailabilitySlot } from "@/types/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/MyComponents/ui/DateRangePicker";
import { toast } from "sonner";

interface CreateBookingRequestProps {
  availabilitySlot: AvailabilitySlot;
}
export const CreateBookingRequest = ({ availabilitySlot }: CreateBookingRequestProps) => {
  const [open, setOpen] = useState(false);
  const [requestedCapacity, setRequestedCapacity] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [familyMessage, setFamilyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDateRange(undefined);
      setRequestedCapacity("");
      setFamilyMessage("");
    }
    setOpen(nextOpen);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!user.token) {
        setLoading(false);
        return;
      }

      if (!dateRange?.from || !dateRange?.to || !requestedCapacity) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
        }

      const params = {
        availability_slot_id: availabilitySlot.id,
        requested_start_date: format(dateRange.from, "yyyy-MM-dd"),
        requested_end_date: format(dateRange.to, "yyyy-MM-dd"),
        requested_capacity: Number(requestedCapacity),
        family_message: familyMessage || "",
      };

      await createBookingRequest(user.token, params);
      handleClose(false);
      toast.success("Booking request sent", {
        description: "Your request has been submitted successfully.",
      });
    } catch (e) {
      console.error("Error creating request:", e);
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className={"bg-blue-600 hover:bg-blue-400"} 
      onClick={() => setOpen(true)} size={"sm"}>Book</Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center text-2xl font-bold">
              Create Booking Request
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
              Available from {availabilitySlot.start_date} to {availabilitySlot.end_date}
            </div>

            <div className="space-y-2 text-center">  
                <DateRangePicker value={dateRange} onChange={setDateRange} minDate={new Date(availabilitySlot.start_date)}
                    maxDate={new Date(availabilitySlot.end_date)} placeholder="Select booking dates"/>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Requested capacity</label>
              <Input
                type="number"
                value={requestedCapacity}
                onChange={(e) => setRequestedCapacity(e.target.value)}
                placeholder="e.g. 4"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={familyMessage}
                onChange={(e) => setFamilyMessage(e.target.value)}
                placeholder="Write a message to the host..."
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
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};