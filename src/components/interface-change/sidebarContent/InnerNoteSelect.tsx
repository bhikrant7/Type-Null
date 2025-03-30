"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { supabase } from "@/lib/supabaseClient";
import SelectNoteButton from "../../SelectNoteButton";
import DeleteNoteButton from "../../DeleteNoteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Note = {
  id: string;
  text: string;
  authorId: string;
  updatedAt: string;
};

function InnerNoteSelect({ userId, fileId }: { userId: string; fileId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId || !fileId) return;

      const { data, error } = await supabase
        .from("Note")
        .select("*")
        .eq("authorId", userId)
        .eq("uploadId", fileId) // Fetch notes under the selected file
        .order("updatedAt", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error.message);
        return;
      }

      setNotes(data || []);
    };

    fetchNotes();
  }, [userId, fileId]);

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ["text"],
      threshold: 0.2,
    });
  }, [notes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : notes;

  const deleteNoteLocally = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  return (
    <>
      {filteredNotes.length === 0 ? (
        <p>No notes found under this file.</p>
      ) : (
        filteredNotes.map((note) => (
          <Card className="w-[230px]" key={note.id}>
            <CardHeader>
              <CardTitle>Note</CardTitle>
              <CardDescription>{note.text}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Edit</Button>
              <DeleteNoteButton noteId={note.id} onDelete={deleteNoteLocally} />
            </CardFooter>
          </Card>
        ))
      )}
    </>
  );
}

export default InnerNoteSelect;
