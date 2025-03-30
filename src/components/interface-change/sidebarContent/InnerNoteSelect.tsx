"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
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
  fileId: string;
  updatedAt: string;
};

type Props = {
  userId: string;
  fileId: string;
};

function InnerNoteSelect({ userId, fileId }: Props) {
  const [searchText, setSearchText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Commenting out database query, using custom data for now
    // const fetchNotes = async () => {
    //   const { data, error } = await supabase
    //     .from("Note")
    //     .select("*")
    //     .eq("authorId", userId)
    //     .eq("fileId", fileId)
    //     .order("updatedAt", { ascending: false });

    //   if (!error) setNotes(data || []);
    // };

    // fetchNotes();

    // Dummy notes for testing
    setNotes([
      {
        id: "1",
        text: "This is the first note",
        authorId: userId,
        fileId: fileId,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Another note for testing",
        authorId: userId,
        fileId: fileId,
        updatedAt: new Date().toISOString(),
      },
    ]);
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

  return (
    <>
      {filteredNotes.map((note) => (
        <Card className="w-[230px]" key={note.id}>
          <CardHeader>
            <CardTitle>Note</CardTitle>
            <CardDescription>{note.text}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default InnerNoteSelect;
