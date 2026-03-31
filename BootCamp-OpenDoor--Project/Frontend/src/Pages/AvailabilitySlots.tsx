import { AvailabilitySlotForm } from "@/components/MyComponents/AvailabilitySlots/AvailabilitySlotForm";
import { AvailabilitySlotActions } from "@/components/MyComponents/AvailabilitySlots/AvailabilitySlotsActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPropertyAvailabilitySlots } from "@/features/availabilitySlots/availabilitySlots";
import { getPropertyByID } from "@/features/properties/properties";
import { useAuth } from "@/hooks/useAuth";
import type { AvailabilitySlot, Property } from "@/types/types";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const AvailabilitySlots = () => {
    const { propertyId } = useParams();
    const [availabilitySlots,setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [property, serProperty] = useState<Property>();
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        getAvailabilitySlots();
        getProperty();
    },[propertyId])

    const getProperty = async() => {
        try{
            if (!user.token || !propertyId){
                    setLoading(false);
                    return;
                }
            const data = await getPropertyByID(user.token,propertyId);
            serProperty(data);
        }catch(e){
            console.error("Error fetching Property:", e);
            toast.error("Failed to load  Property ");
        }finally{
            setLoading(false);
        }
    }

    const getAvailabilitySlots = async () =>{
        try{
            if (!user.token || !propertyId){
                setLoading(false);
                return;
            }
            const data = await getPropertyAvailabilitySlots(user.token, propertyId);
            setAvailabilitySlots(data);
        }catch(e){
            console.error("Error fetching availability slots:", e);
            toast.error("Failed to load  availability slots ");
        }finally{
            setLoading(false);
        }
    }

    return (
    <div className="mx-auto max-w-6xl px-10 py-5">
        <div className="mb-6 rounded-2xl fw border bg-gradient-to-r from-sky-50 to-white p-5 shadow-sm dark:from-sky-950/20 dark:to-background">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                Property Availability
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                {property?.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                {property?.city} • {property?.street_address}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                Availability Overview
                </span>

                {property?.status && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {property?.status}
                </span>
                )}
            </div>
            </div>
        </div>

            {loading ? (
            <p className="text-sm text-muted-foreground">Loading availability slots...</p>
            ) : (
                
            <Card className="rounded-2xl shadow-sm">
                <CardHeader className="border-b p-4">
                    <div className="flex justify-center relative">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                        <span>Availability</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                            <CalendarRange className="h-5 w-5 text-sky-600" />
                        </div>
                        </CardTitle>

                        {user.role === "Host" && propertyId && (
                        <div className="absolute right-4 top-2">
                            <AvailabilitySlotForm propertyId={Number(propertyId)}
                                onSuccess={getAvailabilitySlots}
                            />
                        </div>
                        )}
                    </div>
                </CardHeader>
                {availabilitySlots.length === 0 ? (
            <p className="text-sm font-semibold text-muted-foreground text-center">No availability slots found.</p>
            ) :(
                <CardContent className="p-2">
                <div className="overflow-hidden">
                <Table className="border">
                <TableHeader className="bg-sky-50/70 dark:bg-sky-950/30">
                    <TableRow className="border-b">
                    <TableHead className="w-[90px] font-semibold text-sky-900 dark:text-sky-100">
                    Slot ID
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-sky-900 dark:text-sky-100">
                    Start Date
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-sky-900 dark:text-sky-100">
                    End Date
                    </TableHead>
                    <TableHead className="w-[160px] text-center font-semibold text-sky-900 dark:text-sky-100">
                    Status
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-sky-900 dark:text-sky-100">
                    Created At
                     </TableHead>
                     <TableHead className="w-[160px] font-semibold text-sky-900 dark:text-sky-100">
                        Actions
                     </TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                    {availabilitySlots.map((slot) => (
                        <TableRow key={slot.id}>
                        <TableCell className="font-medium">#{slot.id}</TableCell>
                        <TableCell>{slot.start_date}</TableCell>
                        <TableCell>{slot.end_date}</TableCell>
                        <TableCell className="text-center">
                            <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                slot.slot_status === "Available"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : slot.slot_status === "Booked"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                : slot.slot_status === "Unavailable"
                                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                            }`}
                            >
                            {slot.slot_status}
                            </span>
                        </TableCell>
                        <TableCell>{new Date(slot.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-start">
                            <AvailabilitySlotActions
                                slot={slot}
                                onSuccess={getAvailabilitySlots}
                            />
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
           </CardContent>
            )}
        </Card>
            )}
    </div>
    );
}