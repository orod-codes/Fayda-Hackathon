'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { importJWK, decodeJwt, SignJWT } from "jose";
import { getUserInfo } from "../../lib/auth";
import axios, { isAxiosError } from "axios";
import Client from "./client";

export const generateSignedJwt = async () => {
  const { CLIENT_ID, TOKEN_ENDPOINT, PRIVATE_KEY } = process.env;

  const header = { alg: "RS256", typ: "JWT" };

  const payload = {
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    aud: TOKEN_ENDPOINT,
  };

  const jwkJson = Buffer.from(PRIVATE_KEY!, "base64").toString();
  const jwk = JSON.parse(jwkJson);
  const privateKey = await importJWK(jwk, "RS256");

  return await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privateKey);
};

export const dynamic = 'force-dynamic';

const page = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const code = searchParams.code;
  if (!code || Array.isArray(code)) {
    return <div>Invalid code</div>;
  }
  try {
    const jwt = await generateSignedJwt();

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      client_assertion_type: process.env.CLIENT_ASSERTION_TYPE!,
      client_assertion: jwt,
      code_verifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
    });

    const response = await axios.post(
      process.env.TOKEN_ENDPOINT!,
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const accessToken = response.data.access_token;

    const user = await getUserInfo(accessToken);

    return (
      <div>
        {/* pass to the client so that to store the access token in user's local storage */}
        <Client user={user} accessToken={accessToken} />
        <h1>Success</h1>
      </div>
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    } else console.log(error);
    return <div>Error</div>;
  }
};

export default page;
