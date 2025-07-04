import { Button } from "@/components/Button/Button";
import { Layout } from "@/components/Layout";
import isTokenValid from "@/hooks/tokenValid";
import {
  HistoryIcon,
  InfoIcon,
  LayoutDashboardIcon,
  Upload,
  User2Icon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReportTeethOverlay from "@/components/ReportTeethOverlay";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    "https://media.istockphoto.com/id/171294275/photo/panoramic-dental-x-ray.jpg?s=612x612&w=0&k=20&c=cKxtL1W0L2LKVoZnNfiUj8umm6kQDonINuhn8NdCda4="
  );
  const [analysisImage, setAnalysisImage] = useState<string | null>(
    "https://media.istockphoto.com/id/171294275/photo/panoramic-dental-x-ray.jpg?s=612x612&w=0&k=20&c=cKxtL1W0L2LKVoZnNfiUj8umm6kQDonINuhn8NdCda4="
  );
  const [analysisBlob, setAnalysisBlob] = useState<Blob | null>(null);
  const [zoomScales, setZoomScales] = useState({ original: 1, analysis: 1 });
  const [selectedImage, setSelectedImage] = useState<"original" | "analysis">(
    "original"
  );
  const [position, setPosition] = useState({ x: 0, y: 0 }); // To track image position for movement
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [report, setReport] = useState({});
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const patientDetailsLinks = [
    { href: "/patients", icon: LayoutDashboardIcon, label: "Patient List" },
    { href: `/patients/${id}`, icon: InfoIcon, label: "Patient Information" },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleSaveXRay = async () => {
    try {
      if (!analysisBlob) {
        alert("No analysis image available to save.");
        return;
      }

      const formData = new FormData();
      formData.append("patient_id", id ?? "");
      formData.append("date", new Date().toISOString());
      formData.append("report", JSON.stringify(report));
      formData.append("image", analysisBlob, "analysis-image.png"); // Attach the binary image
      console.log("Form Data:", formData);
      
      const response = await fetch("https://ortho-vision-backend.fly.dev//radiographs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("X-Ray saved successfully");
      }
      else {
        const errorData = await response.json();
        console.error("Failed to save X-Ray:", errorData.error);
        alert("Failed to save X-Ray.");
      }
    } catch (error) {
      console.error("Error saving X-Ray:", error);
      alert("An error occurred while saving the X-Ray.");
    }
  };
  const handleSaveXRayToImage = () => {
    if (!analysisImage) {
      alert("No analysis image available to download!");
      return;
    }

    const link = document.createElement("a");
    link.href = analysisImage;
    link.download = "analysis-image.png";
    link.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setUploadedImage(reader.result as string);
        await sendToServer(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToServer = async (file: File) => {
    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("file", file);
    console.log("File:", file);
    try {
      const response = await fetch("https://ortho-vision-backend.fly.dev//upload", {
        method: "POST",

        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageURL = URL.createObjectURL(imageBlob);
        setAnalysisImage(imageURL);
        setAnalysisBlob(imageBlob);
        const reportResponse = await fetch("https://ortho-vision-backend.fly.dev//report", {
          method: "GET",
        });

        if (reportResponse.ok) {
          const reportData = await reportResponse.json();
          console.log("Report Data:", reportData);
          setReport(reportData);
        }
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleZoomIn = () => {
    setZoomScales((prev) => ({
      ...prev,
      [selectedImage]: Math.min(prev[selectedImage] + 0.1, 3), // Max zoom is 3
    }));
  };

  const handleZoomOut = () => {
    setZoomScales((prev) => ({
      ...prev,
      [selectedImage]: Math.max(prev[selectedImage] - 0.1, 0.5), // Min zoom is 0.5
    }));
  };

  const handleImageSelection = (image: "original" | "analysis") => {
    setSelectedImage(image);
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Layout activePath={`/add-xray/${id}`} links={patientDetailsLinks}>
      <div className="fixed mr-4 top-4 right-4 z-50">
        <button
          className="h-12 w-12 rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User2Icon className="h-6 w-6 m-auto" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analysis Results</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Original X-Ray</h2>
            <div
              className={`border-2 ${
                selectedImage === "original"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => handleImageSelection("original")}
            >
              <div
                className="image-container"
                style={{ overflow: "hidden" }}
                onMouseDown={handleMouseDown}
              >
                <img
                  src={uploadedImage ?? "/default-placeholder-original.jpg"}
                  alt="Original X-Ray"
                  style={{
                    transform: `scale(${zoomScales.original}) translate(${position.x}px, ${position.y}px)`, // Apply zoom scale and movement
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Analysis Result</h2>
            <div
              className={`border-2 ${
                selectedImage === "analysis"
                  ? "border-blue-500"
                  : "border-transparent"
              } relative`}
              onClick={() => handleImageSelection("analysis")}
            >
              <div
                className="image-container relative"
                style={{ overflow: "hidden" }}
                onMouseDown={handleMouseDown}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                  </div>
                )}
                <img
                  src={analysisImage ?? "/default-placeholder-analysis.jpg"}
                  alt="Analysis Result"
                  style={{
                    transform: `scale(${zoomScales.analysis}) translate(${position.x}px, ${position.y}px)`, // Apply zoom scale and movement
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
        </div>
        {/* Upload Button */}
        <div className="text-center">
          <Button onClick={triggerFileInput} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
        {/* Results Table */}
        <div className="text-center">
          <Button onClick={handleSaveXRay} variant="outline" size="sm">
            Save X-Ray
          </Button>
          <Button onClick={handleSaveXRayToImage} variant="outline" size="sm">
            Save X-Ray to Image
          </Button>
        </div>
        {/* Tooth Anomalies Visualization */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Tooth Anomalies Visualization</h2>
          <ReportTeethOverlay
            report={report}
            selectedTooth={selectedTooth}
            setSelectedTooth={setSelectedTooth}
          />
        </div>
      </div>

      {/* Hidden File Input */}
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
