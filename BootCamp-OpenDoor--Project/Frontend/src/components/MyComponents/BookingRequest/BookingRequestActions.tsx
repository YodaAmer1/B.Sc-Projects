import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { changeBookingRequestStatus } from "@/features/requests/bookingRequest";
import { Check, X } from "lucide-react";
import { ConfirmationModal } from "../ui/ConfirmationDialog";
import { Button } from "@/components/ui/button";

interface BookingRequestActionsProps {
  requestID: number;
  onSuccess: () => void;
}

export const BookingRequestActions = ({requestID,onSuccess}: BookingRequestActionsProps) => {
  const { user } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const handleOpenConfirm = (type: "Approved" | "Rejected") => {
    setAction(type);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      if (!user.token || !requestID || !action) return;

      setLoading(true);
      await changeBookingRequestStatus(user.token, requestID, {
        request_status: action,
        host_response: ""
      });

      setOpenConfirm(false);
      setAction("");

      onSuccess();
    } catch (e) {
      console.error("Failed to change request status:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-center">
        <Button
          size={"sm"}
          onClick={() => handleOpenConfirm("Approved")}
          className="rounded-full bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
        >
          <Check className="h-4 w-4" />
        </Button>

        <Button
          size={"sm"}
          onClick={() => handleOpenConfirm("Rejected")}
          className="rounded-full bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmationModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={
          action === "Approved" ? "Approve this request?": "Reject this request?"}
        description="This action will update the booking request status."
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
};