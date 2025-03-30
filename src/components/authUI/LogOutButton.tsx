"use client";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { logOutAction } from "@/actions/users";

function LogOutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    alert("Logged Out");
    // const { errorMessage } = await logOutAction();
    const errorMessage = null;

    if (!errorMessage) {
      router.push(`/?toastType=logOut`);
    } else {
      toast("Error", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => console.log("Undo"),
        },
      });
    }

    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogOutButton;
