import React, { useState } from "react";
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

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: "male" | "female";
  weight_at_birth: number;
  height_at_birth: number;
  notes: string;
  created_at: string;
}

interface AddChildDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (childData: Omit<Child, 'id' | 'created_at'>) => void;
}

export default function AddChildDialog({ isOpen, onClose, onSave }: AddChildDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "male" as "male" | "female",
    weight_at_birth: 0,
    height_at_birth: 0,
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ 
      name: "", 
      date_of_birth: "", 
      gender: "male", 
      weight_at_birth: 0, 
      height_at_birth: 0, 
      notes: "" 
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <span className="text-2xl">👶</span>
            Add New Child
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
            <Label htmlFor="date_of_birth" className="text-amber-900 font-medium">Birth Date</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              required
              className="rounded-xl border-amber-200 focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-amber-900 font-medium">Gender (Optional)</Label>
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
            <Label htmlFor="notes" className="text-amber-900 font-medium">Medical Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
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
              Add Child
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 