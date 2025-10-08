// src/hooks/useFileUpload.js
import { useState, useCallback } from "react";
import { storageService } from "../services";
import { toast } from "react-hot-toast";

const FILE_TYPE_MAP = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  zip: "application/zip",
};

const getFileType = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();
  return FILE_TYPE_MAP[ext] || file.type;
};

const getMaxSize = (type) => {
  switch (type) {
    case "application/pdf":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return 10 * 1024 * 1024; // 10MB
    case "image/jpeg":
    case "image/png":
      return 5 * 1024 * 1024; // 5MB
    case "application/zip":
      return 20 * 1024 * 1024; // 20MB
    default:
      return 10 * 1024 * 1024;
  }
};

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, options = {}) => {
    const {
      assignmentId,
      submissionId,
      description,
      allowedTypes = [],
      onSuccess = null,
      onError = null,
    } = options;

    setUploading(true);
    setProgress(0);
    setError(null);

    // Validasi file
    const fileType = getFileType(file);
    const maxSize = getMaxSize(fileType);

    if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
      const msg = "Tipe file tidak didukung";
      setError({ statusCode: 400, message: msg });
      toast.error(msg);
      if (onError) onError({ statusCode: 400, message: msg });
      setUploading(false);
      return;
    }

    if (file.size > maxSize) {
      const msg = `Ukuran file melebihi batas maksimal (${Math.round(
        maxSize / 1024 / 1024
      )}MB)`;
      setError({ statusCode: 400, message: msg });
      toast.error(msg);
      if (onError) onError({ statusCode: 400, message: msg });
      setUploading(false);
      return;
    }

    try {
      // Progress upload (opsional, jika BE support)
      // const onUploadProgress = (event) => {
      //   if (event.total) {
      //     setProgress(Math.round((event.loaded / event.total) * 100));
      //   }
      // };

      const uploadOptions = {};
      if (assignmentId) uploadOptions.assignmentId = assignmentId;
      if (submissionId) uploadOptions.submissionId = submissionId;
      if (description) uploadOptions.description = description;

      // const result = await storageService.uploadFile(file, uploadOptions, onUploadProgress);
      const result = await storageService.uploadFile(file, uploadOptions);

      setProgress(100);
      toast.success("File berhasil di-upload");

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal mengupload file",
      };
      setError(formattedError);

      if (onError) {
        onError(formattedError);
      } else {
        toast.error(formattedError.message);
      }

      throw formattedError;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    reset,
  };
};

export default useFileUpload;
