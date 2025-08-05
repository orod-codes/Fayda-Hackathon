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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Logging you in...</h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we complete your authentication</p>
      </div>
    </div>
  );
};

export default Client;
