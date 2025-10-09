import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Breadcrumb,
  LoadingSpinner,
  Alert,
} from "../../components";

import RichTextEditor from "../../components/forms/RichTextEditor";
import TextStatistics from "../../components/editor/TextStatistics";
import DraftActions from "../../components/editor/DraftActions";
import CitationManager from "../../components/editor/CitationManager";
import CopyPasteMonitor from "../../components/editor/CopyPasteMonitor";
import SubmissionActions from "../../components/submission/SubmissionActions";

import { useTextAnalytics } from "../../hooks/useTextAnalytics";
import { assignmentsService, submissionsService } from "../../services";

export default function WriteAssignment() {
  const { classId, assignmentId, id } = useParams();
  const effectiveAssignmentId = assignmentId || id;
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // State
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [localSubmissionId, setLocalSubmissionId] = useState(null);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [citations, setCitations] = useState([]);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [contentInitialized, setContentInitialized] = useState(false);

  // Load assignment data
  useEffect(() => {
    const loadAssignmentData = async () => {
      setLoadingAssignment(true);
      console.log(
        "[WriteAssignment] Mulai load assignment:",
        effectiveAssignmentId
      );
      try {
        let assignmentData;
        if (classId) {
          assignmentData = await assignmentsService.getAssignmentDetail(
            classId,
            effectiveAssignmentId
          );
        } else {
          assignmentData = await assignmentsService.getAssignmentById(
            effectiveAssignmentId
          );
        }
        console.log("[WriteAssignment] Assignment response:", assignmentData);
        setAssignment(assignmentData);
      } catch (error) {
        console.error("[WriteAssignment] ERROR assignment:", error);
        toast.error("Gagal memuat data tugas");
        setAssignment(null);
      } finally {
        setLoadingAssignment(false);
        console.log(
          "[WriteAssignment] Selesai load assignment:",
          effectiveAssignmentId
        );
      }
    };
    if (effectiveAssignmentId) loadAssignmentData();
  }, [classId, effectiveAssignmentId]);

  // Create draft submission jika belum ada
  useEffect(() => {
    const createOrFetchSubmission = async () => {
      if (!effectiveAssignmentId || !assignment) return;
      setLoadingSubmission(true);
      console.log(
        "[WriteAssignment] Mulai cek/membuat submission draft:",
        effectiveAssignmentId
      );
      try {
        const history = await submissionsService.getHistory();
        console.log("[WriteAssignment] Submission history:", history);
        const existing = history.find(
          (s) => s.assignmentId === effectiveAssignmentId
        );
        if (existing) {
          console.log(
            "[WriteAssignment] Submission draft sudah ada:",
            existing.id
          );
          setLocalSubmissionId(existing.id);
        } else {
          const newSubmission = await submissionsService.createSubmission(
            effectiveAssignmentId,
            { content: "" }
          );
          console.log(
            "[WriteAssignment] Submission draft baru dibuat:",
            newSubmission
          );
          setLocalSubmissionId(newSubmission.id);
        }
      } catch (error) {
        console.error("[WriteAssignment] ERROR submission draft:", error);
        toast.error("Gagal membuat/memuat submission");
      } finally {
        setLoadingSubmission(false);
        console.log(
          "[WriteAssignment] Selesai cek/membuat submission draft:",
          effectiveAssignmentId
        );
      }
    };
    if (assignment && effectiveAssignmentId) createOrFetchSubmission();
  }, [assignment, effectiveAssignmentId]);

  // Fetch submission detail setiap kali localSubmissionId berubah
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!localSubmissionId) return;
      setLoadingSubmission(true);
      console.log(
        "[WriteAssignment] Mulai fetch submission detail:",
        localSubmissionId
      );
      try {
        const data = await submissionsService.getSubmissionById(
          localSubmissionId
        );
        console.log("[WriteAssignment] Submission detail response:", data);
        setSubmission(data);

        // Set initial content untuk editor
        const draftContent = data.content || "";
        setInitialContent(draftContent);
        setContent(draftContent); // IMPORTANT: Set content state segera
        setContentInitialized(false); // Reset flag saat data baru

        console.log("[WriteAssignment] Set initial content:", draftContent);
      } catch (error) {
        console.error(
          "[WriteAssignment] ERROR fetch submission detail:",
          error
        );
        setSubmission(null);
      } finally {
        setLoadingSubmission(false);
        console.log(
          "[WriteAssignment] Selesai fetch submission detail:",
          localSubmissionId
        );
      }
    };
    if (localSubmissionId) fetchSubmission();
  }, [localSubmissionId]);

  // Polling submission status setiap 45 detik
  useEffect(() => {
    if (!localSubmissionId) return;
    const interval = setInterval(async () => {
      try {
        const data = await submissionsService.getSubmissionById(
          localSubmissionId
        );
        setSubmission(data);
      } catch (error) {
        // Silent error
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [localSubmissionId]);

  // Auto-save konten setiap 15 detik
  useEffect(() => {
    if (
      !localSubmissionId ||
      !submission ||
      submission.status !== "DRAFT" ||
      !contentInitialized
    )
      return;
    const interval = setInterval(async () => {
      if (content.trim() === "" || content === initialContent) return; // Don't save if no changes
      setSaving(true);
      try {
        await submissionsService.updateSubmissionContent(
          localSubmissionId,
          content
        );
        toast.success("Draft tersimpan otomatis");
      } catch (error) {
        toast.error("Auto-save gagal");
      } finally {
        setSaving(false);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [
    localSubmissionId,
    content,
    submission,
    initialContent,
    contentInitialized,
  ]);

  // Handle content change
  const handleContentChange = (newContent) => {
    console.log("[WriteAssignment] Content changed:", newContent);

    // ALWAYS update content state, let auto-save handle the timing
    setContent(newContent);
  };

  // Handle editor ready
  const handleEditorReady = () => {
    console.log("[WriteAssignment] Editor ready");
    setEditorReady(true);

    // Mark content as initialized setelah delay yang cukup
    setTimeout(() => {
      setContentInitialized(true);
      console.log("[WriteAssignment] Content initialization completed");
    }, 300); // Increased delay untuk memastikan editor fully ready
  };

  // Manual save
  const handleSave = async () => {
    if (!localSubmissionId) return;
    setSaving(true);
    try {
      await submissionsService.updateSubmissionContent(
        localSubmissionId,
        content
      );
      toast.success("Draft berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan draft");
    } finally {
      setSaving(false);
    }
  };

  // Submit tugas
  const handleSubmit = async () => {
    if (
      !localSubmissionId ||
      !submission ||
      submission.status !== "DRAFT" ||
      !content.trim()
    ) {
      toast.error(
        "Submission tidak bisa dikumpulkan. Pastikan draft sudah diisi."
      );
      return;
    }
    setSubmitting(true);
    try {
      await submissionsService.submitSubmission(localSubmissionId);
      toast.success("Tugas berhasil dikumpulkan!");
      const updated = await submissionsService.getSubmissionById(
        localSubmissionId
      );
      setSubmission(updated);
      navigate(`/dashboard/classes/${assignment?.classId}`);
    } catch (error) {
      toast.error("Gagal mengumpulkan tugas");
    } finally {
      setSubmitting(false);
    }
  };

  // Citation handlers
  const handleAddCitation = (citation) =>
    setCitations([...citations, citation]);
  const handleEditCitation = (index, citation) => {
    const newCitations = [...citations];
    newCitations[index] = citation;
    setCitations(newCitations);
  };
  const handleRemoveCitation = (index) =>
    setCitations(citations.filter((_, i) => i !== index));
  const handleInsertCitation = (citationText) => {
    if (editorRef.current) editorRef.current.insertText(`(${citationText})`);
  };

  // Suspicious activity handler
  const handleSuspiciousActivity = (event) => {
    toast.warning(
      `Terdeteksi aktivitas copy-paste: ${event.textLength} karakter. Pastikan ini adalah karya asli Anda.`,
      { duration: 5000 }
    );
  };

  // Selalu panggil hook di atas
  const { stats, limitChecks, validation } = useTextAnalytics(content, {
    maxWords: 1000,
    maxCharacters: 7000,
    minWords: 100,
  });

  // Baru lakukan pengecekan data setelah hook
  if (loadingAssignment || loadingSubmission) {
    return (
      <Container className="py-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!assignment || !submission) {
    return (
      <Container className="py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Data tidak ditemukan</strong>
            <p>Submission atau assignment tidak dapat dimuat.</p>
          </div>
        </Alert>
      </Container>
    );
  }

  // Status info
  const statusInfo = {
    DRAFT: { label: "Draft", color: "yellow" },
    SUBMITTED: { label: "Dikumpulkan", color: "blue" },
    GRADED: { label: "Dinilai", color: "green" },
  }[submission.status] || { label: "Draft", color: "yellow" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <Container className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to={`/dashboard/classes/${assignment.classId}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Kelas
              </Link>
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  {
                    label: assignment.class?.name || "Kelas",
                    href: `/dashboard/classes/${assignment.classId}`,
                  },
                  { label: assignment.title, current: true },
                ]}
              />
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  statusInfo.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : statusInfo.color === "blue"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {statusInfo.label}
              </div>
              {saving && (
                <span className="text-blue-600 text-xs ml-2 animate-pulse">
                  Menyimpan...
                </span>
              )}
              {!saving && submission.status === "DRAFT" && (
                <span className="text-gray-500 text-xs ml-2">
                  Draft belum dikirim
                </span>
              )}
              {submission.status === "SUBMITTED" && (
                <span className="text-green-600 text-xs ml-2">
                  Sudah dikumpulkan
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            {/* Assignment Info */}
            <Card className="mb-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {assignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignment.instructions,
                    }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>
                    Deadline:{" "}
                    {new Date(assignment.deadline).toLocaleString("id-ID")}
                  </span>
                  <span>Minimal: 100 kata</span>
                  <span>Maksimal: 1000 kata</span>
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="mb-2">
              <CardContent className="p-0">
                <RichTextEditor
                  ref={editorRef}
                  key={localSubmissionId} // Force re-render when submission changes
                  value={initialContent} // Use initialContent instead of content
                  onChange={handleContentChange}
                  onEditorReady={handleEditorReady}
                  disabled={submission.status !== "DRAFT"}
                  maxWords={1000}
                  placeholder="Mulai tulis jawaban Anda di sini..."
                />
              </CardContent>
            </Card>

            {/* Citations */}
            <Card className="mb-2">
              <CardHeader>
                <CardTitle>Daftar Pustaka & Sitasi</CardTitle>
              </CardHeader>
              <CardContent>
                <CitationManager
                  citations={citations}
                  onAdd={handleAddCitation}
                  onEdit={handleEditCitation}
                  onRemove={handleRemoveCitation}
                  onInsert={handleInsertCitation}
                />
              </CardContent>
            </Card>

            {/* Submission Actions */}
            {submission && (
              <Card className="mb-2">
                <CardContent>
                  <SubmissionActions
                    submission={submission}
                    type="single"
                    onActionComplete={() => {
                      // Refresh data if needed
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
            <TextStatistics
              stats={stats}
              limitChecks={limitChecks}
              validation={validation}
            />

            <CopyPasteMonitor
              editorRef={editorRef}
              onSuspiciousActivity={handleSuspiciousActivity}
              enabled={submission.status === "DRAFT"}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Kelas:</span>
                  <p className="text-gray-600">{assignment.class?.name}</p>
                </div>
                <div>
                  <span className="font-medium">Instruktur:</span>
                  <p className="text-gray-600">
                    {assignment.class?.instructor?.fullName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Dibuat:</span>
                  <p className="text-gray-600">
                    {new Date(submission.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                {submission.submittedAt && (
                  <div>
                    <span className="font-medium">Dikumpulkan:</span>
                    <p className="text-gray-600">
                      {new Date(submission.submittedAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>

      {/* Fixed Bottom Actions */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <Container className="py-4">
          <DraftActions
            submission={submission}
            canEdit={submission.status === "DRAFT"}
            canSubmit={submission.status === "DRAFT" && content.trim()}
            saving={saving}
            submitting={submitting}
            onSave={handleSave}
            onSubmit={handleSubmit}
            onRefresh={() => {
              if (localSubmissionId) {
                submissionsService
                  .getSubmissionById(localSubmissionId)
                  .then(setSubmission);
              }
            }}
            validation={validation}
          />
        </Container>
      </div>
    </div>
  );
}
