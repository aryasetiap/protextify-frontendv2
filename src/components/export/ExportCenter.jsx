// src/components/export/ExportCenter.jsx
import { useState } from "react";
import { Download, FileText, BarChart3, Filter } from "lucide-react";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import Select from "../ui/Select";
import { Switch } from "../ui/Switch";
import { DatePicker } from "../ui/DatePicker";
import Input from "../ui/Input";
import ExportModal from "../forms/ExportModal";
import {
  exportSubmissionsToCSV,
  exportSubmissionsToExcel,
  exportSubmissionsToJSON,
  exportAnalyticsData,
  calculateSubmissionStatistics,
} from "../../utils/exportUtils";
import toast from "react-hot-toast";

export default function ExportCenter({
  submissions,
  assignmentTitle,
  className = "",
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [exportType, setExportType] = useState("submissions");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    startDate: null,
    endDate: null,
    includeGraded: true,
    includeUngraded: true,
    minScore: null,
    maxScore: null,
  });

  // Filter submissions sesuai field BE
  const filteredSubmissions = submissions.filter((submission) => {
    // Status filter
    if (filters.status !== "all" && submission.status !== filters.status) {
      return false;
    }

    // Grade filter
    if (!filters.includeGraded && typeof submission.grade === "number")
      return false;
    if (!filters.includeUngraded && typeof submission.grade !== "number")
      return false;

    // Score range filter
    if (
      filters.minScore !== null &&
      typeof submission.plagiarismScore === "number" &&
      submission.plagiarismScore < filters.minScore
    )
      return false;
    if (
      filters.maxScore !== null &&
      typeof submission.plagiarismScore === "number" &&
      submission.plagiarismScore > filters.maxScore
    )
      return false;

    // Date range filter
    if (filters.startDate) {
      const submissionDate = new Date(submission.createdAt);
      if (submissionDate < new Date(filters.startDate)) return false;
    }
    if (filters.endDate) {
      const submissionDate = new Date(submission.createdAt);
      if (submissionDate > new Date(filters.endDate)) return false;
    }

    return true;
  });

  // Export logic hanya field yang tersedia di BE
  const handleQuickExport = async (format) => {
    try {
      const dataToExport =
        filteredSubmissions.length > 0 ? filteredSubmissions : submissions;

      switch (format) {
        case "csv":
          exportSubmissionsToCSV(dataToExport, assignmentTitle);
          break;
        case "excel":
          await exportSubmissionsToExcel(dataToExport, assignmentTitle);
          break;
        case "json":
          exportSubmissionsToJSON(dataToExport, assignmentTitle);
          break;
        default:
          throw new Error("Format tidak didukung");
      }

      toast.success(`Export ${format.toUpperCase()} berhasil`);
    } catch (error) {
      console.error("Quick export error:", error);
      toast.error(`Gagal export ${format.toUpperCase()}`);
    }
  };

  // Analytics export hanya statistik FE
  const handleAnalyticsExport = async () => {
    try {
      const dataToAnalyze =
        filteredSubmissions.length > 0 ? filteredSubmissions : submissions;
      const analytics = calculateSubmissionStatistics(dataToAnalyze);

      const analyticsData = {
        summary: analytics,
        submissions: dataToAnalyze,
        filters: filters,
        generatedAt: new Date().toISOString(),
        assignmentTitle,
      };

      exportAnalyticsData(analyticsData, `${assignmentTitle}_analytics`);
      toast.success("Analytics report berhasil diexport");
    } catch (error) {
      console.error("Analytics export error:", error);
      toast.error("Gagal export analytics report");
    }
  };

  // Export options hanya yang didukung BE
  const exportOptions = [
    {
      id: "csv",
      name: "CSV",
      description: "Comma-separated values",
      icon: FileText,
      action: () => handleQuickExport("csv"),
    },
    {
      id: "excel",
      name: "Excel",
      description: "Microsoft Excel format",
      icon: BarChart3,
      action: () => handleQuickExport("excel"),
    },
    {
      id: "json",
      name: "JSON",
      description: "JavaScript Object Notation",
      icon: FileText,
      action: () => handleQuickExport("json"),
    },
    {
      id: "advanced",
      name: "Advanced Export",
      description: "Customizable export options",
      icon: Download,
      action: () => setShowExportModal(true),
    },
    {
      id: "analytics",
      name: "Analytics Report",
      description: "Statistical analysis report",
      icon: BarChart3,
      action: handleAnalyticsExport,
    },
  ];

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Export Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Export Center
            </h3>
            <p className="text-sm text-gray-600">
              Export {filteredSubmissions.length} of {submissions.length}{" "}
              submissions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAnalyticsModal(true)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Quick Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportOptions.map((option) => (
            <Card
              key={option.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={option.action}
            >
              <div className="flex items-center gap-3">
                <option.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Applied Filters Display */}
        {(filters.status !== "all" ||
          filters.dateRange !== "all" ||
          !filters.includeGraded ||
          !filters.includeUngraded) && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Active Filters</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.status !== "all" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Status: {filters.status}
                    </span>
                  )}
                  {!filters.includeGraded && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Exclude Graded
                    </span>
                  )}
                  {!filters.includeUngraded && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Exclude Ungraded
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({
                    status: "all",
                    dateRange: "all",
                    startDate: null,
                    endDate: null,
                    includeGraded: true,
                    includeUngraded: true,
                    minScore: null,
                    maxScore: null,
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Advanced Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        submissions={
          filteredSubmissions.length > 0 ? filteredSubmissions : submissions
        }
        assignmentTitle={assignmentTitle}
      />

      {/* Filters Modal */}
      <Modal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        title="Export Filters"
        size="md"
      >
        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
            </Select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Filter
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Switch
                  checked={filters.includeGraded}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({ ...prev, includeGraded: checked }))
                  }
                />
                <label className="ml-3 text-sm text-gray-700">
                  Include Graded
                </label>
              </div>
              <div className="flex items-center">
                <Switch
                  checked={filters.includeUngraded}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      includeUngraded: checked,
                    }))
                  }
                />
                <label className="ml-3 text-sm text-gray-700">
                  Include Ungraded
                </label>
              </div>
            </div>
          </div>

          {/* Score Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plagiarism Score Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Min Score (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minScore: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Max Score (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxScore || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxScore: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Start Date
                </label>
                <DatePicker
                  value={filters.startDate}
                  onChange={(date) =>
                    setFilters((prev) => ({ ...prev, startDate: date }))
                  }
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  End Date
                </label>
                <DatePicker
                  value={filters.endDate}
                  onChange={(date) =>
                    setFilters((prev) => ({ ...prev, endDate: date }))
                  }
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowAnalyticsModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowAnalyticsModal(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
