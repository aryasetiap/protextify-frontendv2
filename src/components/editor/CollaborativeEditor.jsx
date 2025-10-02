// src/components/editor/CollaborativeEditor.jsx
import { useState } from "react";
import { Save, Users, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useContentSync } from "../../hooks/useContentSync";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Alert } from "../ui/Alert";

export default function CollaborativeEditor({
  submissionId,
  initialContent = "",
  onContentChange,
  readOnly = false,
}) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const { isSocketConnected } = useWebSocket();

  const {
    content,
    updateContent,
    lastSaved,
    isSaving,
    saveError,
    hasUnsavedChanges,
    collaborators,
    conflicts,
    forceSave,
    resolveConflict,
    discardChanges,
    canEdit,
    saveStatus,
  } = useContentSync(submissionId, initialContent, {
    autoSaveDelay: 2000,
    conflictResolution: "client",
    enableCollaboration: true,
  });

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setCursorPosition(e.target.selectionStart);
    updateContent(newContent);
    onContentChange?.(newContent);
  };

  const handleForceSave = async () => {
    try {
      await forceSave();
    } catch (error) {
      console.error("Force save failed:", error);
    }
  };

  const getStatusIndicator = () => {
    if (!isSocketConnected()) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Offline</span>
        </div>
      );
    }

    switch (saveStatus) {
      case "saving":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-sm">Menyimpan...</span>
          </div>
        );
      case "unsaved":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <div className="h-2 w-2 bg-yellow-600 rounded-full" />
            <span className="text-sm">Belum disimpan</span>
          </div>
        );
      case "saved":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Wifi className="h-4 w-4" />
            <span className="text-sm">
              Tersimpan{" "}
              {lastSaved &&
                `(${new Date(lastSaved).toLocaleTimeString("id-ID")})`}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with status and collaborators */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          {getStatusIndicator()}

          {collaborators.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {collaborators.length} sedang mengedit
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={discardChanges}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleForceSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Sekarang
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error alert */}
      {saveError && (
        <Alert variant="error">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <strong>Gagal menyimpan:</strong> {saveError}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleForceSave}
              className="ml-2"
            >
              Coba lagi
            </Button>
          </div>
        </Alert>
      )}

      {/* Conflicts alert */}
      {conflicts
        .filter((c) => !c.resolved)
        .map((conflict) => (
          <Alert key={conflict.id} variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <strong>Konflik terdeteksi:</strong> Ada perubahan dari pengguna
              lain.
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    updateContent(conflict.remoteContent);
                    resolveConflict(conflict.id, "remote");
                  }}
                >
                  Gunakan versi server
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resolveConflict(conflict.id, "local")}
                >
                  Tetap gunakan versi saya
                </Button>
              </div>
            </div>
          </Alert>
        ))}

      {/* Editor */}
      <Card className="p-0">
        <textarea
          value={content}
          onChange={handleContentChange}
          disabled={readOnly || !canEdit}
          placeholder="Mulai menulis tugas Anda di sini..."
          className={`w-full h-96 p-4 border-0 resize-none focus:outline-none focus:ring-0 ${
            readOnly || !canEdit ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        />
      </Card>

      {/* Footer info */}
      <div className="flex justify-between text-sm text-gray-500">
        <div>
          {content.split(/\s+/).filter((word) => word.length > 0).length} kata •{" "}
          {content.length} karakter
        </div>

        {!isSocketConnected() && (
          <div className="text-red-600">
            Koneksi terputus - perubahan akan disimpan setelah koneksi pulih
          </div>
        )}
      </div>
    </div>
  );
}
