import { CreateCollectionForm } from "@/components/custom/CreateCollectionForm";
import { SuperAdminSidebar } from "@/components/custom/Tenant/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Content from "./Content";
import Users from "@/components/custom/Users/Users";
import CreateUser from "@/components/custom/Users/CreateUser";
import Collection from "@/components/custom/Collection/Collection";
import { useParams } from "react-router";

function TenantDashboard() {
  const [section, setSection] = useState("Dashboard");
  const { id } = useParams();

  useEffect(() => {
    if (id) localStorage.setItem("tenantId", id);
  });

  return (
    <div className="flex">
      <SuperAdminSidebar section={section} setSection={setSection} />
      <main className="md:ml-60 p-10 w-full bg-gradient-to-r from-gray-50 to-blue-50 min-h-screen overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          {section === "Dashboard" && (
            <Button
              className="bg-brand hover:bg-brand-dark text-white w-36 h-8 text-sm text-wrap md:w-40 md:h-10 md:text-md"
              onClick={() => setSection("Create Collection")}
            >
              + Create Collection
            </Button>
          )}

          {section === "Users" && (
            <Button
              className="bg-brand hover:bg-brand-dark text-white w-36 h-8 text-sm text-wrap md:w-40 md:h-10 md:text-md"
              onClick={() => setSection("Create User")}
            >
              + Create User
            </Button>
          )}
        </div>

        {section === "Dashboard" && <Collection id={id} />}
        {section === "Create Collection" && <CreateCollectionForm />}
        {section === "Content" && <Content />}

        {section === "Users" && <Users id={id} />}
        {section === "Create User" && <CreateUser />}
      </main>
    </div>
  );
}

export default TenantDashboard;
