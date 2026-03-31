import { useAuth } from "@/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import {Building2,CircleUserRound,ClipboardList,Home,LogOut,Menu,Moon,Sun} from "lucide-react";
import {Sheet,SheetContent, SheetHeader,SheetTitle,SheetTrigger} from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SideBarProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export const SideBar = ({ isDarkMode, onToggleTheme }: SideBarProps) => {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:bg-gray-100">
            <Menu className="h-5 w-5 text-black" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[320px] sm:w-[340px] border-r border-black/5 bg-white/80 px-0 backdrop-blur-md"
        >
          <SheetHeader className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-white via-blue-50 to-sky-100/70 px-5 py-6">
            <div className="relative flex items-center gap-4">
              <div className="min-w-0 text-center">
                <SheetTitle className="text-2xl font-semibold tracking-tight text-slate-800">
                  <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                    OpenDoor
                  </span>
                </SheetTitle>

                <p className="mt-1 text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
                  Safe stay platform
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex h-full relative flex-col px-4 py-5">
            <div className="mt-2">
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Main Menu
                  </p>
                  <div className="h-px w-16 bg-gradient-to-r from-sky-200 to-transparent" />
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <NavLink
                  to={user.role ? `/${user.role.toLocaleLowerCase()}` : "/"}
                  onClick={() => setIsDrawerOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-100 text-sky-700"
                        : "text-foreground hover:bg-sky-50 hover:text-sky-700"
                    }`
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                    <Home className="h-4 w-4" />
                  </span>
                  <span>{user.role ? "Dashboard" : "Home"}</span>
                </NavLink>

                {user.role && (
                  <>
                  {user.role === "Admin" ? (
                    <NavLink
                      to="/properties"
                      onClick={() => setIsDrawerOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-sky-100 text-sky-700"
                            : "text-foreground hover:bg-sky-50 hover:text-sky-700"
                        }`
                      }
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <span>Properties</span>
                    </NavLink>
                  ):(
                    <>
                    <NavLink
                      to="/requests"
                      onClick={() => setIsDrawerOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-sky-100 text-sky-700"
                            : "text-foreground hover:bg-sky-50 hover:text-sky-700"
                        }`
                      }
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100 group-hover:text-cyan-700">
                        <ClipboardList className="h-4 w-4" />
                      </span>
                      <span>Requests</span>
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsDrawerOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-sky-100 text-sky-700"
                            : "text-foreground hover:bg-sky-50 hover:text-sky-700"
                        }`
                      }
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                        <CircleUserRound className="h-4 w-4" />
                      </span>
                      <span>Profile</span>
                    </NavLink>
                    </>
                  )}

                  </>
                )}
              </div>
            </div>
                       
            <div className="mt-auto space-y-3 border-t border-border/60 px-1 pt-4 pb-4">
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-sm font-medium text-foreground/80">Theme</span>
              <Button
                  type="button"
                  onClick={onToggleTheme}
                  className={`relative flex h-6 w-12 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-gray-500" : "bg-blue-100"
                  }`}
              >
                  <Sun className="absolute right-1 h-3 w-3 text-slate-600" />
                  <Moon className="absolute left-1 h-3 w-3 text-amber-500" />

                  <span
                  className={`absolute h-5 w-5 rounded-full bg-white shadow transition-all ${
                      isDarkMode ? "left-6" : "left-0.5"
                  }`}
                  />
              </Button>
            </div>

              {user.role && 
                (
                <Button
                  variant="outline"
                  className="flex h-11 w-full items-center justify-start gap-3 rounded-xl border-border/70 px-4 text-sm font-medium shadow-sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsDrawerOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              )}

                <div className="mx-auto mt-8 flex w-full justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />
                  <img
                    src="/images/OpenDoorLogo.png"
                    alt="OpenDoor logo"
                    className="relative h-56 w-56 object-contain drop-shadow-[0_10px_30px_rgba(37,99,235,0.35)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
