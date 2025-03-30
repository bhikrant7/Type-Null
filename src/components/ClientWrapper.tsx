"use client"; // This makes it a Client Component

import { useStore } from "@/store/useStore";
import { useEffect } from "react";

type Props = {
  userId: string | null;
  email: string | null;
};

export default function ClientWrapper({ userId, email }: Props) {
  const { user, setUser } = useStore();

  useEffect(() => {
    if (!user && userId && email) {
      setUser({ id: userId, email });
    }
  }, [userId, email, setUser]);

  return null; // This component doesn't render anything
}
