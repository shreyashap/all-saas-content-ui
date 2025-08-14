import { useState, useEffect } from "react";

export function useUser() {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    tenantId: string;
  }
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      //   console.log(user);
      if (user) {
        const data = JSON.parse(user);
        if (data) {
          setUser(data);
        }
      }
    } catch (e) {
      console.error("Failed to parse user data from local storage", e);
      setUser(null);
    }
  }, []);

  return user;
}
