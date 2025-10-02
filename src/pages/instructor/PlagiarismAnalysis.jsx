// src/pages/instructor/PlagiarismAnalysis.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  BarChart3,
  Search,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import Container from "../../components/ui/Container";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/Tabs";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import Breadcrumb from "../../components/layout/Breadcrumb";
import PlagiarismReport from "../../components/plagiarism/PlagiarismReport";
import SourceHighlighter from "../../components/plagiarism/SourceHighlighter";
import PlagiarismTrigger from "../../components/plagiarism/PlagiarismTrigger";
import { submissionsService, plagiarismService } from "../../services";
import toast from "react-hot-toast";

export default function PlagiarismAnalysis() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [plagiarismData, setPlagiarismData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [submissionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [submissionData] = await Promise.all([
        submissionsService.getSubmissionById(submissionId),
      ]);

      setSubmission(submissionData);

      // Fetch plagiarism report if available
      if (submissionData.plagiarismScore) {
        const reportData = await plagiarismService.getPlagiarismReport(
          submissionId
        );
        setPlagiarismData(reportData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data analisis");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleNewCheck = () => {
    setPlagiarismData(null);
    setActiveTab("trigger");
  };

  const handleCheckStarted = (result) => {
    toast.success(
      "Pengecekan plagiarisme dimulai, hasil akan muncul dalam beberapa menit"
    );
    setActiveTab("overview");
  };

  const tabs = [
    {
      id: "overview",
      label: "Ringkasan",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "content",
      label: "Analisis Konten",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "sources",
      label: "Sumber Plagiarisme",
      icon: <Search className="h-4 w-4" />,
    },
    {
      id: "trigger",
      label: "Cek Ulang",
      icon: <RefreshCw className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <Container className="py-6">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container className="py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Submission tidak ditemukan
          </h2>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/instructor/dashboard" },
                {
                  label: "Monitor Submissions",
                  href: "/instructor/submissions",
                },
                { label: "Analisis Plagiarisme" },
              ]}
            />
            <div className="flex items-center gap-3 mt-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analisis Plagiarisme
                </h1>
                <p className="text-gray-600">
                  {submission.student?.fullName} •{" "}
                  {submission.assignment?.title}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            {plagiarismData && (
              <Button variant="outline" onClick={handleNewCheck}>
                Cek Ulang
              </Button>
            )}
          </div>
        </div>

        {/* Status Overview */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  submission.status === "SUBMITTED"
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}
              >
                {submission.status === "SUBMITTED" ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Status</div>
                <div className="font-semibold text-gray-900">
                  {submission.status === "SUBMITTED" ? "Dikumpulkan" : "Draft"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Kata</div>
                <div className="font-semibold text-gray-900">
                  {submission.wordCount || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  submission.plagiarismScore > 30
                    ? "bg-red-100"
                    : submission.plagiarismScore > 15
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${
                    submission.plagiarismScore > 30
                      ? "text-red-600"
                      : submission.plagiarismScore > 15
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Plagiarisme
                </div>
                <div className="font-semibold text-gray-900">
                  {submission.plagiarismScore
                    ? `${submission.plagiarismScore}%`
                    : "Belum dicek"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Nilai</div>
                <div className="font-semibold text-gray-900">
                  {submission.grade || "Belum dinilai"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <PlagiarismReport
                submissionId={submissionId}
                score={submission.plagiarismScore}
              />
            </div>
          </TabsContent>

          {/* Content Analysis Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <SourceHighlighter
                content={submission.content}
                plagiarismIndexes={
                  plagiarismData?.detailedResults?.indexes || []
                }
                sources={plagiarismData?.detailedResults?.sources || []}
              />
            </div>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources">
            <div className="space-y-6">
              {plagiarismData?.detailedResults?.sources?.length > 0 ? (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sumber Plagiarisme Terdeteksi
                  </h3>
                  <div className="space-y-4">
                    {plagiarismData.detailedResults.sources.map(
                      (source, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {source.title || "Untitled"}
                              </h4>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {source.url}
                              </a>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-lg font-bold ${
                                  source.score > 80
                                    ? "text-red-600"
                                    : source.score > 50
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {Math.round(source.score)}%
                              </div>
                              <div className="text-sm text-gray-500">
                                {source.plagiarismWords} kata
                              </div>
                            </div>
                          </div>

                          {source.description && (
                            <p className="text-gray-600 text-sm mb-3">
                              {source.description}
                            </p>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Identik:</span>
                              <span className="ml-1 font-medium">
                                {source.identicalWordCounts}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Mirip:</span>
                              <span className="ml-1 font-medium">
                                {source.similarWordCounts}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <span className="ml-1 font-medium">
                                {source.totalNumberOfWords}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Dapat diakses:
                              </span>
                              <span
                                className={`ml-1 font-medium ${
                                  source.canAccess
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {source.canAccess ? "Ya" : "Tidak"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="p-8">
                  <div className="text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Belum Ada Sumber
                    </h3>
                    <p className="text-gray-600">
                      Lakukan pengecekan plagiarisme untuk melihat sumber yang
                      terdeteksi.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Trigger Tab */}
          <TabsContent value="trigger">
            <div className="space-y-6">
              <PlagiarismTrigger
                submissionId={submissionId}
                onCheckStarted={handleCheckStarted}
                disabled={submission.status !== "SUBMITTED"}
                currentScore={submission.plagiarismScore}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
