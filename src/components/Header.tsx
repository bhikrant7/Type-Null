"use client";

import { shadow } from "@/styles/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import LogOutButton from "./authUI/LogOutButton";
import { Loader } from "lucide-react";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";

export default function Header() {
  const user = null;
  const [isSigningIn, setIsSigningIn] = useState(false);
  const onGoogleSignIn = async (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();

        console.log("Signed in successfully!");
        toast.success("Successfully signed in! 🎉", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#341949",
            color: "#66FF00",
          },
        });

        // Hard refresh after toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Sign-in failed or popup closed:", error);
        toast.error("Sign-in failed. Please try again.", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#341949",
            color: "#FF0000",
          },
        });
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
        Notes <span>360</span>
      </h1>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            {/* <Button asChild>
              <Link href="/sign-up" className="hidden sm:block"> */}
                <button
                  disabled={isSigningIn}
                  onClick={(e) => {
                    onGoogleSignIn(e);
                  }}
                  className={`bg-swatch-2/50 flex w-full items-center justify-center gap-x-3 rounded-lg border p-2.5 text-sm font-medium ${
                    isSigningIn
                      ? "cursor-not-allowed"
                      : "hover:bg-swatch-4/50 transition duration-300 active:bg-gray-100"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_17_40)">
                      <path
                        d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                        fill="#34A853"
                      />
                      <path
                        d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {isSigningIn ? (
                    <div className="inline-flex items-center gap-2">
                      Signing In
                      <Loader className="size-5 animate-spin text-purple-200" />
                    </div>
                  ) : (
                    "Continue with Google"
                  )}
                </button>

              {/* </Link>
            </Button> */}
          </>
        )}
        {/* <DarkModeToggle /> */}
      </div>
    </header>
  );
}
function doSignInWithGoogle() {
    throw new Error("Function not implemented.");
}

