import { useAuth } from "@/hooks/useAuth";
import type { BookingRequest } from "@/types/types";
import { getRequestsByRole } from "@/utils/requestsHelpers";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CancelBookingRequest } from "@/components/MyComponents/BookingRequest/CancelBookingRequest";
import { BookingRequestActions } from "@/components/MyComponents/BookingRequest/BookingRequestActions";
import { toast } from "sonner";

export const RequestsPage =() => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        fetchRequests();
    },[])

    const fetchRequests = async()=>{
        try{
            setRequests(await getRequestsByRole(user.role, user.token));
        }catch(e){
            console.error("Error fetching requests:", e);
            toast.error("Failed to load requests");
        }finally{
            setLoading(false);
        }
    }

    return (
    <div className="mx-auto max-w-6xl px-6 py-4">
        <Card className="border border-border/60 shadow-sm">
        <CardHeader>
            <CardTitle className="flex items-center justify-center p-2 gap-3 text-2xl font-bold">
            <div className="rounded-full bg-blue-100 p-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <span>Booking Requests</span>
            </CardTitle>
        </CardHeader>

        <CardContent>
            {loading ? (
            <p className="text-sm text-muted-foreground">Loading requests...</p>
            ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests found.</p>
            ) : (
            <div className="overflow-hidden rounded-2xl border">
                <Table>
                <TableHeader className="bg-sky-50/70 dark:bg-sky-950/30">
                    <TableRow>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Request ID
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Evacuee ID
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Slot ID
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Start Date
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        End Date
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Capacity
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Message
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                        Status
                    </TableHead>
                    <TableHead className="font-semibold text-sky-900 dark:text-sky-100">
                    Actions
                    </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {requests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium">
                        #{request.id}
                        </TableCell>

                        <TableCell>
                        {request.family_id}
                        </TableCell>

                        <TableCell>
                        {request.availability_slot_id}
                        </TableCell>

                        <TableCell>
                        {request.requested_start_date}
                        </TableCell>

                        <TableCell>
                        {request.requested_end_date}
                        </TableCell>

                        <TableCell>
                        {request.requested_capacity}
                        </TableCell>

                        <TableCell className="w-[180px] max-w-[180px]">
                            {request.family_message ? (
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                    <span className="block max-w-[160px] truncate cursor-pointer text-sm text-foreground">
                                        {request.family_message}
                                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[320px]">
                                    <p className="text-sm leading-5">{request.family_message}</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <span className="text-sm text-muted-foreground">No message</span>
                            )}
                        </TableCell>
                        
                        <TableCell>
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    request.request_status === "Pending"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                    : request.request_status === "Approved"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                    : request.request_status === "Rejected"
                                    ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                    : request.request_status === "Cancelled"
                                    ? "bg-orange-300 text-gray-700 dark:bg-orange-900 dark:text-gray-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                                }`}
                            >
                                {request.request_status}
                            </span>
                        </TableCell>
                        <TableCell>
                            {user.role === "Evacuee" ? (
                                request.request_status === "Pending" ? (
                                <CancelBookingRequest requestID={request.id} onSuccess={fetchRequests}/>
                                ) : null
                            ) : user.role === "Host" ? (
                                request.request_status === "Pending" ? (
                                <BookingRequestActions requestID={request.id} onSuccess={fetchRequests}/>
                                ) : <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                                        No actions 
                                    </span>
                            ) : null}   
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            )}
        </CardContent>
        </Card>
    </div>
    );
}