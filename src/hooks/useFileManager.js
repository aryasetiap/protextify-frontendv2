// src/hooks/useFileManager.js
import { useState, useCallback } from "react";
import { uploadService, submissionsService } from "../services";
import toast from "react-hot-toast";

export const useFileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const uploadFile = useCallback(async (file, uploadType, options = {}) => {
    setUploading(true);
    try {
      const result = await uploadService.uploadFileWithProgress(
        file,
        uploadType,
        {
          ...options,
          onProgress: (percent) => {
            // Handle progress updates
            console.log(`Upload progress: ${percent}%`);
          },
        }
      );
      toast.success("File uploaded successfully");
      return result;
    } catch (error) {
      toast.error("Upload failed: " + error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const downloadSubmission = useCallback(
    async (submissionId, format = "pdf") => {
      setDownloading(true);
      try {
        const result = await submissionsService.downloadSubmission(
          submissionId,
          format
        );
        toast.success(`${format.toUpperCase()} downloaded successfully`);
        return result;
      } catch (error) {
        toast.error("Download failed: " + error.message);
        throw error;
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  const downloadMultiple = useCallback(
    async (submissionIds, format = "zip") => {
      setDownloading(true);
      try {
        const result = await submissionsService.downloadMultipleSubmissions(
          submissionIds,
          format
        );
        toast.success("Bulk download completed");
        return result;
      } catch (error) {
        toast.error("Bulk download failed: " + error.message);
        throw error;
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  return {
    uploading,
    downloading,
    uploadFile,
    downloadSubmission,
    downloadMultiple,
  };
};

export default useFileManager;
