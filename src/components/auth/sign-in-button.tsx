"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth-client";

export function SignInButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Button disabled>Loading...</Button>;
  }

  if (session) {
    return null;
  }

  return (
    <Button
      onClick={async () => {
        await signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      }}
    >
      Sign in
    </Button>
  );
}
