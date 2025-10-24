import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Trash2, Upload, Loader2 } from "lucide-react"; // <-- Loader icon
import api from "@/lib/axios";

interface VehicleImage {
  id: number;
  vehicle: number;
  picture_link: string;
  created_at: string;
}

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    vehicle_id: number;
    vehicle_name: string;
    vehicle_type: string;
    vehicle_registration_number: string;
  } | null;
  onUpdated: () => void; // <-- Only refresh callback
}

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdated,
}: EditVehicleModalProps) {
  const [vehicle_name, setVehicleName] = useState("");
  const [vehicle_type, setVehicleType] = useState("");
  const [vehicle_registration_number, setVehicleRegNumber] = useState("");
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false); // <-- upload state

  useEffect(() => {
    if (vehicle && isOpen) {
      setVehicleName(vehicle.vehicle_name);
      setVehicleType(vehicle.vehicle_type);
      setVehicleRegNumber(vehicle.vehicle_registration_number);

      (async () => {
        try {
          const res = await api.get(`/vehicle/${vehicle.vehicle_id}/images/`);
          setImages(res.data.images || []);
        } catch (err) {
          console.error("Failed to fetch vehicle images:", err);
        }
      })();
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleDeleteImage = async (pictureId: number) => {
    try {
      await api.delete(`/vehicle/delete-image/${pictureId}/`);
      setImages(images.filter((img) => img.id !== pictureId));
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      await api.patch(`/vehicle/${vehicle.vehicle_id}/`, {
        vehicle_name,
        vehicle_type,
        vehicle_registration_number,
      });

      // Upload new images
      for (const file of newImages) {
        const formData = new FormData();
        formData.append("images", file);
        await api.post(`/vehicle/${vehicle.vehicle_id}/images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onClose();
      onUpdated();
    } catch (err) {
      console.error("Error editing vehicle:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Edit Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Car Name"
              value={vehicle_name}
              onChange={(e) => setVehicleName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Car Type"
              value={vehicle_type}
              onChange={(e) => setVehicleType(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Car Registration Number"
              value={vehicle_registration_number}
              onChange={(e) => setVehicleRegNumber(e.target.value)}
              required
            />

            {/* Current images */}
            <div>
              <p className="font-semibold mb-2">Current Images</p>
              <div className="flex flex-wrap gap-3">
                {images.length === 0 && (
                  <p className="text-gray-400 text-sm">No images uploaded.</p>
                )}
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <Image
                      src={img.picture_link}
                      alt="vehicle"
                      width={120}
                      height={80}
                      className="rounded-lg border border-[#1985df] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* File upload */}
            <div>
              <label className="font-semibold mb-2 block">Add New Images</label>
              <label
                htmlFor="vehicle-images-upload"
                className="inline-flex items-center px-4 py-2 bg-[#1985df] text-white rounded cursor-pointer font-semibold hover:bg-[#0d47a1] transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
                <input
                  id="vehicle-images-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {newImages.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  {newImages.length} new image(s) selected
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1985df] text-white flex items-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
