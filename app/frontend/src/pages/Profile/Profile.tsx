"use client";

import { Button } from "@/components/Button/Button";
import isTokenValid from "@/hooks/tokenValid";
import { ArrowLeft, Edit2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Education {
  year: string;
  degree: string;
  university: string;
  certificate?: string;
}

interface UserProfile {
  name: string;
  title: string;
  section: string;
  personalInfo: {
    employeeId: string;
    idNumber: string;
    phone: string;
    email: string;
    birthday: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
  };
  addressInfo: {
    address: string;
    country: string;
    city: string;
    hometown: string;
    postalCode: string;
  };
  education: Education[];
}

export default function Profile() {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const profile: UserProfile = {
    name: "Elizabeth Lopez",
    title: "Title",
    section: "Section",
    personalInfo: {
      employeeId: "A0001",
      idNumber: "0001234567",
      phone: "(719) 860-5684",
      email: "elizabethlopez95@hotmail.com",
      birthday: "May 15, 1995",
      gender: "Female",
      maritalStatus: "Single",
      nationality: "USA",
    },
    addressInfo: {
      address: "925 Wall Street",
      country: "USA",
      city: "Houston",
      hometown: "-",
      postalCode: "75204",
    },
    education: [
      {
        year: "2019",
        degree: "Bachelor of Arts in Psychology",
        university: "University of California, Berkeley",
        certificate: "Certificate.pdf",
      },
      {
        year: "2021",
        degree: "Master of Science",
        university: "Stanford University",
        certificate: "Certificate.pdf",
      },
    ],
  };
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isTokenValid(token)) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirmDialog(true)}
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{profile.title}</span>
              <span>{profile.section}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-lg border">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Personal Information</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="grid gap-6 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Employee ID</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.employeeId}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">ID Number</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.idNumber}
                  </p>
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Phone</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Email</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.email}
                  </p>
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Birthday</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.birthday}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Gender</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.gender}
                  </p>
                </div>

                {/* Row 4 */}
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Marital Status</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.maritalStatus}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-40 text-sm text-gray-500">Nationality</p>
                  <p className="flex-1 break-words">
                    {profile.personalInfo.nationality}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-dialog-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="confirmation-dialog-content bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold">Confirm Logout</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleLogout();
                  setShowConfirmDialog(false);
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
