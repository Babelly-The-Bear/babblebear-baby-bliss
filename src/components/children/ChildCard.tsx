import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ChildCard({ child, age, onEdit }) {
  const getGenderEmoji = (gender) => {
    switch (gender) {
      case 'boy': return '👦';
      case 'girl': return '👧';
      default: return '👶';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/40 to-amber-300/40 rounded-full transform translate-x-6 -translate-y-6" />
          
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center text-2xl">
                {getGenderEmoji(child.gender)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(child)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-amber-900">{child.name}</h3>
                <p className="text-amber-700 font-medium">{age} old</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Calendar className="w-4 h-4" />
                <span>Born {format(new Date(child.birth_date), "MMM d, yyyy")}</span>
              </div>

              {child.medical_notes && (
                <div className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-700">
                    <strong>Notes:</strong> {child.medical_notes}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-amber-100">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Last Session:</span>
                  <span className="text-amber-800 font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-amber-600">Avg. Score:</span>
                  <span className="text-emerald-600 font-bold">82</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
} 