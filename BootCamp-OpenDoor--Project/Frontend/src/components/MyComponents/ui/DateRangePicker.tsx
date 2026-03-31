import { format, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export const DateRangePicker = ({value,onChange,minDate,maxDate}: DateRangePickerProps) => {
  const today = startOfDay(new Date());
  const effectiveMinDate = minDate ? startOfDay(minDate) : today;
  const effectiveMaxDate = maxDate ? startOfDay(maxDate) : undefined;
    return (
    <Popover>
      <PopoverTrigger>
          <div className="flex w-full items-center justify-start rounded-md border px-3 py-2 text-left font-normal">

          <CalendarIcon className="mr-2 h-4 w-4" />

          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd/MM/yyyy")} - {format(value.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(value.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            defaultMonth={value?.from ?? effectiveMinDate}
            disabled={(date) =>
                date < effectiveMinDate ||
                (effectiveMaxDate ? date > effectiveMaxDate : false)
            }
        />
      </PopoverContent>
    </Popover>
  );
};