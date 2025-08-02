import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Award, Heart } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-warm-50 to-peach-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-warm-800 mb-4">
            Beautiful Daily Insights
          </h2>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            Track your baby's speech development with warm, encouraging visualizations 
            and milestone celebrations that make every moment special.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          
          {/* Main Dashboard Card */}
          <Card className="p-8 bg-white border-0 shadow-cozy rounded-3xl mb-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-warm-800">Little Emma's Progress</h3>
                <p className="text-warm-600">8 months old • Active today</p>
              </div>
              <div className="flex items-center space-x-2 bg-peach-100 text-warm-700 px-4 py-2 rounded-full">
                <Heart className="h-4 w-4 text-peach-500" />
                <span className="text-sm font-medium">Babble Score: 87</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-warm-100 to-warm-200 p-6 rounded-2xl text-center">
                <TrendingUp className="h-8 w-8 text-warm-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-warm-800">24</div>
                <div className="text-sm text-warm-600">Babbles Today</div>
              </div>
              
              <div className="bg-gradient-to-br from-peach-100 to-peach-200 p-6 rounded-2xl text-center">
                <Calendar className="h-8 w-8 text-peach-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-warm-800">7</div>
                <div className="text-sm text-warm-600">Days Tracked</div>
              </div>
              
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 p-6 rounded-2xl text-center">
                <Award className="h-8 w-8 text-sage-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-warm-800">3</div>
                <div className="text-sm text-warm-600">Milestones</div>
              </div>
              
              <div className="bg-gradient-to-br from-warm-200 to-warm-300 p-6 rounded-2xl text-center">
                <Heart className="h-8 w-8 text-warm-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-warm-800">12m</div>
                <div className="text-sm text-warm-600">Total Audio</div>
              </div>
            </div>

            {/* Progress Chart Simulation */}
            <div className="bg-warm-50 rounded-2xl p-6 felt-texture">
              <h4 className="text-lg font-semibold text-warm-800 mb-4">Weekly Progress</h4>
              <div className="space-y-3">
                
                {/* Progress bars for each day */}
                {[
                  { day: 'Mon', progress: 65, babbles: 18 },
                  { day: 'Tue', progress: 72, babbles: 22 },
                  { day: 'Wed', progress: 68, babbles: 19 },
                  { day: 'Thu', progress: 85, babbles: 28 },
                  { day: 'Fri', progress: 87, babbles: 24 },
                  { day: 'Sat', progress: 79, babbles: 31 },
                  { day: 'Sun', progress: 92, babbles: 35 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-warm-700">{item.day}</div>
                    <div className="flex-1 bg-warm-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-warm-500 to-peach-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-warm-600 w-16">{item.babbles} babbles</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Milestones */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-warm-800 mb-4">Recent Milestones 🎉</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-peach-100 p-4 rounded-xl">
                  <div className="w-3 h-3 bg-peach-400 rounded-full animate-soft-pulse"></div>
                  <div>
                    <div className="font-medium text-warm-800">First "ma-ma" sound detected!</div>
                    <div className="text-sm text-warm-600">2 days ago • Age: 8 months</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-sage-100 p-4 rounded-xl">
                  <div className="w-3 h-3 bg-sage-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-warm-800">Consistent babbling pattern</div>
                    <div className="text-sm text-warm-600">1 week ago • Age: 8 months</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-warm-200 p-4 rounded-xl">
                  <div className="w-3 h-3 bg-warm-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-warm-800">Responsive to voice patterns</div>
                    <div className="text-sm text-warm-600">2 weeks ago • Age: 7 months</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 text-white rounded-2xl px-8 py-4 text-lg font-medium shadow-cozy transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              Explore Full Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};