import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmationModal = ({open,onOpenChange,title,description,confirmText = "Confirm",cancelText = "Cancel",onConfirm,loading = false}: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 text-center">
        <DialogHeader className="items-center space-y-2 text-center">
          <DialogTitle className="text-xl font-bold text-center">
            {title}
          </DialogTitle>

          {description ? (
            <p className="text-sm text-muted-foreground text-center">
              {description}
            </p>
          ) : null}
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row justify-center gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="default"
            className={"bg-blue-600 hover:bg-blue-400"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};