// src/components/pdf/AdvancedPDFOptions.jsx
import { useState } from "react";
import { Settings, Download, FileText, Image, Palette } from "lucide-react";
import Button from "../ui/Button"; // ✅ Change from named import to default import
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { Switch } from "../ui/Switch";
import Input from "../ui/Input"; // ✅ Change to default import
import Select from "../ui/Select"; // ✅ Change to default import
import pdfGenerator from "../../utils/pdfGenerator";
import toast from "react-hot-toast";

export default function AdvancedPDFOptions({
  submission,
  submissions,
  type = "single",
  className = "",
}) {
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState({
    // Basic Options
    includeHeader: true,
    includeFooter: true,
    includeMetadata: true,
    includeCoverPage: false,

    // Content Options
    includeAttachments: true,
    includeComments: false,
    includePlagiarismReport: false,
    includeGradingRubric: false,

    // Format Options
    pageFormat: "a4",
    orientation: "portrait",
    margins: "normal", // "narrow", "normal", "wide"
    fontSize: "12",
    lineSpacing: "1.5",

    // Style Options
    watermark: "",
    headerText: "",
    footerText: "",
    colorScheme: "default", // "default", "grayscale", "blue"

    // Advanced Options
    quality: "high", // "draft", "normal", "high"
    compression: "medium", // "none", "low", "medium", "high"
    passwordProtect: false,
    password: "",

    // Bulk Options (for multiple submissions)
    separateFiles: false,
    includeIndex: true,
    groupByStatus: false,
  });

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const generatePDF = async () => {
    if (!submission && !submissions) {
      toast.error("Tidak ada data untuk generate PDF");
      return;
    }

    setGenerating(true);

    try {
      let result;

      if (type === "single" && submission) {
        result = await pdfGenerator.generateSubmissionPDF(submission, {
          ...options,
          // Convert string values to appropriate types
          fontSize: parseInt(options.fontSize),
          lineSpacing: parseFloat(options.lineSpacing),
        });

        const filename = `${submission.student?.fullName || "submission"}_${
          submission.assignment?.title || "assignment"
        }.pdf`;

        pdfGenerator.downloadPDF(result, filename);
      } else if (type === "bulk" && submissions) {
        result = await pdfGenerator.generateBulkSubmissionPDF(
          submissions,
          submissions[0]?.assignment?.title || "Bulk Submissions",
          {
            ...options,
            separatePages: !options.separateFiles,
            includeTableOfContents: options.includeIndex,
          }
        );

        const filename = `bulk_submissions_${
          submissions[0]?.assignment?.title || "assignment"
        }.pdf`;

        pdfGenerator.downloadPDF(result, filename);
      }

      toast.success("PDF berhasil dihasilkan dan didownload");
      setShowModal(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Gagal menghasilkan PDF: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const previewPDF = async () => {
    if (!submission) {
      toast.error("Preview hanya tersedia untuk submission tunggal");
      return;
    }

    setGenerating(true);

    try {
      const pdf = await pdfGenerator.generateSubmissionPDF(submission, {
        ...options,
        includeMetadata: false, // Faster for preview
      });

      const blob = pdfGenerator.getPDFBlob(pdf);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Preview PDF dibuka di tab baru");
    } catch (error) {
      console.error("PDF preview error:", error);
      toast.error("Gagal membuat preview PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {generating ? "Generating..." : "Download PDF"}
        </Button>

        {type === "single" && (
          <Button
            variant="ghost"
            onClick={previewPDF}
            disabled={generating}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Preview
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Options
        </Button>
      </div>

      {/* Advanced Options Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="PDF Generation Options"
        size="lg"
      >
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Basic Options
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Include Header</label>
                <Switch
                  checked={options.includeHeader}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeHeader", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Include Footer</label>
                <Switch
                  checked={options.includeFooter}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeFooter", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Cover Page</label>
                <Switch
                  checked={options.includeCoverPage}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeCoverPage", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Metadata</label>
                <Switch
                  checked={options.includeMetadata}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeMetadata", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Content Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Content Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Attachments</label>
                <Switch
                  checked={options.includeAttachments}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeAttachments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Comments</label>
                <Switch
                  checked={options.includeComments}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeComments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Plagiarism Report</label>
                <Switch
                  checked={options.includePlagiarismReport}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includePlagiarismReport", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Grading Rubric</label>
                <Switch
                  checked={options.includeGradingRubric}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeGradingRubric", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Format Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Format Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Page Size
                </label>
                <select
                  value={options.pageFormat}
                  onChange={(e) =>
                    handleOptionChange("pageFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="a4">A4</option>
                  <option value="a3">A3</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Orientation
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) =>
                    handleOptionChange("orientation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Font Size
                </label>
                <select
                  value={options.fontSize}
                  onChange={(e) =>
                    handleOptionChange("fontSize", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="10">10pt</option>
                  <option value="11">11pt</option>
                  <option value="12">12pt</option>
                  <option value="14">14pt</option>
                  <option value="16">16pt</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Line Spacing
                </label>
                <select
                  value={options.lineSpacing}
                  onChange={(e) =>
                    handleOptionChange("lineSpacing", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="1">Single</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="2">Double</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Style Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style Options
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Watermark Text
                </label>
                <Input
                  value={options.watermark}
                  onChange={(e) =>
                    handleOptionChange("watermark", e.target.value)
                  }
                  placeholder="Enter watermark text (optional)"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Header Text
                </label>
                <Input
                  value={options.headerText}
                  onChange={(e) =>
                    handleOptionChange("headerText", e.target.value)
                  }
                  placeholder="Custom header text (optional)"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Color Scheme
                </label>
                <select
                  value={options.colorScheme}
                  onChange={(e) =>
                    handleOptionChange("colorScheme", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="grayscale">Grayscale</option>
                  <option value="blue">Blue Theme</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Bulk Options */}
          {type === "bulk" && (
            <Card className="p-4">
              <h4 className="font-medium mb-4">Bulk Options</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Separate Files</label>
                  <Switch
                    checked={options.separateFiles}
                    onCheckedChange={(checked) =>
                      handleOptionChange("separateFiles", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Include Index</label>
                  <Switch
                    checked={options.includeIndex}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeIndex", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Group by Status</label>
                  <Switch
                    checked={options.groupByStatus}
                    onCheckedChange={(checked) =>
                      handleOptionChange("groupByStatus", checked)
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Security Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Security Options</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Password Protection
                </label>
                <Switch
                  checked={options.passwordProtect}
                  onCheckedChange={(checked) =>
                    handleOptionChange("passwordProtect", checked)
                  }
                />
              </div>

              {options.passwordProtect && (
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={options.password}
                    onChange={(e) =>
                      handleOptionChange("password", e.target.value)
                    }
                    placeholder="Enter PDF password"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {type === "single" && (
            <Button
              variant="outline"
              onClick={previewPDF}
              disabled={generating}
            >
              Preview
            </Button>
          )}
          <Button onClick={generatePDF} disabled={generating}>
            {generating ? "Generating..." : "Generate PDF"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
