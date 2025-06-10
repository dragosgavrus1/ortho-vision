import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReportTeethOverlay from "@/components/ReportTeethOverlay";
import { Layout } from "@/components/Layout";
import { Upload, LayoutDashboardIcon, InfoIcon, HistoryIcon, User, User2Icon } from "lucide-react";
import ChatBubbleButton from "@/components/ChatBubbleButton";
import ChatWindow from "@/components/ChatWindow";

const HistoryDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { imageUrl, report } = location.state || {};

  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat window

  const sidebarLinks = [
    { href: "/patients", icon: LayoutDashboardIcon, label: "Overview" },
    { href: `/patients/${id}`, icon: InfoIcon, label: "Patient Information" },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
  ];

  const patientSidebarLinks = [
    { href: "/overview", icon: LayoutDashboardIcon, label: "Overview" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
  ];

  const role = localStorage.getItem("role"); // assumes role is stored as "patient" or "admin" etc.
  const links = role === "patient" ? patientSidebarLinks : sidebarLinks;

  if (!imageUrl || !report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">No data available for this history item.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activePath="/history" links={links}>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {/* Profile Button */}
        <button
          className="h-12 w-12 rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User2Icon className="h-6 w-6 m-auto" />
        </button>
      </div>

      <header className="flex items-center justify-between border-b p-4">
        <div className="flex w-full max-w-sm items-center gap-2">
        </div>
      </header>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">History Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Analysis Image</h2>
            <img
              src={imageUrl}
              alt="Radiograph"
              className="w-full h-auto border rounded shadow"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-center">Report</h2>
            <ReportTeethOverlay
              report={JSON.parse(report)}
              selectedTooth={selectedTooth}
              setSelectedTooth={setSelectedTooth}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={async () => {
              try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'analysis-image.jpg';
                link.click();

                URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error('Failed to download image:', error);
              }
            }}
          >
            Save Image
          </button>
        </div>
      </div>
      {/* Chat Bubble Button */}
      <ChatBubbleButton onClick={() => setIsChatOpen(!isChatOpen)} />

      {/* Chat Window */}
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} report={report} />}
    </Layout>
  );
};

export default HistoryDetailsPage;
