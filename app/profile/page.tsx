"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axios"; // axios instance with token interceptor
import InlineEditField from "@/components/profile/InlineEditField";
// Removed app.css import to prevent global style conflicts
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import AddVehicleModal from "@/components/profile/AddVehicleModal"; // Create or import this component
import EditVehicleModal from "@/components/profile/EditVehicleModal"; // Import the modal
import { Me } from "@/lib/api/accounts";
import { useMe, useUpdateMe } from "@/lib/hooks/accounts.hooks";

interface Vehicle {
  vehicle_id: number;
  vehicle_registration_number: string;
  vehicle_type: string;
  vehicle_name: string;
}


export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useMe();
  const updateMe = useUpdateMe();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editVehicleModalOpen, setEditVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  async function fetchVehicles() {
    try {
      const res = await api.get<Vehicle[]>("/vehicle/");
      setVehicles(res.data);

    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Handle field updates
  const handleFieldUpdate = async (field: keyof Me, newValue: string) => {
    if (!user) return;
    try {
      await updateMe.mutateAsync({ [field]: newValue });
    } catch (error) {
      console.error('Failed to update field:', error);
    }
  };

  // delete vehicle
  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await api.delete(`/vehicle/${vehicleId}/`);
      setVehicles(vehicles.filter((v) => v.vehicle_id !== vehicleId));
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    }
  };

  // Add vehicle handler
  const handleAddVehicle = async (vehicle: {
    vehicle_name: string;
    vehicle_type: string;
    vehicle_registration_number: string;
    image: File | null;
  }) => {
    try {
      // 1. Create vehicle
      const res = await api.post("/vehicle/", {
        vehicle_name: vehicle.vehicle_name,
        vehicle_type: vehicle.vehicle_type,
        vehicle_registration_number: vehicle.vehicle_registration_number,
      });
      const vehicle_id = res.data.vehicle_id;

      // 2. Upload image if present
      if (vehicle.image) {
        const formData = new FormData();
        formData.append("images", vehicle.image);
        await api.post(`/vehicle/${vehicle_id}/images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3. Refresh vehicle list
      fetchVehicles();
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a121a] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1985df] mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#0a121a] text-white p-6">
        <div className="max-w-6xl mx-auto space-y-8 pt-16">
          {/* Top section with avatar and name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="w-32 h-32 border-2 border-[#1985df]">
                <AvatarFallback className="text-2xl bg-[#232834] text-[#1985df]">
                  {user.first_name?.[0] ?? ""}
                  {user.last_name?.[0] ?? ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-white">{fullName}</h1>
                <p className="text-gray-400 text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Personal info section with inline editing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#1985df] uppercase tracking-wide">
                Personal Information
              </h2>
              <Card className="bg-[#232834] border-[#1985df]/20 border-0">
                <CardContent className="p-6 space-y-4">
                  <InlineEditField
                    label="First name"
                    value={user.first_name}
                    onSave={(value) => handleFieldUpdate("first_name", value)}
                  />
                  <InlineEditField
                    label="Last name"
                    value={user.last_name}
                    onSave={(value) => handleFieldUpdate("last_name", value)}
                  />
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Email</span>
                    <span className="font-medium text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Phone</span>
                    <span className="font-medium text-white">{user.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1985df] uppercase tracking-wide">
                  Vehicles ({vehicles.length})
                </h2>
                <Button
                  className="bg-[#1985df] hover:bg-[#0d47a1] text-white rounded-full px-4 py-2 font-semibold"
                  onClick={() => setVehicleModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>

              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Card
                    key={vehicle.vehicle_id}
                    className="bg-[#232834] border-[#1985df]/20 border-0"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {vehicle.vehicle_name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {vehicle.vehicle_registration_number} • {vehicle.vehicle_type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setVehicleToEdit(vehicle);
                              setEditVehicleModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onAdd={handleAddVehicle}
      />
      <EditVehicleModal
        isOpen={editVehicleModalOpen}
        onClose={() => setEditVehicleModalOpen(false)}
        vehicle={vehicleToEdit}
        onUpdated={fetchVehicles} // <-- Only pass refresh callback
      />
      <Footer />
    </main>
  );
}
