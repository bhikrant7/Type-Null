
import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";
import AnalyseButton from "@/components/AnalyseButton";
import { Chatbot } from "@/components/CustomChatBot/chatbot";
import ClientWrapper from "@/components/ClientWrapper";
import AnalyseButtonWrapper from "@/components/AnalyseButtonWrapper";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const userInfo = await getUser();
  

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: userInfo?.id },
  });

  return (
    <div className="flex h-full items-center justify-between gap-4">
      <ClientWrapper userId={userInfo?.id || null} email={userInfo?.email || null} />

      <div className="flex flex-col items-center h-full w-3/4">
        <div className="flex w-full max-w-4xl justify-end gap-2 pb-2">
          <AnalyseButtonWrapper note={note} />
          <AskAIButton user={userInfo} />
          <NewNoteButton user={userInfo} />
        </div>

        <NoteTextInput noteId={noteId} startingNoteTitle={note?.title || ""} startingNoteText={note?.text || ""} />

        <HomeToast />
      </div>
      <div className="h-fit w-1/4">
        <Chatbot />
      </div>
    </div>
  );
}

export default HomePage;
