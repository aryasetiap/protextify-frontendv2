// src/services/upload.js
import api from "./api";

const uploadService = {
  // Upload file untuk submission
  uploadSubmissionFile: async (file, submissionId, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("submissionId", submissionId);

      const response = await api.post("/storage/upload/submission", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await api.post("/storage/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload file dokumen assignment
  uploadAssignmentDocument: async (file, assignmentId, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("assignmentId", assignmentId);

      const response = await api.post("/storage/upload/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get file info dengan pre-signed URL
  getFileInfo: async (fileId) => {
    try {
      const response = await api.get(`/storage/files/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Refresh pre-signed URL
  refreshFileUrl: async (cloudKey, filename, expires = 3600) => {
    try {
      const response = await api.get(`/storage/refresh-url/${cloudKey}`, {
        params: { filename, expires },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Download file dengan pre-signed URL
  downloadFile: async (fileId, filename) => {
    try {
      const response = await api.get(`/storage/download/${fileId}`, {
        params: { filename },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/storage/files/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validate file before upload
  validateFile: (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
    const errors = [];

    // Check file size (default 10MB)
    if (file.size > maxSize) {
      errors.push(`File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(
        `Tipe file tidak didukung. Hanya: ${allowedTypes.join(", ")}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Enhanced file upload with chunking support
  uploadFileWithProgress: async (file, uploadType, options = {}) => {
    const {
      onProgress = null,
      onChunkComplete = null,
      chunkSize = 1024 * 1024, // 1MB chunks
      maxRetries = 3,
    } = options;

    try {
      // For large files, use chunked upload
      if (file.size > chunkSize * 5) {
        return await uploadService.uploadFileChunked(file, uploadType, {
          onProgress,
          onChunkComplete,
          chunkSize,
          maxRetries,
        });
      }

      // Regular upload for smaller files
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", uploadType);

      const response = await api.post("/storage/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(
              percentCompleted,
              progressEvent.loaded,
              progressEvent.total
            );
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Chunked upload for large files
  uploadFileChunked: async (file, uploadType, options = {}) => {
    const {
      onProgress = null,
      onChunkComplete = null,
      chunkSize = 1024 * 1024,
      maxRetries = 3,
    } = options;

    try {
      const totalChunks = Math.ceil(file.size / chunkSize);
      const uploadId = Date.now() + Math.random().toString(36);
      let uploadedBytes = 0;

      // Initialize chunked upload
      const initResponse = await api.post("/storage/upload/init", {
        fileName: file.name,
        fileSize: file.size,
        totalChunks,
        uploadId,
        uploadType,
      });

      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        let retryCount = 0;
        let chunkUploaded = false;

        while (!chunkUploaded && retryCount < maxRetries) {
          try {
            const chunkFormData = new FormData();
            chunkFormData.append("chunk", chunk);
            chunkFormData.append("chunkIndex", chunkIndex);
            chunkFormData.append("uploadId", uploadId);

            await api.post("/storage/upload/chunk", chunkFormData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            uploadedBytes += chunk.size;
            chunkUploaded = true;

            if (onChunkComplete) {
              onChunkComplete(chunkIndex + 1, totalChunks);
            }

            if (onProgress) {
              const percentage = Math.round((uploadedBytes * 100) / file.size);
              onProgress(percentage, uploadedBytes, file.size);
            }
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              throw new Error(
                `Failed to upload chunk ${chunkIndex} after ${maxRetries} retries`
              );
            }
            // Wait before retry
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }
      }

      // Complete chunked upload
      const completeResponse = await api.post("/storage/upload/complete", {
        uploadId,
        fileName: file.name,
      });

      return completeResponse;
    } catch (error) {
      // Cleanup failed upload
      try {
        await api.delete(`/storage/upload/cleanup/${uploadId}`);
      } catch (cleanupError) {
        console.warn("Failed to cleanup incomplete upload:", cleanupError);
      }
      throw error;
    }
  },

  // Enhanced download with resume capability
  downloadFileWithResume: async (fileId, filename, options = {}) => {
    const { onProgress = null, supportResume = true, maxRetries = 3 } = options;

    try {
      let retryCount = 0;
      let downloadedBytes = 0;

      while (retryCount < maxRetries) {
        try {
          const headers = {};
          if (supportResume && downloadedBytes > 0) {
            headers.Range = `bytes=${downloadedBytes}-`;
          }

          const response = await api.get(`/storage/download/${fileId}`, {
            params: { filename },
            responseType: "blob",
            headers,
            onDownloadProgress: (progressEvent) => {
              if (onProgress) {
                const total = downloadedBytes + progressEvent.total;
                const loaded = downloadedBytes + progressEvent.loaded;
                const percentage = Math.round((loaded * 100) / total);
                onProgress(percentage, loaded, total);
              }
            },
          });

          // Success - create download
          const blob = new Blob([response]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          return response;
        } catch (error) {
          if (error.response?.status === 416) {
            // Range not satisfiable - file completely downloaded
            break;
          }

          retryCount++;
          if (retryCount >= maxRetries) {
            throw error;
          }

          // For network errors, try to resume from last position
          if (supportResume && error.code === "NETWORK_ERROR") {
            downloadedBytes = Math.floor(downloadedBytes * 0.9); // Go back a bit
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // Batch upload multiple files
  uploadMultipleFiles: async (files, uploadType, options = {}) => {
    const {
      onProgress = null,
      onFileComplete = null,
      concurrent = 3,
    } = options;

    try {
      const results = [];
      const totalFiles = files.length;
      let completedFiles = 0;

      // Process files in chunks to limit concurrent uploads
      for (let i = 0; i < files.length; i += concurrent) {
        const chunk = files.slice(i, i + concurrent);
        const chunkPromises = chunk.map(async (file, index) => {
          try {
            const result = await uploadService.uploadFileWithProgress(
              file,
              uploadType,
              {
                onProgress: (percent, loaded, total) => {
                  // Individual file progress can be tracked here
                },
              }
            );

            completedFiles++;
            if (onFileComplete) {
              onFileComplete(completedFiles, totalFiles, result);
            }

            if (onProgress) {
              const overallProgress = Math.round(
                (completedFiles * 100) / totalFiles
              );
              onProgress(overallProgress, completedFiles, totalFiles);
            }

            return { success: true, file: file.name, result };
          } catch (error) {
            completedFiles++;
            return { success: false, file: file.name, error: error.message };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      }

      return results;
    } catch (error) {
      throw error;
    }
  },

  // Get upload progress for ongoing uploads
  getUploadProgress: async (uploadId) => {
    try {
      const response = await api.get(`/storage/upload/progress/${uploadId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel ongoing upload
  cancelUpload: async (uploadId) => {
    try {
      const response = await api.delete(`/storage/upload/cancel/${uploadId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Enhanced file validation
  validateFileAdvanced: (file, options = {}) => {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = [],
      allowedExtensions = [],
      minSize = 1024, // 1KB minimum
      checkMimeType = true,
    } = options;

    const errors = [];

    // Size validation
    if (file.size > maxSize) {
      errors.push(
        `File terlalu besar. Maksimal ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      );
    }

    if (file.size < minSize) {
      errors.push(
        `File terlalu kecil. Minimal ${(minSize / 1024).toFixed(1)}KB`
      );
    }

    // Type validation
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(
        `Tipe file tidak didukung. Hanya: ${allowedTypes.join(", ")}`
      );
    }

    // Extension validation
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        errors.push(
          `Ekstensi file tidak didukung. Hanya: ${allowedExtensions.join(", ")}`
        );
      }
    }

    // MIME type validation
    if (checkMimeType && file.type) {
      const validMimeTypes = {
        pdf: ["application/pdf"],
        doc: ["application/msword"],
        docx: [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        txt: ["text/plain"],
        jpg: ["image/jpeg"],
        png: ["image/png"],
      };

      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension && validMimeTypes[extension]) {
        if (!validMimeTypes[extension].includes(file.type)) {
          errors.push(`MIME type tidak sesuai dengan ekstensi file`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        extension: file.name.split(".").pop()?.toLowerCase(),
      },
    };
  },

  // Get file metadata
  getFileMetadata: async (fileId) => {
    try {
      const response = await api.get(`/storage/files/${fileId}/metadata`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ... keep all existing methods
};

export default uploadService;
