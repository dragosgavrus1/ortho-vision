import React, { useState, useRef } from "react";
import { Button } from "../Button/Button";
import { ZoomIn, ZoomOut } from "lucide-react";

const ZoomableImage = ({ src, scale }: { src: string; scale: number }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (imageRef.current) {
      setDragging(true);
      const offsetX = e.clientX - position.x;
      const offsetY = e.clientY - position.y;
      const onMouseMove = (moveEvent: MouseEvent) => {
        if (dragging) {
          setPosition({
            x: moveEvent.clientX - offsetX,
            y: moveEvent.clientY - offsetY,
          });
        }
      };

      const onMouseUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  };

  return (
    <div
      className="relative"
      style={{
        display: "inline-block",
        textAlign: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt="Zoomable full-size"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: "center center",
          transition: "transform 0.25s ease",
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
          cursor: dragging ? "grabbing" : "grab",
        }}
        className="mx-auto"
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

interface ImageDialogProps {
  src: string;
  report: string; // Add report as a prop
  onClose: () => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ src, report, onClose }) => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => {
    if (scale < 3) setScale(scale + 0.1); // Maximum zoom in factor
  };
  const zoomOut = () => {
    if (scale > 1) setScale(scale - 0.1); // Maximum zoom out factor
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else if (e.deltaY > 0) {
      zoomOut();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
      <div
        className="relative bg-white p-4 rounded-lg w-full max-w-4xl"
        style={{
          maxHeight: "90vh", // Limit the dialog height
          overflow: "hidden", // Prevent content from overflowing
        }}
      >
        {/* Close Button */}
        <Button
          className="absolute top-2 right-2 text-white text-xl z-70"
          onClick={onClose}
        >
          X
        </Button>

        {/* Zoom Controls */}
        <div className="flex justify-start gap-2 mt-4 items-center mb-4 p-2 bg-white border-b">
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={zoomOut}
          >
            <ZoomOut className="h-6 w-6" />
            Zoom Out
          </button>
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={zoomIn}
          >
            <ZoomIn className="h-6 w-6" />
            Zoom In
          </button>
        </div>

        {/* Image Frame */}
        <div
          className="mt-4"
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "40vh", // Limit the height of the image section
            overflow: "hidden",
          }}
        >
          <ZoomableImage src={src} scale={scale} />
        </div>

        {/* Report Section */}
        <div
          className="mt-6 overflow-y-auto"
          style={{
            maxHeight: "30vh", // Limit the height of the report section
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Tooth Anomalies Report</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">
                    Tooth
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">
                    Anomalies
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(JSON.parse(report)).map(([tooth, anomalies]) => (
                  <tr key={tooth} className="border-b">
                    <td className="py-2 px-4">{tooth}</td>
                    <td className="py-2 px-4">
                      {(anomalies as string[]).length > 0
                        ? (anomalies as string[]).join(", ")
                        : "No anomalies detected"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDialog;