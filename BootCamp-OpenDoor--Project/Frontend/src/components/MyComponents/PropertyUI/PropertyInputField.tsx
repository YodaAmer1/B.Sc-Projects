import { Input } from "@/components/ui/input";

interface PropertyInputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}

export const PropertyInputField = ({label,value,placeholder,onChange,type = "text"}: PropertyInputFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
};