"use client";

import { Button } from "@/components/Button/Button";
import { Layout } from "@/components/Layout";
import {
    Contact2,
    HistoryIcon,
    InfoIcon,
    RotateCw,
    Upload,
    User2Icon,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface AnalysisResult {
  date: string;
  overview: string;
  severity: "normal" | "minor" | "critical";
}

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const { id } = useParams();
  const patientDetailsLinks = [
    {
      href: `/patients/${id}`,
      icon: InfoIcon,
      label: "Patient Information",
    },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: "/history", icon: HistoryIcon, label: "History" },
  ];
  const [results] = useState<AnalysisResult[]>([
    {
      date: "2023-10-01",
      overview: "No issues detected",
      severity: "normal",
    },
    {
      date: "2023-10-15",
      overview: "Follow-up recommended",
      severity: "minor",
    },
    {
      date: "2023-10-30",
      overview: "Immediate attention required",
      severity: "critical",
    },
  ]);

  // Create a reference for the hidden file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setUploadedImage(reader.result as string);

        // Simulate sending the image to the server and getting the analysis result.
        await sendToServer();
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToServer = async () => {
    // Simulate sending the image to the server and getting a result
    console.log("Sending image to the server...");

    // Simulating server delay and response with a placeholder image
    setTimeout(() => {
      console.log("Server responded with analysis image...");
      setAnalysisImage("/placeholder.svg?height=400&width=400"); // Placeholder
    }, 2000); // Simulated delay (2 seconds)
  };

  const getSeverityColor = (severity: AnalysisResult["severity"]) => {
    switch (severity) {
      case "normal":
        return "text-green-600";
      case "minor":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Trigger file input click when the button is clicked
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Layout activePath={`/add-xray/${id}`} links={patientDetailsLinks}>
      <div className="fixed mr-4 top-4 right-4 z-50">
        <button
          className="h-12 w-12  rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User2Icon className="h-6 w-6 m-auto" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analysis Results</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Original X-Ray</h2>
              <button onClick={triggerFileInput}>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </button>
            </div>
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Original X-Ray"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image uploaded
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Analysis Result</h2>
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {analysisImage ? (
                <img
                  src={analysisImage}
                  alt="Analysis Result"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No analysis available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4 mr-2" />
            Rotate
          </Button>
          <Button variant="outline" size="sm">
            <Contact2 className="h-4 w-4 mr-2" />
            Contrast
          </Button>
        </div>

        <div className="rounded-lg border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Analysis Date</th>
                <th className="px-4 py-2 text-left">Results Overview</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{result.date}</td>
                  <td
                    className={`px-4 py-2 ${getSeverityColor(result.severity)}`}
                  >
                    {result.overview}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </Layout>
  );
}
