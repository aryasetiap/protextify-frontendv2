// src/hooks/useFileUpload.js
import { useState, useCallback } from "react";
import { uploadService } from "../services";
import { toast } from "react-hot-toast";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, type, entityId, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
      onSuccess = null,
      onError = null,
    } = options;

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Validate file
      const validation = uploadService.validateFile(
        file,
        maxSize,
        allowedTypes
      );
      if (!validation.isValid) {
        validation.errors.forEach((err) => toast.error(err));
        throw new Error(validation.errors.join(", "));
      }

      let response;
      const onProgress = (percent) => setProgress(percent);

      // Upload based on type
      switch (type) {
        case "submission":
          response = await uploadService.uploadSubmissionFile(
            file,
            entityId,
            onProgress
          );
          break;
        case "profile":
          response = await uploadService.uploadProfilePicture(file, onProgress);
          break;
        case "assignment":
          response = await uploadService.uploadAssignmentDocument(
            file,
            entityId,
            onProgress
          );
          break;
        default:
          throw new Error("Invalid upload type");
      }

      setProgress(100);
      toast.success("File berhasil diupload");

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      } else {
        toast.error(err.message || "Gagal mengupload file");
      }

      throw err;
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
