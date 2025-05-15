// pages/HistoryList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUpDown, User2Icon, Upload,  LayoutDashboardIcon, InfoIcon, HistoryIcon, User, Settings } from 'lucide-react';
import isTokenValid from "@/hooks/tokenValid";
import { Layout } from "@/components/Layout";
import ImageDialog from "@/components/HistoryDialog/HistoryDialog";


interface HistoryItem {
  id: string;
  date: string;
  url: string;
  patientName: string;
  report: string;
}

export default function HistoryList() {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");

  const { id } = useParams();

  const sidebarLinks = [
    { href: "/patients", icon: LayoutDashboardIcon, label: "Overview" },
    { href: `/patients/${id}`, icon: InfoIcon, label: "Patient Information" },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const patientSidebarLinks = [
    { href: "/overview", icon: LayoutDashboardIcon, label: "Overview" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  // Determine user role (example: from localStorage)
  const role = localStorage.getItem("role"); // assumes role is stored as "patient" or "admin" etc.
  const links = role === "patient" ? patientSidebarLinks : sidebarLinks;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }


    const fetchPatientName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPatientName(data.patient.fullname); // Set the patient name
        } else {
          console.error("Failed to fetch patient name:", data.error);
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
      }
    };

    const fetchHistoryItems = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/radiographs?patient_id=${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          });
          const data = await response.json();
          if (response.ok) {
            setHistoryItems(
              data.patients.map((item: any) => ({
                id: item.id,
                date: item.date,
                url: item.url,
                report: item.report, // Replace with actual patient name if available
              }))
            );
          } else {
            console.error("Failed to fetch history items:", data.error);
          }
        } catch (error) {
          console.error("Error fetching history items:", error);
        }
      };

      fetchPatientName();
      fetchHistoryItems();
    }, [id, navigate]);

  // Sort history items by date
  const sortedHistoryItems = [...historyItems].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleOpenDialog = (imageUrl: string, report: string) => {
    setSelectedImage(imageUrl);
    setSelectedReport(report);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedImage(null);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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

    <main className="flex-1 overflow-auto p-4">
      <div className="rounded-lg border bg-white">
        <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium">
          <div>Preview</div>
          <div>Date</div>
          <div>Patient Name</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {sortedHistoryItems.map((item: HistoryItem) => (
            <div
              key={item.id}
              className="grid grid-cols-4 gap-4 p-4 items-center"
              onClick={() => handleOpenDialog(item.url, item.report)}
            >
              <div className="flex items-center">
                <img
                  src={item.url}
                  alt="Radiograph preview"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center">
                {item.date.split("T")[0]}
              </div>
              <div className="flex items-center">{patientName}</div>
              <div className="flex items-center">
                <button
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => console.log(`View details for ${item.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>

    <footer className="border-t p-4">
      <div className="flex gap-2">
        <button
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
          onClick={handleSortToggle}
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
        </button>
      </div>
    </footer>

    {/* Display ImageDialog if needed */}
    {showDialog && selectedImage && selectedReport && (
      <ImageDialog src={selectedImage} report={selectedReport} onClose={handleCloseDialog} />
    )}
  </Layout>
);

}
