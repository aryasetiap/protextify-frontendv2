import { useState } from "react";
import { Save, Send, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { Button, Badge, Modal, Alert } from "../ui";

const DraftActions = ({
  submission,
  canEdit,
  canSubmit,
  saving,
  submitting,
  onSave,
  onSubmit,
  onRefresh,
  validation,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSubmitClick = () => {
    if (!validation.isValid) {
      return;
    }
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await onSubmit();
      setShowSubmitModal(false);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const getStatusBadge = () => {
    if (!submission) return null;

    const statusMap = {
      DRAFT: { label: "Draft", variant: "warning" },
      SUBMITTED: { label: "Dikumpulkan", variant: "info" },
      GRADED: { label: "Dinilai", variant: "success" },
    };

    const status = statusMap[submission.status] || statusMap.DRAFT;

    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Status */}
          {getStatusBadge()}

          {/* Last updated */}
          {submission?.updatedAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Terakhir disimpan:{" "}
                {new Date(submission.updatedAt).toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Validation errors */}
          {validation.errors.length > 0 && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                {validation.errors.length} kesalahan
              </span>
            </div>
          )}

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={saving || submitting}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Save button */}
          {canEdit && (
            <Button
              variant="outline"
              onClick={onSave}
              disabled={saving || submitting}
              loading={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          )}

          {/* Submit button */}
          {canEdit && (
            <Button
              onClick={handleSubmitClick}
              disabled={
                !canSubmit ||
                saving ||
                submitting ||
                validation.errors.length > 0
              }
              loading={submitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Mengumpulkan..." : "Kumpulkan"}
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Konfirmasi Pengumpulan"
      >
        <div className="space-y-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Perhatian!</strong>
              <p className="mt-1">
                Setelah dikumpulkan, Anda tidak dapat lagi mengedit jawaban.
                Pastikan jawaban sudah sesuai sebelum mengumpulkan.
              </p>
            </div>
          </Alert>

          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Peringatan:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmSubmit} loading={submitting}>
              Ya, Kumpulkan
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DraftActions;
