import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/custom/DashboardLayout";
import { CreateCollectionForm } from "../components/custom/CreateCollectionForm";
import { Button } from "../components/ui/button";
import ReviewerDashboard from "@/components/custom/Reviewer/Reviewer";
import Content from "./Content";
import CreateUser from "@/components/custom/Users/CreateUser";
import Users from "@/components/custom/Users/Users";
import Collection from "../components/custom/Collection/Collection";
import CreateTenant from "@/components/custom/Tenant/CreateTenant";
import MyTenants from "@/components/custom/Tenant/MyTenats";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// export interface Collection {
//   _id: string;
//   name: string;
//   collectionId: string;
//   title: string;
//   description: string;
//   category?: string;
//   author?: string;
//   language: string;
//   difficulty: string;
//   status: string;
//   tags?: string[];
// }

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
};

export default function DashboardPage() {
  const [section, setSection] = useState<string>("Dashboard");
  const [role, setRole] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
      setRole(parsedUser.role);
      if (parsedUser.role === "SuperAdmin") setSection("Tenants");

      const fullName = parsedUser.name.split(" ");
      if (typeof fullName) {
        setFirstName(fullName[0]);
        setLastName(fullName[1]);
      } else {
        setFirstName(fullName);
      }
    }
  }, []);

  const isVisible =
    role === "Admin" || role === "Author" || role === "SuperAdmin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <DashboardLayout setSection={setSection} section={section}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="flex justify-between items-center gap-4">
          {section === "Dashboard" && isVisible && (
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

          <div>
            <Avatar
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              <AvatarFallback className="px-2 py-1 bg-blue-100 rounded-full">
                {firstName[0]?.toUpperCase()}
                {lastName && lastName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isProfileOpen && (
              <Card className=" absolute right-6 top-20 translate-y-1 duration-75 ease-in">
                <CardHeader className="border-b h-8">
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="hover:bg-gray-100">
                  <p className="inline-flex gap-2 items-center ">
                    <User className="w-4 h-4 text-green-400" />
                    {user?.name}
                  </p>
                </CardContent>
                <CardContent className="hover:bg-gray-100">
                  <p className="inline-flex gap-2 items-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                    {user?.email}
                  </p>
                </CardContent>
                <CardFooter className="border-t h-10">
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {section === "Dashboard" && role !== "Reviewer" && (
        <Collection id={user?.tenantId} />
      )}

      {section === "Dashboard" && role === "Reviewer" && <ReviewerDashboard />}

      {section === "Create Collection" && role !== "Reviewer" && (
        <CreateCollectionForm />
      )}
      {section === "Content" && role !== "Reviewer" && <Content />}

      {section === "Users" && role !== "Reviewer" && role !== "Author" && (
        <Users id={user?.tenantId} />
      )}
      {section === "Create User" &&
        role !== "Reviewer" &&
        role !== "Author" && <CreateUser />}
      {section === "Create Tenant" && role === "SuperAdmin" && <CreateTenant />}
      {section === "Tenants" && role === "SuperAdmin" && <MyTenants />}
    </DashboardLayout>
  );
}
