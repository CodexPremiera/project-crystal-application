import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://www.crystalapp.tech";

export const AuthButton = () => {
  return (
    <SignedOut>
      <div className="flex gap-x-3 h-[120px] pt-12 justify-center items-center">
        <SignInButton mode="modal" fallbackRedirectUrl={APP_URL} forceRedirectUrl={APP_URL}>
          <Button
            variant="secondary"
            className="px-10 rounded-full hover:bg-[#D0D0D0]">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" fallbackRedirectUrl={APP_URL} forceRedirectUrl={APP_URL}>
          <Button variant="default" className="px-10 rounded-full border-1 hover:bg-[#262626]">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  );
};
