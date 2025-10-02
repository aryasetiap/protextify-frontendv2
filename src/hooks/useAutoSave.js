import { useCallback, useRef, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { submissionsService } from "../services";
import toast from "react-hot-toast";

export const useAutoSave = (submissionId, options = {}) => {
  const {
    interval = 3000,
    enabled = true,
    onSuccess,
    onError,
    useWebSocket: useWS = true,
  } = options;

  const { updateContent, isSocketConnected } = useWebSocket();
  const saveTimeoutRef = useRef(null);
  const lastSavedContentRef = useRef("");
  const isSavingRef = useRef(false);

  // WebSocket auto-save
  const saveViaWebSocket = useCallback(
    (content) => {
      if (!isSocketConnected() || !submissionId || !content.trim()) {
        return false;
      }

      try {
        updateContent(submissionId, content);
        lastSavedContentRef.current = content;
        return true;
      } catch (error) {
        console.error("WebSocket auto-save failed:", error);
        return false;
      }
    },
    [submissionId, updateContent, isSocketConnected]
  );

  // HTTP API auto-save (fallback)
  const saveViaAPI = useCallback(
    async (content) => {
      if (!submissionId || !content.trim() || isSavingRef.current) {
        return false;
      }

      try {
        isSavingRef.current = true;
        await submissionsService.updateSubmissionContent(submissionId, content);
        lastSavedContentRef.current = content;
        return true;
      } catch (error) {
        console.error("API auto-save failed:", error);
        if (onError) onError(error);
        throw error;
      } finally {
        isSavingRef.current = false;
      }
    },
    [submissionId, onError]
  );

  // Main auto-save function
  const autoSave = useCallback(
    async (content) => {
      if (!enabled || !content || content === lastSavedContentRef.current) {
        return;
      }

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          let success = false;

          // Try WebSocket first if enabled and connected
          if (useWS && isSocketConnected()) {
            success = saveViaWebSocket(content);
          }

          // Fallback to API if WebSocket failed or not available
          if (!success) {
            await saveViaAPI(content);
          }

          if (onSuccess) onSuccess();
        } catch (error) {
          // Show error toast for API failures
          toast.error("Gagal menyimpan otomatis. Coba lagi.");
          console.error("Auto-save failed:", error);
        }
      }, interval);
    },
    [
      enabled,
      interval,
      useWS,
      isSocketConnected,
      saveViaWebSocket,
      saveViaAPI,
      onSuccess,
    ]
  );

  // Manual save function
  const manualSave = useCallback(
    async (content) => {
      try {
        await saveViaAPI(content);
        toast.success("Berhasil disimpan");
      } catch (error) {
        toast.error("Gagal menyimpan");
        throw error;
      }
    },
    [saveViaAPI]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    manualSave,
    isSaving: isSavingRef.current,
  };
};
