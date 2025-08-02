import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { AudioInterface } from "@/components/ui/audio-interface";
import { DashboardPreview } from "@/components/ui/dashboard-preview";
import { FeaturesSection } from "@/components/ui/features-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AudioInterface />
      <DashboardPreview />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
