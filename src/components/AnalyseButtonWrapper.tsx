"use client";

import AnalyseButton from "@/components/AnalyseButton";

export default function AnalyseButtonWrapper({ note }: { note?: any }) {
  const handleAnalyseNote = async () => {
    try {
      if (!note) return;

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

  return <AnalyseButton onClick={handleAnalyseNote} />;
}
