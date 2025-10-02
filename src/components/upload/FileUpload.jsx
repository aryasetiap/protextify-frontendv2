// src/components/upload/FileUpload.jsx
import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import Button from "../ui/Button"; // ✅ Change from named import to default import
import { Card } from "../ui/Card";
import { Alert } from "../ui/Alert";
import uploadService from "../../services/upload";
import toast from "react-hot-toast";

export default function FileUpload({
  uploadType = "submission",
  acceptedTypes = [".pdf", ".doc", ".docx"],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  onUploadComplete,
  onUploadError,
  className = "",
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndAddFiles = useCallback(
    (fileList) => {
      const newFiles = Array.from(fileList).map((file) => {
        const validation = uploadService.validateFileAdvanced(file, {
          maxSize,
          allowedExtensions: acceptedTypes.map((type) => type.replace(".", "")),
          checkMimeType: true,
        });

        return {
          file,
          id: Date.now() + Math.random(),
          validation,
          status: validation.isValid ? "ready" : "invalid",
          progress: 0,
        };
      });

      if (multiple) {
        setFiles((prev) => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles.slice(0, 1));
      }

      // Show validation errors
      newFiles.forEach(({ file, validation }) => {
        if (!validation.isValid) {
          validation.errors.forEach((error) => {
            toast.error(`${file.name}: ${error}`);
          });
        }
      });
    },
    [maxSize, acceptedTypes, multiple]
  );

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length > 0) {
      validateAndAddFiles(selectedFiles);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles?.length > 0) {
        validateAndAddFiles(droppedFiles);
      }
    },
    [validateAndAddFiles]
  );

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const uploadFiles = async () => {
    const validFiles = files.filter(
      (f) => f.validation.isValid && f.status === "ready"
    );

    if (validFiles.length === 0) {
      toast.error("Tidak ada file valid untuk diupload");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = validFiles.map(async (fileItem) => {
        try {
          // Update file status
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id ? { ...f, status: "uploading" } : f
            )
          );

          const result = await uploadService.uploadFileWithProgress(
            fileItem.file,
            uploadType,
            {
              onProgress: (percent, loaded, total) => {
                setUploadProgress((prev) => ({
                  ...prev,
                  [fileItem.id]: { percent, loaded, total },
                }));

                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileItem.id ? { ...f, progress: percent } : f
                  )
                );
              },
            }
          );

          // Update file status to completed
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id ? { ...f, status: "completed", result } : f
            )
          );

          return { success: true, fileItem, result };
        } catch (error) {
          // Update file status to error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, status: "error", error: error.message }
                : f
            )
          );

          return { success: false, fileItem, error };
        }
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        toast.success(`${successful.length} file berhasil diupload`);
        onUploadComplete?.(successful.map((r) => r.result));
      }

      if (failed.length > 0) {
        toast.error(`${failed.length} file gagal diupload`);
        onUploadError?.(failed.map((r) => r.error));
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
      onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  const retryUpload = (fileId) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, status: "ready", progress: 0, error: null }
          : f
      )
    );
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ready":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "uploading":
        return (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        );
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "invalid":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              Upload file atau drag & drop di sini
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {acceptedTypes.join(", ")} hingga {formatFileSize(maxSize)}
            </p>
          </div>
          <Button type="button" className="mt-4">
            Pilih File
          </Button>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                File yang akan diupload ({files.length})
              </h4>
              {files.some(
                (f) => f.validation.isValid && f.status === "ready"
              ) && (
                <Button onClick={uploadFiles} disabled={uploading} size="sm">
                  {uploading ? "Uploading..." : "Upload All"}
                </Button>
              )}
            </div>

            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(fileItem.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileItem.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileItem.status === "uploading" && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fileItem.progress}% •{" "}
                        {uploadProgress[fileItem.id]?.loaded
                          ? formatFileSize(uploadProgress[fileItem.id].loaded)
                          : "0 Bytes"}{" "}
                        / {formatFileSize(fileItem.file.size)}
                      </p>
                    </div>
                  )}

                  {/* Validation Errors */}
                  {!fileItem.validation.isValid && (
                    <div className="mt-1">
                      {fileItem.validation.errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Upload Error */}
                  {fileItem.status === "error" && (
                    <p className="text-xs text-red-600 mt-1">
                      {fileItem.error}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {fileItem.status === "error" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryUpload(fileItem.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileItem.id)}
                    disabled={fileItem.status === "uploading"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
