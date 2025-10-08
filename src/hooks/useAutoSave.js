import { useCallback, useRef, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { submissionsService } from "../services";
import toast from "react-hot-toast";

// Tambahkan util debounce jika belum ada
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

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

  // Debounced auto-save function
  const debouncedAutoSave = useRef(
    debounce(async (content) => {
      try {
        let success = false;
        if (useWS && isSocketConnected()) {
          success = saveViaWebSocket(content);
        }
        if (!success) {
          await saveViaAPI(content);
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Gagal menyimpan otomatis. Coba lagi.");
        console.error("Auto-save failed:", error);
      }
    }, interval)
  ).current;

  // Main auto-save function
  const autoSave = useCallback(
    async (content) => {
      if (!enabled || !content || content === lastSavedContentRef.current) {
        return;
      }
      debouncedAutoSave(content);
    },
    [enabled, debouncedAutoSave, lastSavedContentRef]
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
