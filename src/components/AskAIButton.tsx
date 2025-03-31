"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/styles/ai-response.css";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  user: User | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

function AskAIButton({ user }: Props) {
  const router = useRouter();
  const { user: USER } = useStore();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleClickInput = () => textareaRef.current?.focus();

  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);
      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAiUploadButton = async () => {
    if (!user) throw new Error("You must be logged in to ask AI questions");

    const { data: notes, error } = await supabase
      .from("Note")
      .select("text, createdAt, updatedAt")
      .eq("authorId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return;
    }

    if (notes.length === 0) {
      return "You don't have any notes yet.";
    }

    const formattedNotes = notes
      .map(
        (note) => `Text: ${note.text}\nCreated at: ${note.createdAt}\nLast updated: ${note.updatedAt}`
      )
      .join("\n");

    try {
      await axios.post(`${API_BASE_URL}/upload-notes`, {
        notes: formattedNotes,
        note_id: "1",
      });
    } catch (err) {
      console.error("Error uploading notes:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto" ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Ask AI About Your Notes</DialogTitle>
          <DialogDescription>
            Our AI can answer questions about all of your notes
            <Button onClick={handleAiUploadButton} className="ml-32">
              Upload Notes
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-8">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p className="ml-auto max-w-[60%] rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>

        <div className="mt-auto flex cursor-text flex-col rounded-lg border p-4" onClick={handleClickInput}>
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="resize-none border-none bg-transparent p-0 shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button className="ml-auto size-8 rounded-full" onClick={handleSubmit}>
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;
