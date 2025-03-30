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
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useEffect, useRef } from "react";

interface AppSidebarProps {
  user: any;
  notes: Note[];
}

function AppSidebar({ user, notes }: AppSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, addUpload } = useStore(); // Zustand store

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newUpload = {
        id: crypto.randomUUID(), // Generate unique ID
        filename: file.name,
        file: file
      };
      addUpload(newUpload); // Add to Zustand store
    }
  };

  useEffect(() => {
    console.log('uploads:', uploads);
  }, [uploads])

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
            <Button onClick={() => fileInputRef.current?.click()}>
              Upload a file
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
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
