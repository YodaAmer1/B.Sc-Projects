import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { HomePage } from "../../Pages/Home/HomePage";
import { PropertiesPage } from "../../Pages/PropertiesPage";
import { RequestsPage } from "../../Pages/RequestsPage";
import { LoginPage } from "../../Pages/LoginPage";
import { RegisterPage } from "@/Pages/RegisterPage";
import { HostHomePage } from "@/Pages/Home/HostHomePage";
import { ProfilePage } from "@/Pages/ProfilePage";
import { AdminHomePage } from "@/Pages/Home/AdminHomePage";
import { EvacueeHomePage } from "@/Pages/Home/EvacueeHomePage";
import { AvailabilitySlots } from "@/Pages/AvailabilitySlots";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "host",
        element: <HostHomePage />,
      },
      {
        path: "admin",
        element: <AdminHomePage />,
      },
      {
        path: "evacuee",
        element: <EvacueeHomePage />,
      },
      {
        path: "properties",
        element: <PropertiesPage />,
      },
      {
        path: "requests",
        element: <RequestsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "properties/:propertyId/availability",
        element: <AvailabilitySlots />,
      },
    ],
  },
]);