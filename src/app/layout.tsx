import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import InnerNoteSelect from "@/components/interface-change/sidebarContent/InnerNoteSelect";
import AppSidebar from "@/components/interface-change/sidebarContent/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";
import AppSidebarWrapper from "@/components/AppSidebarWrapper";

export const metadata: Metadata = {
  title: "360 Notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <SidebarProvider>
              <AppSidebarWrapper />

              <div className="flex min-h-screen w-full flex-col">
                <Header />
                <div className="flex w-full flex-row mt-2 ml-2">
                  {/* <div className="flex h-[300px] flex-col gap-2">
                    <h1 className="pl-6 pt-4 font-bold">Self notes of the upload</h1>
                    <InnerNoteSelect />
                    
                  </div> */}
                  <main className="flex min-h-screen flex-1 flex-col px-2 pt-10 xl:px-4">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>

            <Toaster />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
