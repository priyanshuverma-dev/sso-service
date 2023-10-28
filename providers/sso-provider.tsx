"use client";
import { SSO_API_ROUTE } from "@/app/api/sso/route";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  authToken: string | undefined;
  children: React.ReactNode;
};

const SSOCover = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authToken = props.authToken;
  const clientId = searchParams.get("clientId");
  const next = searchParams.get("next");
  const clientSecret = searchParams.get("clientSecret");
  const callback = searchParams.get("callback");

  useEffect(() => {
    if (authToken) {
      fetch(SSO_API_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          domain: next,
          clientId,
          token: authToken,
        }),
      })
        .then(async (res) => {
          const body = await res.json();
          console.log(body);
          if (res.status == 200) {
            router.replace(`${callback}?code=${body.identifier}`);
          }
          //   redirect(`${callback}?code=${body.identifier}`);
        })
        .catch((e) => console.log(e));
    }
  }, [authToken, clientId, callback, next]);

  return <div>{props.children}</div>;
};

export default SSOCover;
