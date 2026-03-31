import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CircleUserRound, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SideBar } from "../MyComponents/ui/SideBar";
import { getPicture } from "@/services/auth/authService";
import { Toaster } from "../ui/sonner";

export const MainLayout = () => {
  const { user, profileImageVersion  } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const getPageTitle = () => {
    return location.pathname === "/"
      ? "Home".toUpperCase()
      : location.pathname === "/host"
      ? "Host Dashboard".toUpperCase()
      : location.pathname === "/admin"
      ? "Admin Dashboard".toUpperCase()
      : location.pathname === "/evacuee"
      ? "Evacuee Dashboard".toUpperCase()
      : location.pathname.split("/")[1]?.toUpperCase()
      ?? "OpenDoor"; 
  };

  useEffect(() => {
    let imageUrl = "";

    const loadProfileImage = async () => {
      try {
        if (!user.token || !user.id) {
          setProfileImage("");
          return;
        }
        
        const blob = await getPicture(user.token, Number(user.id));
        if (!blob) {
          setProfileImage("");
          return;
        }
        imageUrl = URL.createObjectURL(blob);
        setProfileImage(imageUrl);
      } catch (e) {
        setProfileImage("");
      }
    };

    loadProfileImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [user.token,user.id,profileImageVersion ]);

  return (
    <div
      className={
        isDarkMode
          ? "dark min-h-screen bg-background text-foreground"
          : "min-h-screen bg-background text-foreground"
      }
    >
      <header className="sticky top-0 z-50 relative border-b bg-background">
        <nav className="flex min-h-[60px] items-center p-4">
          <SideBar
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((current) => !current)}
          />

          <div className="absolute left-1/2 top-3 -translate-x-1/2 text-center">
            <h1 className="bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-800 bg-clip-text text-3xl font-black tracking-tight text-transparent drop-shadow-[0_2px_0_rgba(255,255,255,0.35)]">
              {getPageTitle()}
            </h1>
          </div>

          {user.role ? (
          <div className="absolute right-4">
            <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-blue-100"
                />
              ) : (
                <CircleUserRound className="h-5 w-5 text-blue-600" />
              )}

              <span className="text-sm font-medium text-foreground">
                {user.username}
              </span>

              <span className="h-5 w-px bg-border" />

              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {user.role}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute right-4 flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm">
              <CircleUserRound className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Guest</span>
            </div>

            <Link
              to="/login"
              className="animate-pulse rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:bg-blue-700"
            >
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </span>
            </Link>
          </div>
        )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl py-6">
        <Outlet />
      </main>

      <Toaster richColors position="top-center" />
    </div>
  );
};
