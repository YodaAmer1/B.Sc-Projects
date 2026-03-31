import { ConfirmationModal } from "@/components/MyComponents/ui/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { deleteProperty } from "@/features/properties/properties";
import { useAuth } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react"
import { useState } from "react";

interface DeletePropertyProps{
    propertyID : number;
    onSuccess: () => void;
}
export const DeleteProperty = ({propertyID,onSuccess}:DeletePropertyProps) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();

    const handleDeleteClick = async () =>{
        try{
            if (!user.token || !propertyID) return;

            setLoading(true);
            await deleteProperty(user.token, propertyID);
            setOpenConfirm(false);
            onSuccess();
        }catch(e){
            console.error("Failed to delete property:", e);
        }finally {
            setLoading(false);
        }
    } 
    
    return(
      <>
        <Button
        size={"sm"}
        onClick={() => setOpenConfirm(true)}
        className="absolute left-3 top-3 rounded-full bg-white/90 p-2 text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

        <ConfirmationModal
            open={openConfirm}
            onOpenChange={setOpenConfirm}
            title="Delete this property?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDeleteClick}
            loading={loading}
        />
      </>

    )
}