"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from "react";

const Client = ({ accessToken, user }: { accessToken: string; user: any }) => {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    login(user)
    localStorage.setItem("accessToken", accessToken);
    router.push("/patient");
  }, [accessToken]);

  return <div></div>;
};

export default Client;
