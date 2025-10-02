// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button, Container, Badge } from "../../components";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <Badge
              variant="glass"
              className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Platform
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Platform Deteksi{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Plagiarisme
            </span>
            <br />
            untuk Dunia Akademik Modern
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Protextify membantu institusi pendidikan mendeteksi plagiarisme
            dengan teknologi AI terdepan, mengelola kelas dengan mudah, dan
            memberikan pengalaman menulis yang optimal untuk siswa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/auth/register">
              <Button
                size="xl"
                className="group bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="xl"
              variant="ghost"
              className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Lihat Demo
            </Button>
          </div>

          {/* Trust Indicators
          <div className="text-white/60 text-sm">
            <p className="mb-4">Dipercaya oleh 1000+ institusi pendidikan</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              Logo universitas placeholder
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
            </div>
          </div> */}
        </div>
      </Container>
    </section>
  );
}
