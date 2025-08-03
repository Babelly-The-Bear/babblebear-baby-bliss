import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditChildDialog({ isOpen, child, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "",
    medical_notes: ""
  });

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name || "",
        birth_date: child.birth_date || "",
        gender: child.gender || "",
        medical_notes: child.medical_notes || ""
      });
    }
  }, [child]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!child) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <span className="text-2xl">✏️</span>
            Edit Child Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-amber-900 font-medium">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Child's name"
              required
              className="rounded-xl border-amber-200 focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date" className="text-amber-900 font-medium">Birth Date</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange("birth_date", e.target.value)}
              required
              className="rounded-xl border-amber-200 focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-amber-900 font-medium">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger className="rounded-xl border-amber-200 focus:border-amber-400">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boy">Boy</SelectItem>
                <SelectItem value="girl">Girl</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_notes" className="text-amber-900 font-medium">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              value={formData.medical_notes}
              onChange={(e) => handleChange("medical_notes", e.target.value)}
              placeholder="Any medical history or concerns..."
              className="rounded-xl border-amber-200 focus:border-amber-400 h-20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 