import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import AppSidebar from "../components/interface-change/sidebarContent/AppSidebar";

export default async function AppSidebarWrapper() {
  const user = await getUser();

  let notes: any = [];
  if (user) {
    notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
    });
  }

  return <AppSidebar user={user} notes={notes} />;
}
