import { getAllProperties, getFamilyProperties } from "@/features/properties/properties";
import type { Property } from "@/types/types";
import { Building2, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PropertyCard } from "@/components/MyComponents/PropertyUI/PropertyCard";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { PropertiesFilterDialog } from "@/components/MyComponents/PropertyUI/PropertiesFilterDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PropertiesMapDialog } from "@/components/MyComponents/PropertyUI/PropertiesMapDialog";


export const EvacueeHomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();
  const [filters, setFilters] = useState({
    city: "",
    tags: [] as string[],
  });
  const [radius, setRadius] = useState("");
  const [openMap, setOpenMap] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(()=>{
      fetchProperties();
  },[])

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));
  };

  const buildPropertyFilters = () => {
    return {
      fromDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      toDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      city: filters.city.trim() || undefined,
      tags: filters.tags.length ? filters.tags : undefined,
      radius: radius.trim() ? Number(radius) : undefined,
    };
  };

  const handleClearFilters = async () => {
    setFilters({
      city: "",
      tags: [],
    });
    setDateRange(undefined);
    setRadius("");
    try {
      if (!user.token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const data = await (
        user.role === "Admin"
          ? getAllProperties(user.token)
          : getFamilyProperties(user.token)
      );
      setProperties(data);
    } catch (e) {
      console.error("Error fetching properties:", e);
      toast.error("Failed to load properties ");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async() => {
    try{
      if (!user.token) {
        setLoading(false);
        return;
      }
      const data = await (
        user.role === "Admin"
          ? getAllProperties(user.token,buildPropertyFilters())
          : getFamilyProperties(user.token,buildPropertyFilters())
      );
        setProperties(data);
      }catch(e){
        console.error("Error fetching properties:", e);
        toast.error("Failed to load properties ");
      }finally{
        setLoading(false);
      }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 relative">
          <h1 className="flex items-center justify-center gap-4 text-2xl font-bold">
            <div className="rounded-full bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <span>Properties</span>
          </h1>
          <div className="mb-6 mt-2 absolute right-15 top-0">
          <PropertiesFilterDialog
            city={filters.city}
            dateRange={dateRange}
            selectedTags={filters.tags}
            radius={radius}
            onCityChange={(value) =>
              setFilters((prev) => ({ ...prev, city: value }))
            }
            onRadiusChange={setRadius}
            onDateRangeChange={setDateRange}
            onTagToggle={handleTagToggle}
            onApply={fetchProperties}
            onClear={handleClearFilters}
          />
        </div>
        <div className="absolute left-15 top-0">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpenMap(true)}
            className="group h-auto rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3 text-sky-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:from-sky-100 hover:to-blue-100 hover:text-sky-800 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-sky-100">
                <MapPinned className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-semibold">Map View</span>
                <span className="mt-1 text-[11px] text-sky-600/80">
                  See properties on the map
                </span>
              </div>
            </div>
          </Button>
        </div>
        </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">No properties found.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 mt-15">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onSuccess={fetchProperties} />
        ))}
      </div>
    )}
    <PropertiesMapDialog open={openMap} onOpenChange={setOpenMap} properties={properties}/>
  </div>
  );
};