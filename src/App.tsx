import { Toaster } from "@/components/ui/sonner";
import DashboardPage from "./pages/dashboard";
import { Routes, Route } from "react-router";
import CollectionDetailsPage from "./pages/CollectionDetailsPage";
import EditContentPage from "./pages/EditContent";
import Login from "./pages/Login";
import EnvSelector from "./pages/EnvSelector";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import TenantDashboard from "./pages/TenantDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/env-select" element={<EnvSelector />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/:id"
          element={
            <ProtectedRoute>
              <CollectionDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/content-edit/:contentId"
          element={
            <ProtectedRoute>
              <EditContentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="tenant/:id"
          element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
