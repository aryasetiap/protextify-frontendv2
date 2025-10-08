// src/components/forms/ExportModal.jsx
import { useState } from "react";
import {
  Download,
  FileText,
  Table,
  Code,
  BarChart3,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

import { Modal, Button, Card, CardContent } from "../ui";
import { Switch } from "../ui/Switch";
import Input from "../ui/Input";
import {
  exportSubmissionsToCSV,
  exportSubmissionsToExcel,
  exportSubmissionsToCSVAdvanced,
  exportSubmissionsToJSON,
  exportSubmissionsToXML,
  exportSubmissionsToExcelAdvanced,
  calculateSubmissionStatistics,
} from "../../utils/exportUtils";

export default function ExportModal({
  isOpen,
  onClose,
  submissions,
  assignmentTitle,
}) {
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [options, setOptions] = useState({
    includeContent: false,
    includeTimestamps: true,
    includePlagiarismDetails: true,
    includeGrades: true,
    includeStatistics: true,
    separateSheetsByStatus: false,
    prettifyJSON: true,
    includeCharts: false,
    customFilename: "",
  });

  const exportFormats = [
    {
      id: "csv",
      name: "CSV",
      description: "Comma-separated values - Kompatibel dengan Excel",
      icon: Table,
      color: "text-green-600",
    },
    {
      id: "excel",
      name: "Excel",
      description: "Microsoft Excel format dengan multiple sheets",
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      id: "json",
      name: "JSON",
      description: "JavaScript Object Notation - Struktur data ringan",
      icon: Code,
      color: "text-yellow-600",
    },
    {
      id: "xml",
      name: "XML",
      description: "eXtensible Markup Language - Data terstruktur",
      icon: Code,
      color: "text-red-600",
    },
  ];

  const handleExport = async () => {
    try {
      setExporting(true);
      let fileName = options.customFilename
        ? options.customFilename
        : `${assignmentTitle}_${new Date().toISOString()}`;

      // Hanya field yang tersedia di BE
      switch (selectedFormat) {
        case "csv":
          if (options.includeStatistics) {
            const statistics = calculateSubmissionStatistics(submissions);
            exportSubmissionsToCSVAdvanced(submissions, statistics, fileName, {
              includeContent: options.includeContent,
              includeTimestamps: options.includeTimestamps,
              includePlagiarismDetails: options.includePlagiarismDetails,
              includeGrades: options.includeGrades,
            });
          } else {
            exportSubmissionsToCSV(submissions, fileName, {
              includeContent: options.includeContent,
              includeTimestamps: options.includeTimestamps,
              includePlagiarismDetails: options.includePlagiarismDetails,
              includeGrades: options.includeGrades,
            });
          }
          break;
        case "excel":
          if (options.includeStatistics) {
            const statistics = calculateSubmissionStatistics(submissions);
            await exportSubmissionsToExcelAdvanced(
              submissions,
              statistics,
              fileName,
              {
                includeContent: options.includeContent,
                includeTimestamps: options.includeTimestamps,
                includePlagiarismDetails: options.includePlagiarismDetails,
                includeGrades: options.includeGrades,
                separateSheetsByStatus: options.separateSheetsByStatus,
              }
            );
          } else {
            await exportSubmissionsToExcel(submissions, fileName, {
              includeContent: options.includeContent,
              includeTimestamps: options.includeTimestamps,
              includePlagiarismDetails: options.includePlagiarismDetails,
              includeGrades: options.includeGrades,
              separateSheetsByStatus: options.separateSheetsByStatus,
            });
          }
          break;
        case "json":
          exportSubmissionsToJSON(submissions, fileName, {
            prettify: options.prettifyJSON,
            includeContent: options.includeContent,
            includeTimestamps: options.includeTimestamps,
            includePlagiarismDetails: options.includePlagiarismDetails,
            includeGrades: options.includeGrades,
          });
          break;
        case "xml":
          exportSubmissionsToXML(submissions, fileName, {
            includeContent: options.includeContent,
            includeTimestamps: options.includeTimestamps,
            includePlagiarismDetails: options.includePlagiarismDetails,
            includeGrades: options.includeGrades,
          });
          break;
        default:
          throw new Error("Format tidak dikenal");
      }

      toast.success(`Ekspor ${selectedFormat.toUpperCase()} berhasil`);
      onClose();
    } catch (error) {
      console.error(`Export ${selectedFormat} error:`, error);
      toast.error(`Gagal ekspor ${selectedFormat}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ekspor Submissions">
      <div className="space-y-4">
        <p className="text-gray-600">
          Ekspor {submissions.length} submission ke format yang diinginkan
        </p>

        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <Card
              key={format.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFormat === format.id
                  ? "ring-2 ring-[#23407a] border-[#23407a]"
                  : "hover:border-gray-400"
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <CardContent className="p-6 text-center">
                <format.icon
                  className={`h-12 w-12 ${format.color} mx-auto mb-4`}
                />
                <h3 className="font-medium text-gray-900 mb-2">
                  {format.name}
                </h3>
                <p className="text-sm text-gray-500">{format.description}</p>
                {selectedFormat === format.id && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#23407a] text-white">
                      Dipilih
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {showAdvancedOptions ? "Sembunyikan" : "Tampilkan"} Opsi Lanjutan
          </Button>
        </div>

        {/* Advanced Options */}
        {showAdvancedOptions && (
          <Card className="p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Opsi Lanjutan
            </h4>

            <div className="space-y-4">
              {/* Custom Filename */}
              <div>
                <Input
                  label="Nama File Kustom"
                  placeholder="Masukkan nama file (tanpa ekstensi)"
                  value={options.customFilename}
                  onChange={(e) =>
                    setOptions({ ...options, customFilename: e.target.value })
                  }
                  helperText="Kosongkan untuk menggunakan nama default"
                />
              </div>

              {/* Export Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Sertakan Konten Lengkap
                  </label>
                  <Switch
                    checked={options.includeContent}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeContent: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Sertakan Timestamp
                  </label>
                  <Switch
                    checked={options.includeTimestamps}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeTimestamps: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Detail Plagiarisme
                  </label>
                  <Switch
                    checked={options.includePlagiarismDetails}
                    onCheckedChange={(checked) =>
                      setOptions({
                        ...options,
                        includePlagiarismDetails: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Sertakan Nilai
                  </label>
                  <Switch
                    checked={options.includeGrades}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeGrades: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Sertakan Statistik
                  </label>
                  <Switch
                    checked={options.includeStatistics}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeStatistics: checked })
                    }
                  />
                </div>

                {selectedFormat === "json" && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Format JSON Rapi
                    </label>
                    <Switch
                      checked={options.prettifyJSON}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, prettifyJSON: checked })
                      }
                    />
                  </div>
                )}

                {selectedFormat === "excel" && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Pisah Sheet by Status
                    </label>
                    <Switch
                      checked={options.separateSheetsByStatus}
                      onCheckedChange={(checked) =>
                        setOptions({
                          ...options,
                          separateSheetsByStatus: checked,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={exporting}>
            Batal
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mengekspor...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Ekspor {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
