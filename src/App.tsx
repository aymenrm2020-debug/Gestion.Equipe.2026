import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Renamed from Index
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { SessionContextProvider } from "./components/SessionContextProvider";
import Layout from "./components/Layout"; // Import the new Layout component
import CalendarPage from "./pages/CalendarPage";
import AttendancePage from "./pages/AttendancePage";
import LeaveRequestsPage from "./pages/LeaveRequestsPage";
import OvertimePage from "./pages/OvertimePage";
import TeamManagementPage from "./pages/TeamManagementPage";
import ReportsPage from "./pages/ReportsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage"; // Import the new ProfileSettingsPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}> {/* Wrap authenticated routes with Layout */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave-requests" element={<LeaveRequestsPage />} />
              <Route path="/overtime" element={<OvertimePage />} />
              <Route path="/team-management" element={<TeamManagementPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile-settings" element={<ProfileSettingsPage />} /> {/* New route */}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;