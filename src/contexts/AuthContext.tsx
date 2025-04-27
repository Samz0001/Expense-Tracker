import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>; // Alias
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ username }));
        localStorage.setItem("token", data.token);
        setUser({ username });
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Network error during login");
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to signup");
      }
    } catch (error: any) {
      throw new Error(error.message || "Network error during signup");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, register: signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
