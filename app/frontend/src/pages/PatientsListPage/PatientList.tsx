"use client";

import { Layout } from "@/components/Layout";
import { patientSidebarLinks } from "@/constants/links";
import { useRepo } from "@/data/repo/Context";
import isTokenValid from "@/hooks/tokenValid";
import {
  ArrowUpDown,
  Edit2,
  Plus,
  Search,
  Trash2,
  User2Icon,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

export default function PatientList() {
  const navigate = useNavigate();
  const { patients } = useRepo();

  // Redirect to Sign In page if not logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin"); // Redirect to Sign In page if the user is not logged in
    }
  }, [navigate]);

  return (
    <Layout activePath="/patients" links={patientSidebarLinks}>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="h-12 w-12  rounded-full bg-gray-500 text-white shadow-lg hover:bg-blue-600"
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-white">
          <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium">
            <div>Full Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Date of Birth</div>
            <div>Gender</div>
          </div>
          <div className="divide-y">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-5 gap-4 p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div>
                  <div className="flex items-center">{patient.fullname}</div>
                  <div className="flex items-center">{patient.email}</div>
                  <div className="flex items-center">{patient.phone}</div>
                  <div className="flex items-center">
                    {patient.dob.toISOString()}
                  </div>
                  <div className="flex items-center">{patient.gender}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </footer>
    </Layout>
  );
}
