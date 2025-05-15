"use client";

import { Button } from "@/components/Button/Button";
import isTokenValid from "@/hooks/tokenValid";
import { ArrowLeft, Edit2, LogOut, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRepo } from "@/data/repo/Context";
import { Dialog } from "@headlessui/react";

interface UserProfile {
  name: string;
  role: string;
  personalInfo: {
    idNumber: string;
    phone: string;
    email: string;
    birthday: string;
    gender: string;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { getUserInfo, getPatient, updatePatient, updateUser } = useRepo();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({
    name: "",
    phone: "",
    birthday: "",
    gender: "",
  });
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editUserName, setEditUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("user_id");
    const patientId = localStorage.getItem("patient_id");
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (!isTokenValid(token) || !userId) {
      navigate("/signin");
      return;
    }

    if (storedRole === "patient" && patientId) {
      getPatient(parseInt(patientId)).then((patient) => {
        if (patient) {
          setProfile({
            name: patient.fullname,
            role: "patient",
            personalInfo: {
              idNumber: userId,
              phone: patient.phone,
              email: patient.email,
              birthday: new Date(patient.dob).toLocaleDateString(),
              gender: patient.gender,
            },
          });
          setEditFields({
            name: patient.fullname,
            phone: patient.phone,
            birthday: new Date(patient.dob).toISOString().split("T")[0],
            gender: patient.gender,
          });
        }
      });
    } else if (storedRole === "doctor") {
      getUserInfo(parseInt(userId)).then((user) => {
        if (user) {
          setProfile({
            name: user.fullname,
            role: user.role,
            personalInfo: {
              idNumber: user.id,
              phone: "", // Not shown for doctor
              email: user.email,
              birthday: "", // Not shown for doctor
              gender: "", // Not shown for doctor
            },
          });
        }
      });
    }
  }, [navigate, getPatient, getUserInfo]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // Capitalize role for display
  const displayRole =
    role === "patient"
      ? "Patient"
      : role === "doctor"
      ? "Doctor"
      : role
      ? role.charAt(0).toUpperCase() + role.slice(1)
      : "";

  if (!profile) return <div className="p-4">Loading...</div>;

  const handleEditOpen = () => {
    if (role === "patient" && profile) {
      setEditFields({
        name: profile.name,
        phone: profile.personalInfo.phone,
        birthday: new Date(profile.personalInfo.birthday).toISOString().split("T")[0],
        gender: profile.personalInfo.gender,
      });
      setEditDialogOpen(true);
    } else if (role === "doctor" && profile) {
      setEditUserName(profile.name);
      setEditUserDialogOpen(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const patientId = localStorage.getItem("patient_id");
    if (patientId && profile) {
      // Build the Patient object for updatePatient
      await updatePatient({
        id: parseInt(patientId),
        user_id: profile.personalInfo.idNumber,
        fullname: editFields.name,
        email: profile.personalInfo.email,
        phone: editFields.phone,
        dob: new Date(editFields.birthday),
        gender: editFields.gender,
      });
      // Refresh profile data
      getPatient(parseInt(patientId)).then((patient) => {
        if (patient) {
          setProfile({
            name: patient.fullname,
            role: "patient",
            personalInfo: {
              idNumber: profile.personalInfo.idNumber,
              phone: patient.phone,
              email: patient.email,
              birthday: new Date(patient.dob).toLocaleDateString(),
              gender: patient.gender,
            },
          });
        }
      });
    }
    setEditDialogOpen(false);
  };

  const handleEditUserSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      await updateUser({
        id: userId,
        fullname: editUserName,
      });
      // Refresh profile data
      getUserInfo(parseInt(userId)).then((user) => {
        if (user) {
          setProfile({
            name: user.fullname,
            role: user.role,
            personalInfo: {
              idNumber: user.id,
              phone: "",
              email: user.email,
              birthday: "",
              gender: "",
            },
          });
        }
      });
    }
    setEditUserDialogOpen(false);
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
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <User2Icon className="w-12 h-12 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{displayRole}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-lg border">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Personal Information</h2>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleEditOpen}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="grid gap-6 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                {/* ID Number, Name, and Email always shown */}
                <div className="flex items-center gap-2">
                  <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                    ID Number
                  </p>
                  <p className="flex-1 break-words text-left self-start">
                    {profile.personalInfo.idNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                    Name
                  </p>
                  <p className="flex-1 break-words text-left self-start">
                    {profile.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                    Email
                  </p>
                  <p className="flex-1 break-words text-left self-start">
                    {profile.personalInfo.email}
                  </p>
                </div>
                {/* Birthday, Phone, Gender only for patient */}
                {role === "patient" && (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                        Birthday
                      </p>
                      <p className="flex-1 break-words text-left self-start">
                        {profile.personalInfo.birthday}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                        Phone
                      </p>
                      <p className="flex-1 break-words text-left self-start">
                        {profile.personalInfo.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="min-w-[110px] w-auto text-sm text-gray-500 text-left self-start">
                        Gender
                      </p>
                      <p className="flex-1 break-words text-left self-start">
                        {profile.personalInfo.gender}
                      </p>
                    </div>
                  </>
                )}
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
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6 shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-semibold mb-2">Edit Personal Information</Dialog.Title>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFields.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile?.personalInfo.email || ""}
                  disabled
                  className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={editFields.birthday}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFields.phone}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={editFields.gender}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Doctor Edit Dialog */}
      <Dialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6 shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-semibold mb-2">Edit Name</Dialog.Title>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditUserSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editUserName}
                  onChange={e => setEditUserName(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setEditUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
