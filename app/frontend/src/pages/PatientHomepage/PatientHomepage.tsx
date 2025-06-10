import { Layout } from "@/components/Layout";
import { LayoutDashboardIcon, User, HistoryIcon } from "lucide-react";
import { useRepo } from "@/data/repo/Context";
import isTokenValid from "@/hooks/tokenValid";
import { User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Patient from "@/data/models/Patient";

export default function PatientOverview() {
  const navigate = useNavigate();
  const { getPatient } = useRepo(); // use your existing getPatient function
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
      return;
    }

    const patient_id = localStorage.getItem("patient_id");
    if (patient_id) {
      getPatient(parseInt(patient_id)).then((fetchedPatient) => {
        setPatient(fetchedPatient);
        console.log("Fetched patient:", fetchedPatient);
      });
    }
  }, [getPatient, navigate]);

  if (!patient) {
    return <div className="p-4">Loading...</div>;
  }

  const patientSidebarLinks = [
    { href: "/overview", icon: LayoutDashboardIcon, label: "Overview" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: `/history/${patient.id}`, icon: HistoryIcon, label: "History" },
  ];

  return (
    <Layout activePath="/overview" links={patientSidebarLinks}>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="h-12 w-12 rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User2Icon className="h-6 w-6 m-auto" />
        </button>
      </div>

      <header className="flex items-center justify-between border-b p-4">
        <div className="flex w-full max-w-sm items-center gap-2">
          {/* Placeholder for spacing, same height as the search bar */}
          <div style={{ height: "40px" }} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-white p-6 shadow-md">
          <h1 className="text-2xl font-bold mb-6">Welcome, {patient.fullname}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Email:</span>
              <span>{patient.email}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Phone:</span>
              <span>{patient.phone}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Date of Birth:</span>
              <span>{patient.dob.toISOString().split("T")[0]}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Gender:</span>
              <span>{patient.gender}</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate(`/history/${patient.id}`)}
            >
              View Anomaly History
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
