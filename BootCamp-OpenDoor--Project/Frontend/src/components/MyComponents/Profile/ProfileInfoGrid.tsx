import { BadgeInfo, ShieldCheck } from "lucide-react";

interface ProfileInfoGridProps {
  username: string | null;
  role: string | null;
}

export const ProfileInfoGrid = ({username,role}: ProfileInfoGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
          <BadgeInfo className="h-4 w-4" />
          Username
        </div>
        <p className="text-lg font-semibold text-gray-800">
          {username ?? "Guest"}
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          Role
        </div>
        <p className="text-lg font-semibold capitalize text-gray-800">
          {role ?? "Unauthenticated"}
        </p>
      </div>
    </div>
  );
};