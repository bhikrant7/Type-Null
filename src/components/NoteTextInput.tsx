"use client";

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useEffect, useState } from "react";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  startingNoteTitle: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteTitle, startingNoteText }: Props) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();
  const [noteTitle, setNoteTitle] = useState(startingNoteTitle);

  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setNoteText(text);

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateNoteAction(noteId, noteTitle, text);
    }, 1500);
  };

  const handleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNoteTitle(title);

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateNoteAction(noteId, noteTitle, noteText);
    })
  };

  return (
    <>
      <input
        value={noteTitle}
        type="text"
        onChange={handleUpdateTitle}
        placeholder="Enter note title..."
        className="mb-4 w-full max-w-4xl border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md shadow-sm"
      />
      <Textarea
        value={noteText}
        onChange={handleUpdateNote}
        placeholder="Type your notes here.."
        className="custom-scrollbar mb-4 h-full max-w-4xl resize-none border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </>
  );
}

export default NoteTextInput;
