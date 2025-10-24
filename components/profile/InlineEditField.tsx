"use client";
import { useState } from "react";
import { Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  type?: string;
}

export default function InlineEditField({ 
  label, 
  value, 
  onSave, 
  type = "text" 
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-400 min-w-[100px]">{label}</span>
      
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-[200px] bg-[#232834] border-[#1985df] text-white"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 p-2"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{value}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-[#1985df] hover:bg-[#1985df]/10 p-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
