// pages/HistoryList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUpDown, User2Icon, Upload,  LayoutDashboardIcon, InfoIcon, HistoryIcon, User  } from 'lucide-react';
import isTokenValid from "@/hooks/tokenValid";
import { Layout } from "@/components/Layout";
import ImageDialog from "@/components/HistoryDialog/HistoryDialog";
import ChatBubbleButton from "@/components/ChatBubbleButton";
import ChatWindow from "@/components/ChatWindow";


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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [radiographToDelete, setRadiographToDelete] = useState<string | null>(null);

  const { id } = useParams();

  const sidebarLinks = [
    { href: "/patients", icon: LayoutDashboardIcon, label: "Patient List" },
    { href: `/patients/${id}`, icon: InfoIcon, label: "Patient Information" },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
  ];

  const patientSidebarLinks = [
    { href: "/overview", icon: LayoutDashboardIcon, label: "Overview" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
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
                report: item.report,
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

  const handleOpenDetailsPage = (imageUrl: string, report: string) => {
    navigate(`/history/${id}/details`, { state: { imageUrl, report } });
  };

  const handleDeleteClick = (id: string) => {
    setRadiographToDelete(id);
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (radiographToDelete) {
        await handleDeleteRadiograph(radiographToDelete);
        setRadiographToDelete(null);
    }
    setShowDeleteConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setRadiographToDelete(null);
    setShowDeleteConfirmDialog(false);
  };

  const handleDeleteRadiograph = async (id: string) => {
    const token = localStorage.getItem("jwtToken");
    try {
        const response = await fetch(`http://127.0.0.1:5000/radiographs/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            setHistoryItems((prev) => prev.filter((item) => item.id !== id));
        } else {
            console.error("Failed to delete radiograph:", await response.json());
        }
    } catch (error) {
        console.error("Error deleting radiograph:", error);
    }
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
        <div className={`grid ${role === "doctor" ? "grid-cols-5" : "grid-cols-4"} gap-4 border-b p-4 font-medium`}>
          <div>Preview</div>
          <div>Date</div>
          <div>Patient Name</div>
          <div>Actions</div>
          {role === "doctor" && <div>Delete</div>}
        </div>
        <div className="divide-y">
          {sortedHistoryItems.map((item: HistoryItem) => (
            <div
              key={item.id}
              className={`grid ${role === "doctor" ? "grid-cols-5" : "grid-cols-4"} gap-4 p-4 items-center`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetailsPage(item.url, item.report);
                  }}
                >
                  View Details
                </button>
              </div>
              {role === "doctor" && (
                <div className="flex items-center">
                  <button
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
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

    {/* Chat Bubble Button */}
    <ChatBubbleButton onClick={() => setIsChatOpen(!isChatOpen)} />

    {/* Chat Window */}
    {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} report={historyItems.map(item => item.report)} />}

    {/* Confirmation Dialog for Deletion */}
    {showDeleteConfirmDialog && (
        <div className="confirmation-dialog-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="confirmation-dialog-content bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <p className="mt-2 text-gray-600">
                    Are you sure you want to delete this radiograph?
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        onClick={handleCancelDelete}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )}
  </Layout>
);

}
