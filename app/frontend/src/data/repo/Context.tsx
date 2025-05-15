/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from "react";
import Patient from "../models/Patient";
type RepoContextType = {
  patients: Patient[];
  setpatients?: React.Dispatch<React.SetStateAction<Patient[]>>;
  addPatient: (Patient: Omit<Patient, "id">) => Promise<void>;
  updatePatient: (Patient: Patient) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  fetchPatients: () => Promise<void>;
  getPatient: (id: number | undefined) => Promise<Patient | undefined>;
  getUserInfo: (userId: number) => Promise<any>;
  updateUser: (user: { id: string; fullname: string }) => Promise<void>;
};

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "";

      const params = new URLSearchParams({ user_id: userId });
      const base_URL = "http://localhost:5000/patients";
      const response = await fetch(`${base_URL}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (Array.isArray(data.patients)) {
        const transformedPatients = data.patients.map((patient: any) => ({
          id: patient.id,
          user_id: patient.user_id,
          fullname: patient.fullname,
          email: patient.email,
          phone: patient.phone,
          dob: new Date(patient.date_of_birth), // Convert to Date object
          gender: patient.gender,
        }));
        setPatients(transformedPatients);
      }
    } catch (error: any) {
      console.error("[ERROR] Fetch Patients:", error.message);
    }
  };

  // Add an Patient
  const addPatient = async (patient: Omit<Patient, "id">) => {
    try {
      const response = await fetch("http://localhost:5000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!response.ok) {
        throw new Error("Failed to add Patient.");
      }

      console.log("[DEBUG] Patient added:", patient);
    } catch (error: any) {
      console.error("[ERROR] Add Patient:", error.message);
    }
  };

  // Update an Patient
  const updatePatient = async (patient: Patient) => {
    try {
      console.log("[DEBUG] Patient to update:", patient);
      const response = await fetch(
        `http://localhost:5000/patients/${patient.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update Patient.");
      }
      console.log("[DEBUG] Patient updated:", patient);
    } catch (error: any) {
      console.error("[ERROR] Update Patient:", error.message);
    }
  };

  const deletePatient = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/patients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete Patient.");
      }
      // Update the local state immediately after a successful deletion
      setPatients((prev) => prev.filter((patient) => patient.id !== id));
      console.log("[DEBUG] Patient deleted locally:", id);
    } catch (error: any) {
      console.error("[ERROR] Delete Patient:", error.message);
    }
  };

  const getPatient = async (
    id: number | undefined
  ): Promise<Patient | undefined> => {
    try {
      const response = await fetch(`http://localhost:5000/patients/${id}`, {
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
          dob: new Date(data.patient.date_of_birth),
          gender: data.patient.gender,
        };
        return patient;
      } else {
        console.log("[ERROR] Patient not found:", id);
      }
    } catch (error: any) {
      console.error("[ERROR] Get Patient:", error.message);
    }
  };
  const getUserInfo = async (userId: number) => {
    const response = await fetch("http://localhost:5000/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
  
    const data = await response.json();
    if (data.user) {
      return data.user;
    } else {
      console.error("Error fetching user:", data.error);
      return null;
    }
  };

  // Add updateUser API for doctor name change
  const updateUser = async (user: { id: string; fullname: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname: user.fullname }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user.");
      }
      console.log("[DEBUG] User updated:", user);
    } catch (error: any) {
      console.error("[ERROR] Update User:", error.message);
    }
  };

  return (
    <RepoContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        fetchPatients,
        getPatient,
        getUserInfo,
        updateUser,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = (): RepoContextType => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
};
