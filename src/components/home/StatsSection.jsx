// src/components/home/StatsSection.jsx
import { useEffect, useState } from "react";
import { Container, AnimatedCounter } from "../../components";
import { Users, BookOpen, FileText, Award } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 10000,
      label: "Pengguna Aktif",
      suffix: "+",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      value: 5000,
      label: "Kelas Dibuat",
      suffix: "+",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      value: 50000,
      label: "Tugas Dianalisis",
      suffix: "+",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 99,
      label: "Akurasi Deteksi",
      suffix: "%",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50/30">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#23407a]/10 rounded-2xl text-[#23407a] mb-4 group-hover:bg-[#23407a] group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
