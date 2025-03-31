"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import axios from "axios";
// import openai from "@/openai";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (
  noteId: string,
  title: string,
  text: string,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    const response = await prisma.note.update({
      where: { id: noteId },
      data: { title, text },
    });
    console.log("response: ", response);
    return { errorMessage: null };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  // Sending notes to upload API
  await axios.post(`${API_BASE_URL}/upload-notes`, {
    notes: formattedNotes,
    note_id: "1",
  });

  // Sending a chat request with the first question (assuming you want to ask about notes)
  if (newQuestions.length === 0) {
    return "Please provide a question to ask about your notes.";
  }

  try {
    const chatResponse = await axios.post(`${API_BASE_URL}/chat-with-notes`, {
      query: newQuestions[0], // Assuming you're sending the first question
      note_id: "1",
    });

    return chatResponse.data.message; // Returning the AI's response
  } catch (error) {
    console.error("Error in chat-with-notes:", error);
    return "An error occurred while querying AI.";
  }
};

