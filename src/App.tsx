import { Toaster } from "@/components/ui/sonner";
import DashboardPage from "./pages/dashboard";
import { Routes, Route } from "react-router";
import CollectionDetailsPage from "./pages/CollectionDetailsPage";
import EditContentPage from "./pages/EditContent";

function App() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<DashboardPage role="author" />} />
        <Route path="dashboard/:id" element={<CollectionDetailsPage />} />
        <Route
          path="dashboard/content-edit/:contentId"
          element={<EditContentPage />}
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
