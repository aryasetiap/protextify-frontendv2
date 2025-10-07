import { useState, useEffect, useRef, useCallback } from "react";
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
import FileAttachment from "../../components/submission/FileAttachment";
import SubmissionActions from "../../components/submission/SubmissionActions";

import { useDraftManager } from "../../hooks/useDraftManager";
import { useAutoSave } from "../../hooks/useAutoSave";
import { useTextAnalytics } from "../../hooks/useTextAnalytics";
import { useWebSocket } from "../../hooks/useWebSocket";

import { assignmentsService, submissionsService } from "../../services";

export default function WriteAssignment() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // State
  const [assignment, setAssignment] = useState(null);
  const [content, setContent] = useState("");
  const [citations, setCitations] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Hooks
  const {
    submission,
    loading: draftLoading,
    saving,
    submitting,
    saveDraft,
    submitSubmission,
    loadSubmission,
    canEdit,
    canSubmit,
    getStatusInfo,
  } = useDraftManager(submissionId);

  const { autoSave, manualSave } = useAutoSave(submissionId, {
    enabled: canEdit(),
    onSuccess: () => {
      console.log("Auto-save successful");
    },
    onError: (error) => {
      console.error("Auto-save failed:", error);
    },
  });

  const { stats, limitChecks, validation, updateContent } = useTextAnalytics(
    content,
    {
      maxWords: 5000,
      maxCharacters: 25000,
      minWords: 100,
    }
  );

  const { joinSubmission, leaveSubmission } = useWebSocket();

  // Load assignment data
  useEffect(() => {
    const loadAssignmentData = async () => {
      if (!submission?.assignmentId) return;

      try {
        const assignmentData = await assignmentsService.getAssignmentById(
          submission.assignmentId
        );
        setAssignment(assignmentData);
      } catch (error) {
        console.error("Error loading assignment:", error);
        toast.error("Gagal memuat data tugas");
      }
    };

    loadAssignmentData();
  }, [submission?.assignmentId]);

  // Initialize content and WebSocket
  useEffect(() => {
    if (submission && !isInitializing) return;

    if (submission) {
      setContent(submission.content || "");
      updateContent(submission.content || "");

      // Join WebSocket room
      joinSubmission(submissionId);

      setIsInitializing(false);
    }

    return () => {
      // Pastikan leaveSubmission tidak error
      if (typeof leaveSubmission === "function") {
        leaveSubmission(submissionId);
      }
    };
  }, [
    submission,
    submissionId,
    joinSubmission,
    leaveSubmission,
    updateContent,
    isInitializing,
  ]);

  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    updateContent(newContent);

    // Auto-save
    if (canEdit()) {
      autoSave(newContent);
    }
  };

  // Handle manual save
  const handleSave = async () => {
    try {
      await manualSave(content);
      await loadSubmission(); // Refresh data
    } catch (error) {
      toast.error("Gagal menyimpan");
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validation.isValid) {
      toast.error("Pastikan semua validasi terpenuhi sebelum mengumpulkan");
      return;
    }

    try {
      await submitSubmission();
      toast.success("Tugas berhasil dikumpulkan!");
      navigate(`/dashboard/classes/${assignment?.classId}`);
    } catch (error) {
      toast.error("Gagal mengumpulkan tugas");
    }
  };

  // Citation handlers
  const handleAddCitation = (citation) => {
    setCitations([...citations, citation]);
  };

  const handleEditCitation = (index, citation) => {
    const newCitations = [...citations];
    newCitations[index] = citation;
    setCitations(newCitations);
  };

  const handleRemoveCitation = (index) => {
    setCitations(citations.filter((_, i) => i !== index));
  };

  const handleInsertCitation = (citationText) => {
    // Insert citation into TipTap editor
    if (editorRef.current) {
      editorRef.current.insertText(`(${citationText})`);
    }
  };

  // Suspicious activity handler
  const handleSuspiciousActivity = (event) => {
    toast.warning(
      `Terdeteksi aktivitas copy-paste: ${event.textLength} karakter. Pastikan ini adalah karya asli Anda.`,
      { duration: 5000 }
    );
  };

  if (draftLoading || isInitializing) {
    return (
      <Container className="py-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!submission || !assignment) {
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

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Link
                  to={`/dashboard/classes/${assignment.classId}`}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Kembali ke Kelas
                </Link>
              </div>

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

            <div className="flex items-center space-x-4">
              {statusInfo && (
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
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignment.instructions,
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    Deadline:{" "}
                    {new Date(assignment.deadline).toLocaleString("id-ID")}
                  </span>
                  <span>•</span>
                  <span>Minimal: 100 kata</span>
                  <span>•</span>
                  <span>Maksimal: 5000 kata</span>
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card>
              <CardContent className="p-0">
                <RichTextEditor
                  ref={editorRef}
                  value={content}
                  onChange={handleContentChange}
                  onAutoSave={autoSave}
                  disabled={!canEdit()}
                  maxWords={5000}
                  placeholder="Mulai tulis jawaban Anda di sini..."
                />
              </CardContent>
            </Card>

            {/* Citations */}
            <Card>
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

            {/* File Attachments Section */}
            <Card className="p-6">
              <FileAttachment
                submission={submission}
                onFileUploaded={(files) => {
                  // Handle file upload
                  console.log("Files uploaded:", files);
                }}
                onFileDeleted={(fileId) => {
                  // Handle file deletion
                  console.log("File deleted:", fileId);
                }}
                readOnly={submission?.status === "SUBMITTED"}
              />
            </Card>

            {/* Submission Actions */}
            {submission && (
              <Card className="p-4">
                <SubmissionActions
                  submission={submission}
                  type="single"
                  onActionComplete={() => {
                    // Refresh data if needed
                  }}
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Text Statistics */}
            <TextStatistics
              stats={stats}
              limitChecks={limitChecks}
              validation={validation}
            />

            {/* Copy-Paste Monitor */}
            <CopyPasteMonitor
              editorRef={editorRef}
              onSuspiciousActivity={handleSuspiciousActivity}
              enabled={canEdit()}
            />

            {/* Additional Info */}
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
      <DraftActions
        submission={submission}
        canEdit={canEdit()}
        canSubmit={canSubmit()}
        saving={saving}
        submitting={submitting}
        onSave={handleSave}
        onSubmit={handleSubmit}
        onRefresh={loadSubmission}
        validation={validation}
      />
    </div>
  );
}
