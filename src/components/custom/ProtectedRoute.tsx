import type React from "react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const envir = localStorage.getItem("env");
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    }
  }, []);

  return <div>{userData && envir && children}</div>;
};

export default ProtectedRoute;
