import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button, Container, Stack } from "../../components";
import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import TestimonialSection from "../../components/home/TestimonialSection";
import CTASection from "../../components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      {/* Benefits Section - updated version */}
      <TestimonialSection />
      <CTASection />
    </div>
  );
}
