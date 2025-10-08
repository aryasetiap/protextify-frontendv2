import { useState, useEffect } from "react";
import { AlertTriangle, Eye, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from "../ui";
import { useCopyPasteMonitor } from "../../hooks/useCopyPasteMonitor";

const CopyPasteMonitor = ({
  editorRef,
  onSuspiciousActivity,
  showWarnings = true,
  enabled = true,
}) => {
  const {
    pasteEvents,
    suspiciousCount,
    isMonitoring,
    attachToEditor,
    getStats,
    clearData,
    toggleMonitoring,
  } = useCopyPasteMonitor({
    enabled,
    showWarnings,
    onSuspiciousActivity,
    maxPasteLength: 500,
    logToBackend: false, // Pastikan log ke BE dinonaktifkan
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Attach monitor to editor
  useEffect(() => {
    if (editorRef?.current && isMonitoring) {
      // Untuk TipTap: dapatkan DOM editor dari .view.dom
      let editorDom = null;
      if (editorRef.current.view && editorRef.current.view.dom) {
        editorDom = editorRef.current.view.dom;
      } else if (typeof editorRef.current.getEditor === "function") {
        // Jika RichTextEditor expose getEditor()
        const tiptapEditor = editorRef.current.getEditor();
        editorDom = tiptapEditor?.view?.dom;
      }

      if (editorDom) {
        return attachToEditor(editorDom);
      }
    }
  }, [editorRef, isMonitoring, attachToEditor]);

  const stats = getStats();

  const getRiskBadgeVariant = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getRiskLabel = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "Tinggi";
      case "medium":
        return "Sedang";
      case "low":
        return "Rendah";
      default:
        return "Normal";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-sm">Monitor Aktivitas</CardTitle>
            <Badge variant={isMonitoring ? "success" : "secondary"} size="sm">
              {isMonitoring ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getRiskBadgeVariant(stats.riskLevel)} size="sm">
              Risiko: {getRiskLabel(stats.riskLevel)}
            </Badge>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg">{stats.totalPastes}</div>
            <div className="text-gray-500">Total Paste</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-yellow-600">
              {stats.suspiciousPastes}
            </div>
            <div className="text-gray-500">Mencurigakan</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {stats.totalPastedChars}
            </div>
            <div className="text-gray-500">Karakter</div>
          </div>
        </div>

        {stats.riskLevel === "high" && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <strong>Aktivitas Mencurigakan Terdeteksi!</strong>
              <p className="mt-1 text-sm">
                Terdeteksi {stats.suspiciousPastes} aktivitas paste yang
                mencurigakan. Pastikan semua konten adalah karya asli Anda.
              </p>
            </div>
          </Alert>
        )}

        {isExpanded && pasteEvents.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Riwayat Aktivitas</h4>
              <button
                onClick={clearData}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Hapus
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {pasteEvents.slice(-5).map((event, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs ${
                    event.suspicious
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {event.textLength} karakter
                      {event.source !== "unknown" && ` dari ${event.source}`}
                    </span>
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                  {event.suspicious && (
                    <div className="text-yellow-600 mt-1">
                      ⚠️ Aktivitas mencurigakan
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <button
            onClick={() => toggleMonitoring(!isMonitoring)}
            className={`text-xs px-3 py-1 rounded ${
              isMonitoring
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isMonitoring ? "Matikan Monitor" : "Aktifkan Monitor"}
          </button>

          <span className="text-xs text-gray-500">
            Protextify Anti-Plagiarism
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopyPasteMonitor;
