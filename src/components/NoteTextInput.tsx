"use client";

import { ChangeEvent } from "react";
import { Textarea } from "./ui/textarea";
import { useStore } from "@/store/useStore";
import { updateNoteAction } from "@/actions/notes";
import { supabase } from "@/lib/supabaseClient";

let updateTimeout: NodeJS.Timeout;

function NoteTextInput() {
  const { note, setNote } = useStore();

  const updateNote = async (noteId: string, title: string, text: string) => {
    try {
      const { data, error } = await supabase
        .from("Note")
        .update({
          title: title,
          text: text
        })
        .eq('id', noteId)
        .select();
      console.log("data: ", data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNote({
      ...note,
      id: note.id,
      title: note.title, 
      text: text
    });

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      // updateNoteAction(note.id, note.title, note.text);
      updateNote(note.id, note.title, text)
    }, 1500);
  };

  const handleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNote({
      ...note,
      id: note.id,
      title: title, 
      text: note.text
    })

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      // updateNoteAction(note.id, note.title, note.text);
      updateNote(note.id, title, note.text)
    }, 1500);
  };

  return (
    <>
      <input
        value={note.title}
        type="text"
        onChange={handleUpdateTitle}
        placeholder="Enter note title..."
        className="mb-4 w-full max-w-4xl border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md shadow-sm"
      />
      <Textarea
        value={note.text}
        onChange={handleUpdateNote}
        placeholder="Type your notes here.."
        className="custom-scrollbar mb-4 h-full max-w-4xl resize-none border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </>
  );
}

export default NoteTextInput;
