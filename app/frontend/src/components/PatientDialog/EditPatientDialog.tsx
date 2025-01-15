import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { useRepo } from "@/data/repo/Context";
import { useEffect, useState } from "react";

interface EditPatientDialogProps {
  onClose: () => void;
  id: number;
}

export default function EditPatientDialog({
  onClose,
  id,
}: EditPatientDialogProps) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { fetchPatients, getPatient, updatePatient } = useRepo();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setIsLoading(true);
      try {
        const patient = await getPatient(id);
        if (patient) {
          setFullname(patient.fullname || "");
          setEmail(patient.email || "");
          setPhone(patient.phone || "");
          setDob(patient.dob ? patient.dob.toISOString().split("T")[0] : "");
          setGender(patient.gender || "");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id, getPatient]);

  const handleSave = () => {
    const pDate = new Date(dob);
    const patient = {
      id,
      fullname,
      email,
      phone,
      dob: pDate,
      gender,
      user_id: localStorage.getItem("user_id") || "",
    };
    updatePatient(patient);
    fetchPatients();
    onClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
