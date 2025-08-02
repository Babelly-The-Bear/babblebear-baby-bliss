import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mic, Plus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Record Session",
    description: "Start a new babble recording",
    icon: Mic,
    url: "Record",
    color: "bg-rose-500 hover:bg-rose-600",
  },
  {
    title: "Add Child",
    description: "Add a new child profile",
    icon: Plus,
    url: "Children",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "View Analytics",  
    description: "See detailed progress charts",
    icon: TrendingUp,
    url: "Analytics", 
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
];

export default function QuickActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(action.url)}>
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto rounded-2xl hover:bg-amber-50 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-amber-900">
                    {action.title}
                  </div>
                  <div className="text-sm text-amber-600">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
} 