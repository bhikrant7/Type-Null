"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function Chatbot() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { uploads, addUpload } = useStore(); // Zustand store
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    filename: string;
  } | null>(null);
  const { user } = useStore();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/upload-pdf`, formData);
  //     // const response = await axios.post(`${API_BASE_URL}/upload-pdf`, formData, {
  //     //   headers: { "Content-Type": "multipart/form-data" },
  //     // });

  //     console.log("Upload successful:", response.data);
  //     if(response.data){
  //       alert("File Uploaded Successfully")
  //     }

  //     const newUpload = { id: crypto.randomUUID(), filename: file.name };
  //     addUpload(newUpload); // ✅ Correct way to update Zustand state
  //     setUploadedFile(newUpload);
  //   } catch (error) {
  //     console.error("File upload failed:", error);
  //     alert("Failed to upload file. Please try again."); // ✅ Better error handling
  //   }
  // };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isPDF = file.type === "application/pdf";
    const isVideo = file.type.startsWith("video/");

    if (!isPDF && !isVideo) {
      alert("Only PDF and video files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-${isPDF ? "pdf" : "video"}`,
        formData,
      );

      console.log("Upload successful:", response.data);
      alert(`${isPDF ? "PDF" : "Video"} uploaded successfully!`);
      if (response.data) {
        //query here
        if (!user) {
          console.log("No user:", user);
          return;
        }

        const { data, error } = await supabase.from("Upload").insert([
          {
            id: crypto.randomUUID(),
            filename: file.name,
            userId: user.id,
          },
        ]);
      }

      const newUpload = { id: crypto.randomUUID(), filename: file.name };
      addUpload(newUpload);
      setUploadedFile(newUpload);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        query: input,
        filename: useStore.getState().uploads[0]?.filename || "",
      });

      console.log("Response from Ft", response.data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message || "I'm a placeholder response.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          content: "Error in chat response.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Uploads:", uploads);
  }, [uploads]);

  return (
    <div className="flex min-h-[90vh] w-full max-w-2xl flex-col rounded-lg border bg-card shadow-lg">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Chat with your file</h2>
        {uploadedFile ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <FileText className="h-4 w-4" />
            <span>{uploadedFile.filename}</span>
          </div>
        ) : (
          <Button className="ml-12" onClick={() => fileInputRef.current?.click()}>
            Upload a file
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
            key={message.id}
            className={cn(
              "flex w-full max-w-[80%] flex-col gap-1 rounded-lg px-4 py-2",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <div className="flex items-center gap-2">
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
              <span className="text-sm">
                {message.role === "user" ? "You" : "Assistant"}
              </span>
            </div>
          
            {/* ✅ Fixes overflow by enforcing proper wrapping */}
            <p className="text-sm break-words whitespace-pre-wrap overflow-hidden text-ellipsis">
              {message.content}
            </p>
          
            <span className="text-xs opacity-50">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-pulse">●</div>
              <div className="animation-delay-200 animate-pulse">●</div>
              <div className="animation-delay-400 animate-pulse">●</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t p-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
