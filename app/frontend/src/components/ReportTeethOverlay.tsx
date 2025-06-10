import individualTeethImg from "@/assets/individual_teeth.jpg";
import React, { Dispatch, SetStateAction } from "react";

interface ReportTeethOverlayProps {
  report: Record<string, string[]>;
  selectedTooth: string | null;
  setSelectedTooth: Dispatch<SetStateAction<string | null>>;
}

// Bounding box positions as percentages (relative to image width/height)
const toothBoxDefs = [
  { id: "tooth1", label: "Upper Tooth 1", top: 0.315, left: 0.05, width: 0.045, height: 0.2 },
  { id: "tooth2", label: "Upper Tooth 2", top: 0.33, left: 0.108, width: 0.049, height: 0.2 },
  { id: "tooth3", label: "Upper Tooth 3", top: 0.33, left: 0.175, width: 0.055, height: 0.21 },
  { id: "tooth4", label: "Upper Tooth 4", top: 0.34, left: 0.24, width: 0.045, height: 0.2 },
  { id: "tooth5", label: "Upper Tooth 5", top: 0.34, left: 0.29, width: 0.045, height: 0.2 },
  { id: "tooth6", label: "Upper Tooth 6", top: 0.33, left: 0.341, width: 0.042, height: 0.22 },
  { id: "tooth7", label: "Upper Tooth 7", top: 0.33, left: 0.395, width: 0.036, height: 0.21 },
  { id: "tooth8", label: "Upper Tooth 8", top: 0.34, left: 0.445, width: 0.045, height: 0.21 },
  { id: "tooth9", label: "Upper Tooth 9", top: 0.33, left: 0.5, width: 0.041, height: 0.22 },
  { id: "tooth10", label: "Upper Tooth 10", top: 0.33, left: 0.55, width: 0.045, height: 0.2 },
  { id: "tooth11", label: "Upper Tooth 11", top: 0.31, left: 0.605, width: 0.045, height: 0.23 },
  { id: "tooth12", label: "Upper Tooth 12", top: 0.33, left: 0.66, width: 0.038, height: 0.2 },
  { id: "tooth13", label: "Upper Tooth 13", top: 0.31, left: 0.708, width: 0.036, height: 0.22 },
  { id: "tooth14", label: "Upper Tooth 14", top: 0.315, left: 0.757, width: 0.059, height: 0.21 },
  { id: "tooth15", label: "Upper Tooth 15", top: 0.30, left: 0.831, width: 0.059, height: 0.21 },
  { id: "tooth16", label: "Upper Tooth 16", top: 0.30, left: 0.896, width: 0.047, height: 0.2 },
  // Lower teeth, left/width/height copied from upper teeth
  { id: "tooth17", label: "Lower Tooth 17", top: 0.63, left: 0.05, width: 0.0495, height: 0.2 },
  { id: "tooth18", label: "Lower Tooth 18", top: 0.63, left: 0.108, width: 0.055, height: 0.2 },
  { id: "tooth19", label: "Lower Tooth 19", top: 0.615, left: 0.175, width: 0.058, height: 0.2 },
  { id: "tooth20", label: "Lower Tooth 20", top: 0.62, left: 0.24, width: 0.045, height: 0.2 },
  { id: "tooth21", label: "Lower Tooth 21", top: 0.62, left: 0.293, width: 0.04, height: 0.2 },
  { id: "tooth22", label: "Lower Tooth 22", top: 0.605, left: 0.349, width: 0.042, height: 0.22 },
  { id: "tooth23", label: "Lower Tooth 23", top: 0.605, left: 0.405, width: 0.036, height: 0.21 },
  { id: "tooth24", label: "Lower Tooth 24", top: 0.605, left: 0.45, width: 0.045, height: 0.21 },
  { id: "tooth25", label: "Lower Tooth 25", top: 0.59, left: 0.5, width: 0.038, height: 0.22 },
  { id: "tooth26", label: "Lower Tooth 26", top: 0.59, left: 0.55, width: 0.04, height: 0.21 },
  { id: "tooth27", label: "Lower Tooth 27", top: 0.595, left: 0.596, width: 0.045, height: 0.23 },
  { id: "tooth28", label: "Lower Tooth 28", top: 0.595, left: 0.657, width: 0.038, height: 0.21 },
  { id: "tooth29", label: "Lower Tooth 29", top: 0.595, left: 0.708, width: 0.038, height: 0.22 },
  { id: "tooth30", label: "Lower Tooth 30", top: 0.595, left: 0.757, width: 0.058, height: 0.21 },
  { id: "tooth31", label: "Lower Tooth 31", top: 0.595, left: 0.827, width: 0.06, height: 0.21 },
  { id: "tooth32", label: "Lower Tooth 32", top: 0.6, left: 0.894, width: 0.054, height: 0.2 },
];

const ReportTeethOverlay: React.FC<ReportTeethOverlayProps> = ({ report, selectedTooth, setSelectedTooth }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <img
        src={individualTeethImg}
        alt="Individual Teeth"
        className="w-full h-auto select-none"
        draggable={false}
        style={{ maxHeight: 600 }}
      />
      {toothBoxDefs.map((tooth, idx) => {
        const toothNumber = (idx + 1).toString();
        const anomalies = Array.isArray(report[toothNumber]) ? report[toothNumber] : [];
        const hasAnomaly = anomalies.length > 0;
        return (
          <div
            key={tooth.id}
            className={`absolute border-2 rounded cursor-pointer transition-all duration-150 flex flex-col items-center justify-center ${
              hasAnomaly ? 'border-red-500 bg-red-200/20 shadow-red-400/20 shadow' : 'border-blue-300'
            } ${selectedTooth === tooth.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              left: `${tooth.left * 100}%`,
              top: `${tooth.top * 100}%`,
              width: `${tooth.width * 100}%`,
              height: `${tooth.height * 100}%`,
              boxSizing: 'border-box',
            }}
            onClick={() => setSelectedTooth(tooth.id)}
            title={tooth.label}
          >
            {/* No number or label inside the box */}
          </div>
        );
      })}
      {selectedTooth && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-white bg-opacity-95 border border-blue-300 rounded shadow-lg p-4 mt-2 z-20 w-80">
          <h3 className="font-semibold mb-2">Problems for {toothBoxDefs.find(t => t.id === selectedTooth)?.label || selectedTooth}</h3>
          <ul className="list-disc pl-5">
            {(() => {
              const idx = toothBoxDefs.findIndex(t => t.id === selectedTooth);
              const toothNumber = (idx + 1).toString();
              const anomalies = Array.isArray(report[toothNumber]) ? report[toothNumber] : [];
              return anomalies.length > 0
                ? anomalies.map((problem, i) => <li key={i}>{problem}</li>)
                : <li>No anomalies detected</li>;
            })()}
          </ul>
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setSelectedTooth(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportTeethOverlay;
