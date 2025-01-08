// pages/HistoryList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUpDown, Search, User2Icon, Upload,  LayoutDashboardIcon, InfoIcon, HistoryIcon } from 'lucide-react';
import isTokenValid from "@/hooks/tokenValid";
import { Layout } from "@/components/Layout";
import ImageDialog from "@/components/HistoryDialog/HistoryDialog";


interface HistoryItem {
  id: string;
  date: Date;
  imageUrl: string;
  patientName: string;
}

const hardcodedHistoryItems: HistoryItem[] = [
  {
    id: "1",
    date: new Date(),
    imageUrl: "/analysis-image.png", 
    patientName: "John Baston"
  }
];

export default function HistoryList() {
  const navigate = useNavigate();
  const [historyItems] = useState<HistoryItem[]>(hardcodedHistoryItems);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams();

  const sidebarLinks = [
    { href: "/patients", icon: LayoutDashboardIcon, label: "Overview" },
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

  const handleOpenDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedImage(null);
  };

return (
  <Layout activePath="/history" links={sidebarLinks}>
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
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search History"
            className="w-full pl-8 pr-4 py-2 border rounded-md"
          />
        </div>
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
          {historyItems.map((item: HistoryItem) => (
            <div
              key={item.id}
              className="grid grid-cols-4 gap-4 p-4 items-center"
              onClick={() => handleOpenDialog(item.imageUrl)}
            >
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt="Radiograph preview"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center">
                {item.date.toISOString().split("T")[0]}
              </div>
              <div className="flex items-center">{item.patientName}</div>
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
          onClick={() => console.log("Sort clicked")}
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </button>
      </div>
    </footer>

    {/* Display ImageDialog if needed */}
    {showDialog && selectedImage && (
      <ImageDialog src={selectedImage} onClose={handleCloseDialog} />
    )}
  </Layout>
);

}  
