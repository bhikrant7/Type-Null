"use client";

import AnalyseButton from "@/components/AnalyseButton";
import { useStore } from "../store/useStore";
import axios from "axios";
import AnalysisReport from "../components/CustomPopup/AnalysisReport";

export default function AnalyseButtonWrapper() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

  const { note, setNoteAnalysisReport } = useStore();
  const handleAnalyseNote = async () => {
    try {
      console.log("Note data:", note); // Debugging
      if (!note) {
        console.warn("No note available!");
        return;
      }

      const analyseRequestBody = {
        title: note.title,
        filename: useStore.getState().uploads[0]?.filename || "",
        text: note.text,
      };

      const response = await axios.post(
        `${API_BASE_URL}/get-analysis`,
        analyseRequestBody,
      );

      console.log("analyseRequestBody: ", analyseRequestBody);

      setNoteAnalysisReport({
        accuracy: response.data.accuracy,
        missing_info: response.data.missing_info,
        roadmap: response.data.roadmap
      })

    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <>
      <AnalysisReport />
      <AnalyseButton onClick={handleAnalyseNote} />
    </>
  );
}