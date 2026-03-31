import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleUserRound, Upload } from "lucide-react";

interface ProfileHeaderCardProps {
  username: string | null;
  profileImage: string;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onBrowseClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeaderCard = ({username,profileImage,uploading,
    fileInputRef,onBrowseClick,onFileChange}: ProfileHeaderCardProps) => {
  return (
    <CardHeader className="border-b p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-blue-100 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-100 bg-blue-100 shadow-sm">
              <CircleUserRound className="h-10 w-10 text-blue-600" />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onFileChange}
          />

          <Button
            type="button"
            onClick={onBrowseClick}
            disabled={uploading}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-w-0">
          <CardTitle className="text-2xl">
            {username ?? "Guest User"}
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            Personal profile overview
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};