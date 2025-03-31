"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/store/useStore";

type Props = {
  noteId: string;
  children: React.ReactNode;
};

export default function NoteProvider({ noteId, children }: Props) {
  const { setNote } = useStore()

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;

      try {
        const { data, error } = await supabase
          .from("Note")
          .select("*")
          .eq("id", noteId)
          .single();

        if (error) {
          console.error("Error fetching note:", error);
          return;
        }

        console.log('data: ', data);

        setNote({
            id: data.id,
            title: data.title,
            text: data.text,
            uploadId: data.uploadId,
            authorId: data.authorId,
            fileId: data.fileId,
            updatedAt: data.updatedAt
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchNote();
  }, [noteId, setNote]);

  return <>{children}</>;
}