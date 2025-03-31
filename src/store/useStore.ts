import { report } from "process";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types
type User = {
  id: string;
  email: string;
};

type Upload = {
  id: string;
  filename: string;
  file: File
};

type Note = {
  id: string;
  title: string;
  text: string;
  uploadId: string;
  authorId: string;
  fileId: string;
  updatedAt: string;
};

type NoteAnalysisReport = {
  accuracy: string;
  missing_info: string[];
  roadmap: string[];
}

// Define Zustand store
interface AppState {
  user: User | null;
  uploads: Upload[];
  note: Note;
  notes: Note[];
  noteAnalysisReport: NoteAnalysisReport | null;

  // Actions
  setNote: (note: Note) => void;
  setUser: (user: User) => void;
  setNoteAnalysisReport: (report: NoteAnalysisReport | null) => void;
  addUpload: (upload: Upload) => void;
  removeUpload: (id: string) => void;
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  clearNote: () => void;
}

// Zustand store with persistence for user
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      uploads: [],
      note: {
        id: "",
        title: "",
        text: "",
        uploadId: "",
        authorId: "",
        fileId: "",
        updatedAt: "",
      },
      noteAnalysisReport: null,
      notes: [],
      setNoteAnalysisReport: (report) => set({ noteAnalysisReport: report }),

      // Set user (Persisted)
      setUser: (user) => set({ user }),

      setNote: (note) => set({ note }),

      // Upload actions
      addUpload: (upload) =>
        set((state) => ({ uploads: [...state.uploads, upload] })),
      removeUpload: (id) =>
        set((state) => ({ uploads: state.uploads.filter((u) => u.id !== id) })),

      // Note actions
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      removeNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),

      clearNote: () => set((state) => ({ note: {
        id: "",
        title: "",
        text: "",
        uploadId: "",
        authorId: "",
        fileId: "",
        updatedAt: ""
      } }))
    }),
    { name: "user-storage", partialize: (state) => ({ user: state.user }) } // Persist only 'user'
  )
);
