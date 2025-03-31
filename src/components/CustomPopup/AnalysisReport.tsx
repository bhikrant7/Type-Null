// components/CustomPopup/AnalysisReport.tsx

"use client";

import { useStore } from "@/store/useStore";

const Popup = () => {
  const { noteAnalysisReport, setNoteAnalysisReport } = useStore();

  if (!noteAnalysisReport) return null; // Don't render if there's no response

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={() => setNoteAnalysisReport(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Result</h2>
        
        <p className="text-gray-700">
          <strong>Accuracy:</strong> {typeof noteAnalysisReport?.accuracy === "number" ? (noteAnalysisReport.accuracy * 100).toFixed(2) : "N/A"} %
        </p>

        <div className="mt-3">
          <h3 className="font-medium text-gray-800">Missing Info:</h3>
          {noteAnalysisReport.missing_info.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {noteAnalysisReport.missing_info.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No missing information.</p>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-medium text-gray-800">Roadmap:</h3>
          {noteAnalysisReport.roadmap.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {noteAnalysisReport.roadmap.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No roadmap available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
