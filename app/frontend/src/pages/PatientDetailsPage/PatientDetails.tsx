"use client";

import { Button } from "@/components/Button/Button";
import { Layout } from "@/components/Layout";
import isTokenValid from "@/hooks/tokenValid";
import {
  HistoryIcon,
  InfoIcon,
  LayoutDashboardIcon,
  Upload,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
interface PatientDetails {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  medicalHistory: {
    visitDate: string;
    doctorName: string;
    specialty: string;
    notes: string;
  }[];
  surgeryHistory: {
    date: string;
    procedure: string;
    surgeon: string;
    hospital: string;
  }[];
  doctors: {
    name: string;
    specialization: string;
    contactNumber: string;
    yearsOfExperience: number;
  }[];
}

export default function PatientDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isChecked, setIsChecked] = useState(true); // Assuming it's checked by default

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked); // Update the state on change
  };
  const patientDetailsLinks = [
    {
      href: "/patients",
      icon: LayoutDashboardIcon,
      label: "Overview",
    },
    {
      href: `/patients/${id}`,
      icon: InfoIcon,
      label: "Patient Information",
    },
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: "/history", icon: HistoryIcon, label: "History" },
  ];

  const [patient] = useState<PatientDetails>({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    age: 45,
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    city: "New York",
    medicalHistory: [
      {
        visitDate: "2023-01-15",
        doctorName: "Dr. Emily Carter",
        specialty: "Cardiology",
        notes: "Routine check-up",
      },
    ],
    surgeryHistory: [
      {
        date: "2023-05-15",
        procedure: "Appendectomy",
        surgeon: "Dr. Smith",
        hospital: "City Hospital",
      },
    ],
    doctors: [
      {
        name: "Dr. Sarah Johnson",
        specialization: "Pediatrics",
        contactNumber: "123-456-7890",
        yearsOfExperience: 10,
      },
    ],
  });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <Layout activePath={`/patients/${id}`} links={patientDetailsLinks}>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="h-12 w-12  rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User2Icon className="h-6 w-6 m-auto" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {patient.firstName} {patient.lastName}
          </h1>
          <span className="px-2 py-1 text-sm bg-gray-100 rounded-md">
            Age: {patient.age}
          </span>
          <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
            New
          </span>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Patient Personal Information
          </h2>
          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">City</th>
                  <th className="px-4 py-2 text-left">Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">{patient.email}</td>
                  <td className="px-4 py-2">{patient.phoneNumber}</td>
                  <td className="px-4 py-2">{patient.address}</td>
                  <td className="px-4 py-2">{patient.city}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className="rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Patient Medical History
          </h2>
          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Visit Date</th>
                  <th className="px-4 py-2 text-left">Doctor's Name</th>
                  <th className="px-4 py-2 text-left">Specialty</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patient.medicalHistory.map((visit, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{visit.visitDate}</td>
                    <td className="px-4 py-2">{visit.doctorName}</td>
                    <td className="px-4 py-2">{visit.specialty}</td>
                    <td className="px-4 py-2">{visit.notes}</td>
                    <td className="px-4 py-2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Surgery History</h2>
          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Surgery Date</th>
                  <th className="px-4 py-2 text-left">Procedure</th>
                  <th className="px-4 py-2 text-left">Surgeon</th>
                  <th className="px-4 py-2 text-left">Hospital</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patient.surgeryHistory.map((surgery, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{surgery.date}</td>
                    <td className="px-4 py-2">{surgery.procedure}</td>
                    <td className="px-4 py-2">{surgery.surgeon}</td>
                    <td className="px-4 py-2">{surgery.hospital}</td>
                    <td className="px-4 py-2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Doctors Information</h2>
          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Doctor Name</th>
                  <th className="px-4 py-2 text-left">Specialization</th>
                  <th className="px-4 py-2 text-left">Contact Number</th>
                  <th className="px-4 py-2 text-left">Years of Experience</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patient.doctors.map((doctor, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{doctor.name}</td>
                    <td className="px-4 py-2">{doctor.specialization}</td>
                    <td className="px-4 py-2">{doctor.contactNumber}</td>
                    <td className="px-4 py-2">{doctor.yearsOfExperience}</td>
                    <td className="px-4 py-2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
