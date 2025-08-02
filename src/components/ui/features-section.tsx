import { Card } from "@/components/ui/card";
import { Shield, Brain, Calendar, Bell, FileText, Users } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Speech Analysis",
      description: "AI-powered detection of cooing, babbling, and early words with real-time feedback",
      color: "from-warm-400 to-warm-600"
    },
    {
      icon: Calendar,
      title: "Milestone Tracking", 
      description: "Age-appropriate speech milestones with automatic detection and celebration",
      color: "from-peach-400 to-peach-500"
    },
    {
      icon: Bell,
      title: "Gentle Alerts",
      description: "Warm, encouraging notifications for potential concerns or developmental insights",
      color: "from-sage-400 to-sage-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Secure, COPPA-compliant data handling with optional local processing",
      color: "from-warm-500 to-warm-700"
    },
    {
      icon: FileText,
      title: "Pediatrician Reports",
      description: "Beautiful PDF reports perfect for sharing with healthcare providers",
      color: "from-peach-300 to-warm-500"
    },
    {
      icon: Users,
      title: "Family Profiles",
      description: "Multiple child profiles with personalized tracking and insights",
      color: "from-sage-300 to-warm-400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-peach-50 to-warm-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-warm-800 mb-4">
            Everything You Need for Speech Development
          </h2>
          <p className="text-lg text-warm-600 max-w-3xl mx-auto">
            BabbleBear combines advanced AI technology with warm, nurturing design to create 
            the perfect environment for monitoring your baby's communication journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-white border-0 shadow-cozy rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-warm-800 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-warm-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          
          {/* How It Works */}
          <Card className="p-8 bg-gradient-to-br from-white to-warm-50 border-0 shadow-cozy rounded-3xl">
            <h3 className="text-2xl font-bold text-warm-800 mb-6">How BabbleBear Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-warm-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-warm-800">Place & Record</h4>
                  <p className="text-sm text-warm-600">Simply place your phone near baby and start recording</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-peach-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-warm-800">AI Analysis</h4>
                  <p className="text-sm text-warm-600">Advanced algorithms analyze speech patterns and development</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-warm-800">Get Insights</h4>
                  <p className="text-sm text-warm-600">Receive warm, encouraging feedback and milestone tracking</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-8 bg-gradient-to-br from-sage-50 to-peach-50 border-0 shadow-cozy rounded-3xl">
            <h3 className="text-2xl font-bold text-warm-800 mb-6">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                <span className="text-warm-700">COPPA compliant for children under 13</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-peach-400 rounded-full"></div>
                <span className="text-warm-700">Optional local processing - your data stays on device</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warm-400 rounded-full"></div>
                <span className="text-warm-700">Encrypted cloud storage with explicit consent</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                <span className="text-warm-700">Full control over data retention and sharing</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};