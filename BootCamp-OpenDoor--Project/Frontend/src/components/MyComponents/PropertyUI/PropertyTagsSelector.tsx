import { Button } from "@/components/ui/button";

interface PropertyTagsSelectorProps {
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

const TAG_OPTIONS = ["Mamad","Balcony","Parking","Sea View","Garden","WiFi",
  "Air Conditioning","Pet Friendly","Family","Accessible"];

export const PropertyTagsSelector = ({selectedTags,onToggle}: PropertyTagsSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Specific tags</label>

      <div className="flex flex-wrap gap-2">
        {TAG_OPTIONS.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <Button
              size={"sm"}
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isSelected
                  ? "rounded-full border border-orange-200 bg-orange-100 font-medium text-orange-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tag}
            </Button>
          );
        })}
      </div>
    </div>
  );
};