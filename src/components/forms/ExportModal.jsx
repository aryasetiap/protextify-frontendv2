// src/components/forms/ExportModal.jsx
import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import toast from "react-hot-toast";

import { Modal, Button, Card, CardContent } from "../ui";
import {
  exportSubmissionsToCSV,
  exportSubmissionsToExcel,
} from "../../utils/exportUtils";

export default function ExportModal({
  isOpen,
  onClose,
  submissions,
  assignmentTitle,
}) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      exportSubmissionsToCSV(submissions, assignmentTitle);
      toast.success("Export CSV berhasil");
      onClose();
    } catch (error) {
      console.error("Export CSV error:", error);
      toast.error("Gagal export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      await exportSubmissionsToExcel(submissions, assignmentTitle);
      toast.success("Export Excel berhasil");
      onClose();
    } catch (error) {
      console.error("Export Excel error:", error);
      toast.error("Gagal export Excel");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Submissions">
      <div className="space-y-4">
        <p className="text-gray-600">
          Export {submissions.length} submission ke format yang diinginkan
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleExportCSV}
          >
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Export CSV</h3>
              <p className="text-sm text-gray-500">
                Format CSV untuk spreadsheet sederhana
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleExportExcel}
          >
            <CardContent className="p-6 text-center">
              <Table className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Export Excel</h3>
              <p className="text-sm text-gray-500">
                Format Excel dengan formatting yang lebih baik
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
