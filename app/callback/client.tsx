"use client";
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from "react";

const Client = ({ accessToken, user }: { accessToken: string; user: any }) => {
  const { login } = useAuth();

  useEffect(() => {
    login(user)
    localStorage.setItem("accessToken", accessToken);
  }, [accessToken]);

  return <div></div>;
};

export default Client;
