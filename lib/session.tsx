"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BASE, User } from "./core";

export const SessionContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const SessionProvider = ({
  children,
  authToken,
}: {
  children: React.ReactNode;
  authToken: string | undefined;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = authToken;

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${BASE}/api/auth/validate`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            const body = await res.json();
            setUser(body);
          }
        } catch (error) {
          console.error("Error during token validation:", error);
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useUser = () => useContext(SessionContext);
