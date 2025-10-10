import { Save, Send, Clock, AlertCircle } from "lucide-react";
import { Button, Badge } from "../ui";
import toast from "react-hot-toast";

const DraftActions = ({
  submission,
  canEdit,
  canSubmit,
  saving,
  submitting,
  onSave,
  onSubmit,
  validation,
}) => {
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

  const handleSubmitClick = () => {
    if (!validation.isValid) {
      toast.error("Harap perbaiki semua kesalahan sebelum mengumpulkan.");
      return;
    }
    onSubmit();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {getStatusBadge()}
        {submission?.updatedAt && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>
              Terakhir disimpan:{" "}
              {new Date(submission.updatedAt).toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {validation.errors.length > 0 && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">
              {validation.errors.length} kesalahan
            </span>
          </div>
        )}

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

        {canEdit && (
          <Button
            onClick={handleSubmitClick}
            disabled={!canSubmit || saving || submitting}
            loading={submitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Mengumpulkan..." : "Kumpulkan"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DraftActions;
