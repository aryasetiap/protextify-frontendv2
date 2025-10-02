// src/components/home/TestimonialSection.jsx
import { Container, Card, CardContent } from "../../components";
import { Star, Quote } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Wijaya",
      role: "Kepala Jurusan Informatika, Universitas ABC",
      content:
        "Protextify telah merevolusi cara kami mengelola tugas mahasiswa. Deteksi plagiarisme yang akurat dan interface yang user-friendly membuat pekerjaan kami jauh lebih efisien.",
      rating: 5,
      avatar: "/avatars/sarah.jpg",
    },
    {
      name: "Prof. Ahmad Rahman",
      role: "Dosen Senior, Institut XYZ",
      content:
        "Platform yang luar biasa! Fitur real-time collaboration membantu mahasiswa dalam proses penulisan, sementara sistem deteksi plagiarisme memberikan hasil yang sangat akurat.",
      rating: 5,
      avatar: "/avatars/ahmad.jpg",
    },
    {
      name: "Maya Sari",
      role: "Mahasiswa Pascasarjana",
      content:
        "Sebagai mahasiswa, saya sangat terbantu dengan fitur auto-save dan feedback real-time. Interface yang intuitif membuat proses penulisan menjadi lebih menyenangkan.",
      rating: 5,
      avatar: "/avatars/maya.jpg",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman dari para pendidik dan mahasiswa yang telah
            menggunakan Protextify
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
            >
              <CardContent className="p-8">
                <Quote className="w-8 h-8 text-[#23407a] mb-4" />

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#23407a]/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#23407a] font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
