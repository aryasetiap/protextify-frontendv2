// src/components/submission/SubmissionActions.jsx
import { useState } from "react";
import { Download, FileText, Share2, MoreHorizontal } from "lucide-react";
import Button from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import AdvancedPDFOptions from "../pdf/AdvancedPDFOptions";
import ExportCenter from "../export/ExportCenter";
import submissionsService from "../../services/submissions";
import toast from "react-hot-toast";

// Hanya fitur yang didukung BE
export default function SubmissionActions({
  submission,
  submissions, // For bulk actions
  type = "single", // "single" | "bulk"
  onActionComplete,
}) {
  const [showExportCenter, setShowExportCenter] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Download submission (PDF/DOCX/ZIP) sesuai endpoint BE
  const handleQuickDownload = async (format = "pdf") => {
    try {
      setDownloading(true);

      if (type === "single" && submission) {
        // Hanya gunakan endpoint resmi BE
        await submissionsService.downloadSubmission(submission.id, format);
        toast.success(`File ${format.toUpperCase()} berhasil didownload`);
      } else if (type === "bulk" && submissions) {
        // Bulk download hanya jika endpoint BE tersedia
        if (submissionsService.downloadMultipleSubmissions) {
          const submissionIds = submissions.map((s) => s.id);
          await submissionsService.downloadMultipleSubmissions(
            submissionIds,
            "zip"
          );
          toast.success("Bulk download berhasil");
        } else {
          toast.error("Bulk download belum didukung di BE");
        }
      }

      onActionComplete?.();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mendownload file");
    } finally {
      setDownloading(false);
    }
  };

  // Share link (hanya copy/share URL, tidak ada endpoint khusus di BE)
  const handleShare = async () => {
    try {
      if (navigator.share && submission) {
        await navigator.share({
          title: `Submission: ${submission.assignment?.title}`,
          text: `Check out this submission by ${submission.student?.fullName}`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Gagal membagikan link");
    }
  };

  // Action items hanya fitur yang didukung BE
  const actionItems = [
    {
      icon: Download,
      label: "Download PDF",
      action: () => handleQuickDownload("pdf"),
    },
    {
      icon: Download,
      label: "Download DOCX",
      action: () => handleQuickDownload("docx"),
    },
    {
      icon: FileText,
      label: "Export Data",
      action: () => setShowExportCenter(true),
    },
    ...(type === "single"
      ? [
          {
            icon: Share2,
            label: "Share",
            action: handleShare,
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions */}
      <Button
        onClick={() => handleQuickDownload("pdf")}
        disabled={downloading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Downloading..." : "PDF"}
      </Button>

      {/* Advanced PDF Options */}
      <AdvancedPDFOptions
        submission={submission}
        submissions={submissions}
        type={type}
      />

      {/* More Actions Dropdown */}
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
        items={actionItems}
      />

      {/* Export Center Modal */}
      {showExportCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Export Center</h2>
              <Button
                variant="ghost"
                onClick={() => setShowExportCenter(false)}
              >
                ×
              </Button>
            </div>

            <ExportCenter
              submissions={submissions || [submission]}
              assignmentTitle={submission?.assignment?.title || "Submissions"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
