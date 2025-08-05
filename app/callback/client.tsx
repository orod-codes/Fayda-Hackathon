"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from "react";

const Client = ({ accessToken, user }: { accessToken: string; user: any }) => {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Get saved password
      const savedPassword = localStorage.getItem("temp_password");

  if (!savedPassword) {
    // Handle missing password (show error, redirect, etc.)
    console.error("No password found in localStorage.");
    return;
  }
    // ✅ Store full user + password in localStorage
    const fullUser = {
      ...user,
      password: savedPassword,
    };

    localStorage.setItem("patient_user", JSON.stringify(fullUser));
    localStorage.removeItem("temp_password"); // clean up


      fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullUser),
  })
    .then(res => res.json())
    .then(data => {
      console.log("User saved:", data);
    })
    .catch(err => {
      console.error("Error saving user:", err);
    });


    
    // Login and navigate
    login(fullUser);
    localStorage.setItem("accessToken", accessToken);
    router.push("/patient");
  }, [accessToken]);

  return <div>Logging you in...</div>;
};

export default Client;
