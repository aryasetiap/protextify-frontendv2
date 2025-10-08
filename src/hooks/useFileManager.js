// src/hooks/useFileManager.js
import { useState, useCallback } from "react";
import { storageService, submissionsService } from "../services";
import toast from "react-hot-toast";

export const useFileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Upload file (assignment/submission)
  const uploadFile = useCallback(async (file, options = {}) => {
    setUploading(true);
    try {
      const result = await storageService.uploadFile(file, options);
      toast.success("File berhasil di-upload");
      return result;
    } catch (error) {
      const formattedError = {
        statusCode:
          error?.response?.data?.statusCode || error?.statusCode || 400,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Gagal upload file",
      };
      toast.error(formattedError.message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  // Download single submission (PDF/DOCX)
  const downloadSubmission = useCallback(
    async (submissionId, format = "pdf") => {
      setDownloading(true);
      try {
        const result = await submissionsService.downloadSubmission(
          submissionId,
          format
        );
        toast.success(`${format.toUpperCase()} berhasil diunduh`);
        return result;
      } catch (error) {
        const formattedError = {
          statusCode:
            error?.response?.data?.statusCode || error?.statusCode || 400,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Gagal download file",
        };
        toast.error(formattedError.message);
        throw error;
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  // Download multiple submissions (ZIP)
  const downloadMultiple = useCallback(
    async (submissionIds, format = "zip") => {
      setDownloading(true);
      try {
        if (!submissionsService.downloadMultipleSubmissions) {
          throw new Error("Bulk download belum didukung di BE");
        }
        const result = await submissionsService.downloadMultipleSubmissions(
          submissionIds,
          format
        );
        toast.success("Bulk download selesai");
        return result;
      } catch (error) {
        const formattedError = {
          statusCode:
            error?.response?.data?.statusCode || error?.statusCode || 400,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Gagal bulk download",
        };
        toast.error(formattedError.message);
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
