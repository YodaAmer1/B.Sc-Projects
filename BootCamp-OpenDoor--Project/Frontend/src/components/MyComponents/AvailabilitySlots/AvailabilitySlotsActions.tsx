import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { AvailabilitySlot } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { CreateBookingRequest } from "../BookingRequest/CreateBookingRequest";
import { ConfirmationModal } from "../ui/ConfirmationDialog";
import { AvailabilitySlotForm } from "./AvailabilitySlotForm";
import { deleteAvailabilitySlot } from "@/features/availabilitySlots/availabilitySlots";
import { Button } from "@/components/ui/button";

interface AvailabilitySlotActionsProps {
  slot: AvailabilitySlot;
  onSuccess: () => void;
}

export const AvailabilitySlotActions = ({slot,onSuccess,}: AvailabilitySlotActionsProps) => {
    const { user } = useAuth();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteSlot = async () => {
        try {
        if (!user.token) return;

        setLoading(true);
        await deleteAvailabilitySlot(user.token, slot.id);
        setOpenConfirm(false);
        onSuccess();
        } catch (e) {
        console.error("Error deleting availability slot:", e);
        } finally {
        setLoading(false);
        }
    };
  return (
    <div className="relative flex items-center gap-2">
      {user.role === "Evacuee" ? (
        slot.slot_status === "Available" ? (
          <CreateBookingRequest availabilitySlot={slot} />
        ) : (
          <span className="text-xs text-muted-foreground">
            Not available
          </span>
        )
      ) : slot.slot_status === "Available" ? (
        <>
          <Button
            type="button"
            size={"sm"}
            onClick={() => setOpenConfirm(true)}
            className="rounded-full bg-white/90 p-2 text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <AvailabilitySlotForm
            mode="update"
            slotId={slot.id}
            startDate={slot.start_date}
            endDate={slot.end_date}
            onSuccess={onSuccess}
          />
        </>
      ) : (
        <span className="text-xs text-muted-foreground">
          Not available
        </span>
      )}
      <ConfirmationModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={handleDeleteSlot}
        loading={loading}
        title="Delete availability slot?"
        description={`Are you sure you want to delete the slot from ${slot.start_date} to ${slot.end_date}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};