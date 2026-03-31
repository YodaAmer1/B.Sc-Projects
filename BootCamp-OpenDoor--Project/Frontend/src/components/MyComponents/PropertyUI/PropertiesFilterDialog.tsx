import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog";

import { DateRangePicker } from "@/components/MyComponents/ui/DateRangePicker";
import { PropertyTagsSelector } from "@/components/MyComponents/PropertyUI/PropertyTagsSelector";
import { useAuth } from "@/hooks/useAuth";

interface PropertiesFilterDialogProps {
  city: string;
  dateRange: DateRange | undefined;
  selectedTags: string[];
  onCityChange: (value: string) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onTagToggle: (tag: string) => void;
  onApply: () => void;
  onClear: () => void;
  radius: string;
  onRadiusChange: (value: string) => void;
}

export const PropertiesFilterDialog = ({
  city,
  dateRange,
  selectedTags,
  onCityChange,
  onDateRangeChange,
  onTagToggle,
  onApply,
  onClear,
  radius,
  onRadiusChange,
}: PropertiesFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [filterError, setFilterError] = useState("");
  const {user} = useAuth();

  const handleApply = () => {
    const hasCity = city.trim().length > 0;
    const hasDateRange = !!dateRange?.from || !!dateRange?.to;
    const hasTags = selectedTags.length > 0;
    const hasRadius = radius.trim().length > 0;

    if (!hasCity && !hasDateRange && !hasTags && !hasRadius) {
        setFilterError("Please select at least one filter.");
        return;
    }

    setFilterError("");
    onApply();
    setOpen(false);
    };

  const handleClear = () => {
    setFilterError("");
    onClear();
  };

  return (
    <>
    <Button type="button"variant="outline"
     className="gap-2 text-white rounded-xl bg-blue-600 hover:bg-blue-400 hover:text-white"
      onClick={() => setOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" />
        Filters
    </Button>
    <Dialog open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
        setFilterError("");
        }
    }}>
      <DialogContent className="max-w-2xl rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Filter Properties
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="e.g. Haifa"
            />
          </div>
        {user.role !== "Admin" && (

          <div className="space-y-2">
            <label className="text-sm font-medium">Radius from your location (km)</label>
            <Input
              type="number"
              min="1"
              value={radius} 
              onChange={(e) => onRadiusChange(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
        )}

          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium">Select Date range</label>
            <div>
            <DateRangePicker value={dateRange} onChange={onDateRangeChange}/>
            </div>
          </div>

          <div className="space-y-2">
            <PropertyTagsSelector
              selectedTags={selectedTags}
              onToggle={onTagToggle}
            />
          </div>
            {filterError && (
            <p className="text-center text-sm font-medium text-red-500">
                {filterError}
            </p>
            )}
          <div className="flex justify-center gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>

            <Button type="button" className={"bg-blue-600"} onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};