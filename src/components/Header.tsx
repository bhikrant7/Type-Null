import { shadow } from "@/styles/utils";

import Link from "next/link";
import { Button } from "./ui/button";

import LogOutButton from "./authUI/LogOutButton";
// import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";

async function Header() {
  const user = null;
  // const user = await getUser();

  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      {/* <SidebarTrigger className="absolute top-1 left-1" /> */}

      <Link className="flex items-end gap-2" href="/">

        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
          360 <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
