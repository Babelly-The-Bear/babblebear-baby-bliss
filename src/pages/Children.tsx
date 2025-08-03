import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChildCard from "../components/children/ChildCard";
import AddChildDialog from "../components/children/AddChildDialog";
import EditChildDialog from "../components/children/EditChildDialog";

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

export default function Children() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQ4MjQyNzN9.kdXC0OHzBUmfuITv3CS2nwoAhxMNe64CcqMMflu1rrE';

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }

      const childrenData: Child[] = await response.json();
      setChildren(childrenData);
    } catch (error) {
      console.error("Failed to load children:", error);
    }
    setIsLoading(false);
  };

  const handleAddChild = async (childData: Omit<Child, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(childData)
      });

      if (!response.ok) {
        throw new Error('Failed to add child');
      }

      setShowAddDialog(false);
      loadChildren();
    } catch (error) {
      console.error("Failed to add child:", error);
    }
  };

  const handleEditChild = async (childData: Omit<Child, 'id' | 'created_at'>) => {
    if (!editingChild) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/children/${editingChild.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(childData)
      });

      if (!response.ok) {
        throw new Error('Failed to update child');
      }

      setEditingChild(null);
      loadChildren();
    } catch (error) {
      console.error("Failed to update child:", error);
    }
  };

  const calculateAge = (birthDate: string): string => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      // Check if the date is valid
      if (isNaN(birth.getTime())) {
        return "Age unknown";
      }
      
      const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
      
      if (months < 0) {
        return "Age unknown";
      } else if (months < 12) {
        return `${months} months`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
      }
    } catch (error) {
      console.error("Error calculating age:", error);
      return "Age unknown";
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
              My Children
            </h1>
            <p className="text-amber-700 text-lg">
              Manage profiles and track each child's speech development
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-6 py-3 teddy-shadow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Child
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-white/60 rounded-3xl animate-pulse teddy-shadow" />
            ))}
          </div>
        ) : children.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  age={calculateAge(child.date_of_birth)}
                  onEdit={setEditingChild}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center teddy-shadow">
              <span className="text-4xl">👶</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              No Children Added Yet
            </h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              Add your first child's profile to start tracking their speech development journey
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-8 py-4 text-lg teddy-shadow"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add Your First Child
            </Button>
          </motion.div>
        )}

        <AddChildDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSave={handleAddChild}
        />
        <EditChildDialog
          isOpen={!!editingChild}
          child={editingChild}
          onClose={() => setEditingChild(null)}
          onSave={handleEditChild}
        />
      </div>
    </div>
  );
}