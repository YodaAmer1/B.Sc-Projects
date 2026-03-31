import type { UserAuthState } from "@/types/types";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextType {
  user: UserAuthState;
  refreshAuth: () => void;
  logout: () => void;
  profileImageVersion: number;
  refreshProfileImage: () => void;
}

const defaultUserState: UserAuthState = {
  email: null,
  id: null,
  username: null,
  role: null,
  token: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getAuthFromStorage = (): UserAuthState => {
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access_token"); 

  return {
    email,
    id,
    username,
    role,
    token
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserAuthState>(() => getAuthFromStorage());
  const [profileImageVersion, setProfileImageVersion] = useState(0);

  const refreshAuth = () => {
    const authState = getAuthFromStorage();
    setUser(authState);
  };

  const refreshProfileImage = () => {
    setProfileImageVersion((prev) => prev + 1);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("access_token");
    setUser(defaultUserState);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      refreshAuth,
      logout,
      profileImageVersion,
      refreshProfileImage,
    }),
    [user,profileImageVersion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};