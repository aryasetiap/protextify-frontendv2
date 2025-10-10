// src/pages/instructor/GradeSubmission.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Alert,
  Breadcrumb,
  Badge,
} from "../../components";
import { formatDateTime } from "../../utils/helpers";

export default function GradeSubmission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // DUMMY DATA untuk testing UI
  const submission = {
    id: submissionId,
    student: {
      id: "student-3",
      fullName: "Citra Dewi",
      studentId: "2111003",
      email: "citra.dewi@student.unila.ac.id",
    },
    assignment: {
      id: "assignment-4",
      title: "Analisis Sistem Informasi Manajemen",
      maxScore: 100,
      class: {
        name: "Sistem Informasi Lanjut",
        code: "SIM-301",
      },
    },
    status: "submitted",
    submittedAt: "2025-10-14T16:45:00",
    content: `
      <h2>Pendahuluan</h2>
      <p>Sistem Informasi Manajemen (SIM) merupakan sistem yang terintegrasi yang menyediakan informasi untuk mendukung operasi, manajemen, dan fungsi pengambilan keputusan dalam suatu organisasi. Dalam era digital saat ini, SIM menjadi komponen krusial yang menentukan kesuksesan dan efisiensi operasional perusahaan.</p>
      
      <h2>Analisis Komponen SIM</h2>
      <p>Berdasarkan studi kasus pada PT. Teknologi Maju Indonesia, terdapat beberapa komponen utama dalam sistem informasi manajemen mereka:</p>
      <ul>
        <li><strong>Hardware:</strong> Server IBM System X, workstation Dell, dan infrastruktur jaringan fiber optic</li>
        <li><strong>Software:</strong> SAP ERP, Microsoft Office 365, dan aplikasi custom yang dikembangkan in-house</li>
        <li><strong>Data:</strong> Database Oracle yang menyimpan transaksi bisnis, data pelanggan, dan inventori</li>
        <li><strong>Prosedur:</strong> SOP yang terdokumentasi untuk setiap proses bisnis utama</li>
        <li><strong>People:</strong> Tim IT yang terdiri dari 25 orang dengan spesialisasi berbeda</li>
      </ul>
      
      <h2>Dampak Implementasi SIM</h2>
      <p>Implementasi SIM di PT. Teknologi Maju Indonesia memberikan dampak signifikan:</p>
      <ol>
        <li>Peningkatan efisiensi operasional sebesar 35% dalam 6 bulan pertama</li>
        <li>Pengurangan biaya operasional hingga Rp 2,5 miliar per tahun</li>
        <li>Peningkatan akurasi data dari 85% menjadi 98%</li>
        <li>Waktu pengambilan keputusan manajerial berkurang dari 3 hari menjadi real-time</li>
      </ol>
      
      <h2>Kesimpulan</h2>
      <p>Sistem Informasi Manajemen yang dirancang dengan baik dapat memberikan competitive advantage bagi perusahaan. Kunci sukses implementasi terletak pada integrasi yang baik antar komponen, pelatihan SDM yang memadai, dan dukungan manajemen yang kuat.</p>
    `,
    fileUrl: "/uploads/submission-3.pdf",
    plagiarismScore: 8,
    wordCount: 1250,
    score: null,
    feedback: null,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      score: submission.score || "",
      feedback: submission.feedback || "",
    },
  });

  const scoreValue = watch("score");

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Nilai berhasil disimpan!");
      navigate(`/instructor/assignments/${submission.assignment.id}`);
    } catch (error) {
      console.error("Error saving grade:", error);
      toast.error("Gagal menyimpan nilai");
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGrade = (score) => {
    if (!score) return "-";
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "E";
  };

  const getPlagiarismLevel = (score) => {
    if (!score) return { level: "Tidak Ada Data", color: "gray", variant: "outline" };
    if (score < 10) return { level: "Sangat Rendah", color: "green", variant: "success" };
    if (score < 20) return { level: "Rendah", color: "blue", variant: "info" };
    if (score < 40) return { level: "Sedang", color: "yellow", variant: "warning" };
    return { level: "Tinggi", color: "red", variant: "error" };
  };

  const plagiarismInfo = getPlagiarismLevel(submission.plagiarismScore);

  return (
    <Container className="py-6 max-w-7xl">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beri Nilai Tugas</h1>
            <p className="text-gray-600 mt-1">
              {submission.assignment.class.code} • {submission.assignment.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Info & Plagiarism */}
        <div className="space-y-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-[#23407a]" />
                Informasi Mahasiswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                <p className="text-gray-900 font-semibold mt-1">{submission.student.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">NIM</label>
                <p className="text-gray-900 mt-1">{submission.student.studentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 mt-1 text-sm">{submission.student.email}</p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Waktu Submit
                </div>
                <p className="text-gray-900 font-medium">{formatDateTime(submission.submittedAt)}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Jumlah Kata
                </div>
                <p className="text-gray-900 font-medium">{submission.wordCount.toLocaleString()} kata</p>
              </div>
            </CardContent>
          </Card>

          {/* Plagiarism Card */}
          <Card className={`border-2 ${
            submission.plagiarismScore < 10 ? "border-green-200 bg-green-50" :
            submission.plagiarismScore < 20 ? "border-blue-200 bg-blue-50" :
            submission.plagiarismScore < 40 ? "border-yellow-200 bg-yellow-50" :
            "border-red-200 bg-red-50"
          }`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className={`h-5 w-5 mr-2 ${
                  submission.plagiarismScore < 10 ? "text-green-600" :
                  submission.plagiarismScore < 20 ? "text-blue-600" :
                  submission.plagiarismScore < 40 ? "text-yellow-600" :
                  "text-red-600"
                }`} />
                Hasil Cek Plagiarisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className={`text-5xl font-bold mb-2 ${
                  submission.plagiarismScore < 10 ? "text-green-600" :
                  submission.plagiarismScore < 20 ? "text-blue-600" :
                  submission.plagiarismScore < 40 ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {submission.plagiarismScore}%
                </div>
                <Badge variant={plagiarismInfo.variant} className="text-sm">
                  {plagiarismInfo.level}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    submission.plagiarismScore < 20 ? "text-green-600" : "text-red-600"
                  }`}>
                    {submission.plagiarismScore < 20 ? "Aman" : "Perlu Ditinjau"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kemiripan:</span>
                  <span className="font-medium text-gray-900">{submission.plagiarismScore}% dari teks</span>
                </div>
              </div>

              <Alert variant={submission.plagiarismScore < 20 ? "success" : "warning"} className="mt-4">
                <p className="text-xs">
                  {submission.plagiarismScore < 20 
                    ? "Tingkat plagiarisme dalam batas wajar. Tugas dapat dinilai."
                    : "Tingkat plagiarisme cukup tinggi. Pertimbangkan untuk memberikan feedback terkait hal ini."}
                </p>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Assignment Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-[#23407a]" />
                  Konten Tugas
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Full Screen
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none bg-gray-50 rounded-lg p-6 border border-gray-200"
                dangerouslySetInnerHTML={{ __html: submission.content }}
              />
            </CardContent>
          </Card>

          {/* Grading Form Card */}
          <Card className="border-2 border-[#23407a]/20">
            <CardHeader className="bg-gradient-to-r from-[#23407a]/5 to-[#3b5fa4]/5">
              <CardTitle className="text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#23407a]" />
                Penilaian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Score Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max={submission.assignment.maxScore}
                        step="0.5"
                        {...register("score", {
                          required: "Nilai harus diisi",
                          min: { value: 0, message: "Nilai minimal 0" },
                          max: { 
                            value: submission.assignment.maxScore, 
                            message: `Nilai maksimal ${submission.assignment.maxScore}` 
                          },
                        })}
                        placeholder={`0 - ${submission.assignment.maxScore}`}
                        className="text-lg font-semibold"
                      />
                      {errors.score && (
                        <p className="text-red-500 text-sm mt-1">{errors.score.message}</p>
                      )}
                    </div>
                    
                    {/* Score Preview */}
                    <div className="text-center min-w-[120px] p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className={`text-3xl font-bold ${getScoreColor(scoreValue)}`}>
                        {scoreValue || "-"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        / {submission.assignment.maxScore}
                      </div>
                      <Badge variant="outline" className="mt-2">
                        Grade: {getScoreGrade(scoreValue)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback untuk Mahasiswa
                  </label>
                  <Textarea
                    {...register("feedback")}
                    rows={8}
                    placeholder="Berikan feedback yang konstruktif untuk membantu mahasiswa belajar..."
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tips: Berikan komentar spesifik tentang kekuatan dan area yang perlu diperbaiki
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#23407a] hover:bg-[#1a2f5c]"
                  >
                    {saving ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Simpan Nilai
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

