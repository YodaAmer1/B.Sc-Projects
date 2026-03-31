import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { getPicture, updatePicture } from "@/services/auth/authService";
import { ProfileInfoGrid } from "@/components/MyComponents/Profile/ProfileInfoGrid";
import { ProfileHeaderCard } from "@/components/MyComponents/Profile/ProfileHeaderCard";
import { toast } from "sonner";
import { ProfileLocationSection } from "@/components/MyComponents/Profile/ProfileLocation";

export const ProfilePage = () => {
  const { user, refreshProfileImage} = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    loadProfileImage();
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const loadProfileImage = async () => {
    try {
      if (!user.token || !user.id) return;

      const blob = await getPicture(user.token, Number(user.id));
      if (!blob) {
        setProfileImage("");
        return;
      }
      const imageUrl = URL.createObjectURL(blob);
      setProfileImage(imageUrl);
    } catch (e) {
      setProfileImage("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user.token) return;

      setUploading(true);
      await updatePicture(user.token, file);
      refreshProfileImage();
      await loadProfileImage();
      toast.success("Profile picture updated", {
        description: "Your profile picture has been updated successfully.",
      });
    } catch (e) {
      toast.error("Failed to update picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Card className="shadow-sm">
        <ProfileHeaderCard
          username={user.username}
          profileImage={profileImage}
          uploading={uploading}
          fileInputRef={fileInputRef}
          onBrowseClick={handleBrowseClick}
          onFileChange={handleFileChange}
        />
        <CardContent className="space-y-6 pt-6">
          <ProfileInfoGrid username={user.username} role={user.role} />
        </CardContent>
        <CardContent className="space-y-6 pt-2">
        {user.role === "Evacuee" && user.token && user.id && (
          <ProfileLocationSection
            token={user.token}
            userId={Number(user.id)}
          />
        )}
        </CardContent>
      </Card>
    </div>
  );
};