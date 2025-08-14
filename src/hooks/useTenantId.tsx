import { useState, useEffect } from "react";

export function useUserTenantId() {
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const data = JSON.parse(user);
        if (data && data.tenantId) {
          setTenantId(data.tenantId);
        }
      }
    } catch (e) {
      console.error("Failed to parse user data from local storage", e);
      setTenantId(null);
    }
  }, []);

  return tenantId;
}
