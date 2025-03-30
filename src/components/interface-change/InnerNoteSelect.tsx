"use client";

import { Note } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "../SelectNoteButton"; // Update the path to the correct location
import DeleteNoteButton from "../DeleteNoteButton"; // Update the path to the correct location
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  notes: Note[];
};

function InnerNoteSelect({ notes }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: 0.8,
    });
  }, [localNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId),
    );
  };
  return(
    <Card>
        <CardHeader>
            <CardTitle></CardTitle>
        </CardHeader>
    </Card>
  )
}
