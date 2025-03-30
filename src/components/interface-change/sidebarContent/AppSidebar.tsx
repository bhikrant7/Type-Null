"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "../../SidebarGroupContent";
import { useStore } from "@/store/useStore";
import { useRef } from "react";

interface AppSidebarProps {
  user: any;
  notes: Note[];
}

function AppSidebar({ user, notes }: AppSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads } = useStore(); // Zustand store

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              "Your Uploads"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                to see your uploads
              </p>
            )}
          </SidebarGroupLabel>
          {uploads.length > 0 && (
            <ul className="mt-2">
              {uploads.map((upload) => (
                <li key={upload.id} className="text-sm">
                  {upload.filename}
                </li>
              ))}
            </ul>
          )}
          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
