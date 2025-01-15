import { Layout } from "@/components/Layout";
import AddPatientDialog from "@/components/PatientDialog/AddPatientDialog";
import EditPatientDialog from "@/components/PatientDialog/EditPatientDialog";
import { patientSidebarLinks } from "@/constants/links";
import { useRepo } from "@/data/repo/Context";
import isTokenValid from "@/hooks/tokenValid";
import { Edit2, Plus, Search, Trash2, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

export default function PatientList() {
  const navigate = useNavigate();
  const { patients, fetchPatients, deletePatient } = useRepo();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [patientId, setPatientId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Redirect to Sign In page if not logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleAddPatient = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (event: React.MouseEvent, id: number) => {
    event.stopPropagation(); // Prevent row click handler
    setPatientId(id);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setPatientId(undefined);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedPatients((prev) =>
      prev.includes(id)
        ? prev.filter((patientId) => patientId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedPatients) {
      await deletePatient(id);
    }
    setSelectedPatients([]);
  };

  return (
    <Layout activePath="/patients" links={patientSidebarLinks}>
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
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search Patients" className="pl-8" />
          </div>
          <Button className="gap-2" onClick={handleAddPatient}>
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-white">
          <div className="grid grid-cols-7 gap-4 border-b p-4 font-medium">
            <div>Select</div>
            <div>Full Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Date of Birth</div>
            <div>Gender</div>
            <div>Edit</div>
          </div>
          <div className="divide-y">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-7 gap-4 p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handleCheckboxChange(patient.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center">{patient.fullname}</div>
                <div className="flex items-center">{patient.email}</div>
                <div className="flex items-center">{patient.phone}</div>
                <div className="flex items-center">
                  {patient.dob.toISOString().split("T")[0]}
                </div>
                <div className="flex items-center">{patient.gender}</div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => handleEditClick(e, patient.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={selectedPatients.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </footer>

      {isAddDialogOpen && <AddPatientDialog onClose={handleDialogClose} />}
      {isEditDialogOpen && patientId !== undefined && (
        <EditPatientDialog onClose={handleDialogClose} id={patientId} />
      )}
    </Layout>
  );
}
