import { Toaster } from "@/components/ui/sonner";
import DashboardPage from "./pages/dashboard";
import { Routes, Route } from "react-router";
import CollectionDetailsPage from "./pages/CollectionDetailsPage";

// const collection = {
//   _id: "dlsjdjljsd",
//   name: "Teacher",
//   description: "This is an english subject",
//   language: "en",
//   author: "Ekstep",
//   category: "word",
//   status: "live",
// };

function App() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<DashboardPage role="author" />} />
        <Route path="dashboard/:id" element={<CollectionDetailsPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
