import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { useRepo } from "@/data/repo/Context";
import { useState } from "react";

interface AddPatientDialogProps {
  onClose: () => void;
}

export default function AddPatientDialog({ onClose }: AddPatientDialogProps) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const { addPatient, fetchPatients } = useRepo();

  const handleSave = () => {
    const pDate = new Date(dob);
    const patient = {
      fullname,
      email,
      phone,
      dob: pDate,
      gender,
      user_id: localStorage.getItem("user_id") || "",
    };
    addPatient(patient);
    fetchPatients();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <Input
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
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
