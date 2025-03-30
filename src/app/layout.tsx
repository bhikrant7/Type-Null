import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header"; // Adjust the path as needed

// Define the RootLayoutProps type
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col">
              <Header />
            </div>
            <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
              {children}
            </main>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}

export const metadata: Metadata = {
  title: "NoteAI App",
};
