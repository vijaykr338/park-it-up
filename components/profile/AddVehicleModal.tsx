import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: {
    vehicle_name: string;
    vehicle_type: string;
    vehicle_registration_number: string;
    image: File | null;
  }) => void;
}

export default function AddVehicleModal({ isOpen, onClose, onAdd }: AddVehicleModalProps) {
  const [vehicle_name, setVehicleName] = useState("");
  const [vehicle_type, setVehicleType] = useState("");
  const [vehicle_registration_number, setVehicleRegNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ vehicle_name, vehicle_type, vehicle_registration_number, image });
    onClose();
    setVehicleName("");
    setVehicleType("");
    setVehicleRegNumber("");
    setImage(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Car Name"
              value={vehicle_name}
              onChange={e => setVehicleName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Car Type"
              value={vehicle_type}
              onChange={e => setVehicleType(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Car Registration Number"
              value={vehicle_registration_number}
              onChange={e => setVehicleRegNumber(e.target.value)}
              required
            />
            <Input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files?.[0] || null)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1985df] text-white">
                Add Vehicle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}