import { PropertyCard } from "@/components/MyComponents/PropertyUI/PropertyCard";
import { PropertyFormDialog } from "@/components/MyComponents/PropertyUI/PropertyFormDialog";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/features/properties/properties";
import { useAuth } from "@/hooks/useAuth";
import type { Property } from "@/types/types";
import { Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const HostHomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [addProperty, setAddProperty] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    fetchProperties();
  },[])

  const fetchProperties = async () => {
    try{
      if (!user.token) {
        setLoading(false);
        return;
      }
      const data = await getProperties(user.token);
      setProperties(data);
    }catch(e){
      console.error("Error fetching properties:", e);
      toast.error("Failed to load properties ");
    }finally{
      setLoading(false);
    }
    
  }

  return (
  <div className="px-6 py-2">
    <div className="mb-10 flex flex-col relative">
      <h1 className="flex items-center justify-center gap-4 text-2xl font-bold">
        <div className="rounded-full bg-blue-100 p-2">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <span>My Properties</span>
      </h1>
    </div>

    {loading ? (
      <p className="text-sm text-muted-foreground">Loading properties...</p>
    ) : properties.length === 0 ? (
      <p className="text-sm text-muted-foreground">No properties found.</p>
    ) : (
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-wrap justify-start gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSuccess={fetchProperties}
            />
          ))}
        </div>
      </div>
    )}
    <div className="mt-4 flex flex-col fixed right-4 bottom-4 items-center gap-2">
        <Button
          onClick={() => setAddProperty(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-md transition duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-blue-700 hover:shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
        <span className="text-xs font-semibold"> Add Property</span>
      </div>
      <PropertyFormDialog open={addProperty} onOpenChange={setAddProperty} onSuccess={fetchProperties} mode="create"/>
  </div>
);
};
