"use client";

import AnalyseButton from "@/components/AnalyseButton";
import { useStore } from "../store/useStore";
import AnalysisReport from "../components/CustomPopup/AnalysisReport";

export default function AnalyseButtonWrapper() {

  const { note } = useStore();
  const handleAnalyseNote = async () => {
    try {
      console.log("Note data:", note); // Debugging
      if (!note) {
          console.warn("No note available!");
          return;
      }

      let analyseRequestBody = {
        title: note.title,
        filename: "",
        text: note.text,
      };
      console.log("analyseRequestBody: ", analyseRequestBody);
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