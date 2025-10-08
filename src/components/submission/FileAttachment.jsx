// src/components/submission/FileAttachment.jsx
import { useState } from "react";
import { FileText, Download, Upload, Trash2, Eye } from "lucide-react";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import { FileUpload } from "../upload";
import { storageService } from "../../services"; // gunakan storageService, bukan uploadService
import toast from "react-hot-toast";

// Hanya field dan fitur yang didukung BE
export default function FileAttachment({
  submission,
  onFileUploaded,
  onFileDeleted,
  readOnly = false,
}) {
  // BE hanya mengembalikan: id, filename, size, mimeType, cloudKey, uploadedAt
  const [attachedFiles, setAttachedFiles] = useState(
    submission?.attachments || []
  );
  const [showUpload, setShowUpload] = useState(false);

  // Upload file (hanya tipe yang didukung BE)
  const handleFileUpload = async (uploadedFiles) => {
    try {
      // Mapping sesuai response BE
      const newAttachments = uploadedFiles.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName || file.filename,
        size: file.size,
        mimeType: file.mimeType,
        cloudKey: file.cloudKey,
        uploadedAt: file.uploadedAt || new Date().toISOString(),
      }));

      setAttachedFiles((prev) => [...prev, ...newAttachments]);
      setShowUpload(false);

      onFileUploaded?.(newAttachments);
      toast.success(`${uploadedFiles.length} file berhasil diupload`);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Gagal mengupload file");
    }
  };

  // Download file (gunakan pre-signed URL dari BE)
  const handleFileDownload = async (file) => {
    try {
      // Mendapatkan pre-signed URL dari storageService
      const presigned = await storageService.getPresignedUrl(
        file.cloudKey,
        file.filename
      );
      window.open(presigned.url, "_blank");
      toast.success("File berhasil didownload");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mendownload file");
    }
  };

  // Delete file (hanya jika endpoint BE tersedia)
  const handleFileDelete = async (fileId) => {
    try {
      await storageService.deleteFile(fileId);
      setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
      onFileDeleted?.(fileId);
      toast.success("File berhasil dihapus");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus file");
    }
  };

  // Preview file (hanya PDF/JPG/PNG, gunakan pre-signed URL dari BE)
  const handleFilePreview = async (file) => {
    try {
      if (
        file.mimeType === "application/pdf" ||
        file.mimeType === "image/jpeg" ||
        file.mimeType === "image/png"
      ) {
        const presigned = await storageService.getPresignedUrl(
          file.cloudKey,
          file.filename
        );
        window.open(presigned.url, "_blank");
      } else {
        toast.info("Preview tidak tersedia untuk tipe file ini");
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Gagal membuka preview");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // File icon sesuai tipe
  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return "🔴";
    if (mimeType?.includes("doc")) return "🔵";
    if (mimeType?.includes("image")) return "🟢";
    if (mimeType?.includes("zip")) return "🟣";
    return "📄";
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {!readOnly && (
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">File Lampiran</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {showUpload ? "Tutup Upload" : "Upload File"}
          </Button>
        </div>
      )}

      {/* Upload Component */}
      {showUpload && !readOnly && (
        <Card className="p-4">
          <FileUpload
            uploadType="submission"
            acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png", ".zip"]}
            maxSize={20 * 1024 * 1024} // 20MB (ZIP)
            multiple={true}
            fileSizeLimits={{
              pdf: 10 * 1024 * 1024,
              doc: 10 * 1024 * 1024,
              docx: 10 * 1024 * 1024,
              jpg: 5 * 1024 * 1024,
              png: 5 * 1024 * 1024,
              zip: 20 * 1024 * 1024,
            }}
            onUploadComplete={handleFileUpload}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              toast.error("Gagal mengupload file");
            }}
          />
        </Card>
      )}

      {/* Attached Files List */}
      {attachedFiles.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">
              File Terlampir ({attachedFiles.length})
            </h5>

            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {file.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • Uploaded{" "}
                      {new Date(file.uploadedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preview Button */}
                  {(file.mimeType === "application/pdf" ||
                    file.mimeType === "image/jpeg" ||
                    file.mimeType === "image/png") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilePreview(file)}
                      title="Preview file"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Download Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileDownload(file)}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileDelete(file.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Hapus file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {attachedFiles.length === 0 && !showUpload && (
        <Card className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {readOnly ? "Tidak ada file terlampir" : "Belum ada file terlampir"}
          </p>
        </Card>
      )}
    </div>
  );
}
