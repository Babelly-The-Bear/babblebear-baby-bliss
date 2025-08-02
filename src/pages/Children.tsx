import React, { useState, useEffect } from "react";
import { Child } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



export default function Children() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setIsLoading(true);
    try {
      const childrenData = await Child.list("-created_date");
      setChildren(childrenData);
    } catch (error) {
      console.error("Failed to load children:", error);
    }
    setIsLoading(false);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    
    if (months < 12) {
      return `${months} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Child
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white/60 rounded-3xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : children.length > 0 ? (
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {children.map((child, index) => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-amber-300/30 rounded-full transform translate-x-8 -translate-y-8" />
                      
                      <CardContent className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                              <span className="text-lg">👶</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-amber-900">{child.name}</h3>
                              <p className="text-amber-600">{calculateAge(child.birth_date)} old</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <Calendar className="w-4 h-4" />
                            <span>Born {formatDate(child.birth_date)}</span>
                          </div>

                          {child.notes && (
                            <div className="bg-amber-50 rounded-xl p-3">
                              <p className="text-sm text-amber-700">
                                <span className="font-medium">Notes:</span> {child.notes}
                              </p>
                            </div>
                          )}

                          <div className="pt-3 border-t border-amber-100 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-amber-600">Last Session:</span>
                              <span className="text-emerald-600 font-medium">2 days ago</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-amber-600">Avg. Score:</span>
                              <span className="text-emerald-600 font-medium">82</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">👶</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                No Children Added Yet
              </h3>
              <p className="text-amber-700 mb-6 max-w-md mx-auto">
                Add your first child's profile to start tracking their speech development journey
              </p>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-8 py-4 text-lg shadow-lg transition-all duration-300"
              >
                <Plus className="w-6 h-6 mr-2" />
                Add Your First Child
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 