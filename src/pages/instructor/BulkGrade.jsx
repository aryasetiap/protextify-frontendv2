// src/pages/instructor/BulkGrade.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Users, Star } from "lucide-react";
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
  LoadingSpinner,
} from "../../components";
import { submissionsService } from "../../services";

const bulkGradeSchema = z.object({
  grades: z.array(
    z.object({
      submissionId: z.string(),
      grade: z.number().min(0).max(100),
      feedback: z.string().optional(),
    })
  ),
});

export default function BulkGrade() {
  const { assignmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { selectedSubmissions } = location.state || { selectedSubmissions: [] };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bulkGradeSchema),
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const promises = selectedSubmissions.map((id) =>
        submissionsService.getSubmissionById(id)
      );
      const submissionData = await Promise.all(promises);
      setSubmissions(submissionData);

      // Initialize form values
      const initialGrades = submissionData.map((sub) => ({
        submissionId: sub.id,
        grade: sub.grade || 0,
        feedback: sub.feedback || "",
      }));
      setValue("grades", initialGrades);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Gagal memuat data submission");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const promises = data.grades.map((grade) =>
        submissionsService.gradeSubmission(grade.submissionId, {
          grade: grade.grade,
          feedback: grade.feedback,
        })
      );

      await Promise.all(promises);
      toast.success(`${data.grades.length} submission berhasil dinilai`);
      navigate(`/instructor/assignments/${assignmentId}/monitor`);
    } catch (error) {
      console.error("Error bulk grading:", error);
      toast.error("Gagal memberikan nilai");
    } finally {
      setSaving(false);
    }
  };

  const handleGradeAll = (grade) => {
    const currentGrades = watch("grades") || [];
    const updatedGrades = currentGrades.map((g) => ({ ...g, grade }));
    setValue("grades", updatedGrades);
  };

  if (loading) {
    return (
      <Container className="py-6">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate(`/instructor/assignments/${assignmentId}/monitor`)
          }
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Nilai Massal</h1>
          <p className="text-gray-600">
            {submissions.length} submission dipilih
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGradeAll(100)}
            >
              Nilai Semua: 100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGradeAll(90)}
            >
              Nilai Semua: 90
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGradeAll(80)}
            >
              Nilai Semua: 80
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGradeAll(70)}
            >
              Nilai Semua: 70
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Grading Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <Card key={submission.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {submission.student?.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {submission.student?.email}
                    </p>
                    {submission.submittedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Dikumpulkan:{" "}
                        {new Date(submission.submittedAt).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nilai
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...register(`grades.${index}.grade`, {
                          valueAsNumber: true,
                        })}
                        className="text-center"
                      />
                    </div>

                    <div className="w-64">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                      </label>
                      <Textarea
                        {...register(`grades.${index}.feedback`)}
                        placeholder="Feedback untuk siswa..."
                        className="resize-none h-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(`/instructor/assignments/${assignmentId}/monitor`)
            }
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={saving}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Nilai ({submissions.length})
          </Button>
        </div>
      </form>
    </Container>
  );
}
