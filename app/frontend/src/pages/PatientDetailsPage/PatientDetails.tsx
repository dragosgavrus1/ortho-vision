"use client";

import { Layout } from "@/components/Layout";
import Patient from "@/data/models/Patient";
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
export default function PatientDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const patientAge = patient?.dob
    ? Math.floor(
        (Date.now() - patient.dob.getTime()) / (1000 * 60 * 60 * 24 * 365)
      )
    : 0;

  const patientDetailsLinks = [
    { href: "/patients",icon: LayoutDashboardIcon,label: "Patient List",},
    { href: `/patients/${id}`,icon: InfoIcon,label: "Patient Information",},
    { href: `/add-xray/${id}`, icon: Upload, label: "Add X-Ray" },
    { href: `/history/${id}`, icon: HistoryIcon, label: "History" },
  ];
  const fetchPatient = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/patients/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.patient) {
        const patient = {
          id: data.patient.id,
          user_id: data.patient.user_id,
          fullname: data.patient.fullname,
          email: data.patient.email,
          phone: data.patient.phone,
          dob: new Date(data.patient.date_of_birth), // Convert to Date object
          gender: data.patient.gender,
        };
        setPatient(patient);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("[ERROR] Fetch Patient Error:", error.message);
      } else {
        console.error("[ERROR] Fetch Patient Error:", error);
      }
    }
  };

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }
    if (id) {
      fetchPatient(parseInt(id));
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
          <h1 className="text-2xl font-bold">{patient?.fullname}</h1>
          <span className="px-2 py-1 text-sm bg-gray-100 rounded-md">
            Age: {patientAge}
          </span>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Patient Personal Information
          </h2>
          <div className="rounded-lg border bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Full Name:</span>
              <span>{patient?.fullname}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Email:</span>
              <span>{patient?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Phone Number:</span>
              <span>{patient?.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Date of Birth:</span>
              <span>{patient?.dob.toISOString().split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Gender:</span>
              <span>{patient?.gender}</span>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
