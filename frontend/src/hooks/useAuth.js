import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    const raw = localStorage.getItem("aduin_user");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (!user?.token) navigate("/login");
    } catch {
      navigate("/login");
    }
  }, [navigate]);
}

export function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem("aduin_user"));
    return user || null;
  } catch {
    return null;
  }
}

export function logout(navigate) {
  localStorage.removeItem("aduin_user");
  navigate("/login");
}