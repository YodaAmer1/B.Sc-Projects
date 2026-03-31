import type { Property } from "@/types/types";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DeleteProperty } from "./DeleteProperty";
import { useState } from "react";
import { PropertyFormDialog } from "./PropertyFormDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
    property: Property;
    onSuccess: () => void;
}

export const PropertyCard = ({ property , onSuccess}: PropertyCardProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const {user}= useAuth();
  const propertyImages = ["House1","House2","House3","House4","House5"];
  const propertyImage = propertyImages[(property.id -1) % propertyImages.length];
    return(
        <Card className="w-full  max-w-[270px] border border-border/60 shadow-sm transition hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative flex w-full items-center justify-center bg-gray-100 px-0">
               {(user.role === "Host" || user.role === "Admin") && property.status === "Active" &&(
                <>
                  <Button size={"sm"}
                    className="absolute right-3 top-3 rounded-full bg-blue-100 p-2 text-black shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setOpenEdit(true)}>
                    <Pencil className="h-3 w-3"/>
                </Button>
                {user.role === "Host" && (
                <DeleteProperty propertyID={property.id} onSuccess={onSuccess}/>       
                )}
               </>
               )}
                <img
                  src={`/images/${propertyImage}.jpg`}
                  alt={property.name}
                  className="h-32 w-full object-cover"
                />         
              </div>

              <div className="px-2 mt-2">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3
                      title={property.name}
                      className="truncate text-sm font-semibold leading-5 text-foreground"
                    >
                      {property.name}
                  </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {property.city}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                      property.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : property.status === "Inactive"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                        : property.status === "Suspended"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                        : ""
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">
                      Address
                    </p>
                    <p
                      title={property.street_address}
                      className="max-w-[140px] truncate text-right text-xs font-normal text-muted-foreground"
                    >
                      {property.street_address}
                  </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">
                      Capacity
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {property.capacity}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/50 px-3 py-1.5">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                      Tags
                    </p>

                    <div className="flex h-[52px] flex-wrap content-start gap-1.5 overflow-y-auto pr-1">
                      {property.specific_tags ? (
                        property.specific_tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700"
                            >
                              {tag}
                            </span>
                          ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No tags
                        </span>
                      )}
                    </div>
                  </div>
                  {user.role !== "Admin" &&  user.role && property.status === "Active" &&(
                    <div className="pt-1 max-w-[110px] mx-auto">
                    <Link
                      to={`/properties/${property.id}/availability`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>Availability</span>
                    </Link>
                  </div>
                  )}
                </div>
              </div>
            </CardContent>
            <PropertyFormDialog
             open={openEdit} onOpenChange={setOpenEdit} 
             onSuccess={onSuccess} mode="edit" initialData={property}/>
          </Card>
    )
}