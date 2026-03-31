import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelBookingRequest } from "@/features/requests/bookingRequest";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmationModal } from "../ui/ConfirmationDialog";

interface CancelBookingRequestProps {
  requestID: number;
  onSuccess: () => void;
}

export const CancelBookingRequest = ({requestID,onSuccess}: CancelBookingRequestProps) => {
  const { user } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelRequest = async () => {
    try {
      if (!user.token || !requestID) return;

      setLoading(true);
      await cancelBookingRequest(user.token, requestID);
      setOpenConfirm(false);
      onSuccess();
    } catch (e) {
      console.error("Failed to cancel booking request:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={"xs"}
        className="rounded-full border border-red-300 bg-red-200 px-3 py-1.5 text-xs font-semibold transition hover:bg-red-100 text-red-700 hover:text-red-500"
        onClick={() => setOpenConfirm(true)}
      >
        Cancel
      </Button>

      <ConfirmationModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Cancel this request?"
        description="This action will cancel the booking request."
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleCancelRequest}
        loading={loading}
      />
    </>
  );
};