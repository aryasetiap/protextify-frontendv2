// src/hooks/useContentSync.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { useDebounce } from "./useDebounce";

export const useContentSync = (
  submissionId,
  initialContent = "",
  options = {}
) => {
  const {
    autoSaveDelay = 2000,
    conflictResolution = "server", // "server" | "client" | "merge"
    enableCollaboration = true,
  } = options;

  const [content, setContent] = useState(initialContent);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  const { updateContent, subscribe } = useWebSocket();
  const debouncedContent = useDebounce(content, autoSaveDelay);
  const lastServerContent = useRef(initialContent);
  const isLocalChange = useRef(false);

  // Auto-save effect
  useEffect(() => {
    if (!submissionId || !debouncedContent || !hasUnsavedChanges) return;

    const performAutoSave = async () => {
      try {
        setIsSaving(true);
        setSaveError(null);

        await updateContent(submissionId, debouncedContent, {
          timestamp: new Date().toISOString(),
          wordCount: debouncedContent.split(/\s+/).filter((w) => w.length > 0)
            .length,
        });

        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        lastServerContent.current = debouncedContent;
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveError(error.message || "Gagal menyimpan otomatis");
      } finally {
        setIsSaving(false);
      }
    };

    performAutoSave();
  }, [debouncedContent, submissionId, updateContent, hasUnsavedChanges]);

  // Listen to real-time updates
  useEffect(() => {
    if (!submissionId || !enableCollaboration) return;

    const unsubscribeContentUpdate = subscribe(
      "updateContentResponse",
      (data) => {
        if (data.submissionId === submissionId && !isLocalChange.current) {
          handleRemoteContentUpdate(data);
        }
        isLocalChange.current = false;
      }
    );

    const unsubscribeSubmissionUpdate = subscribe(
      "submissionUpdated",
      (data) => {
        if (data.submissionId === submissionId) {
          handleSubmissionUpdate(data);
        }
      }
    );

    const unsubscribeCollaborators = subscribe(
      "collaboratorsUpdated",
      (data) => {
        if (data.submissionId === submissionId) {
          setCollaborators(data.collaborators || []);
        }
      }
    );

    return () => {
      unsubscribeContentUpdate();
      unsubscribeSubmissionUpdate();
      unsubscribeCollaborators();
    };
  }, [submissionId, subscribe, enableCollaboration]);

  const handleRemoteContentUpdate = (data) => {
    const remoteContent = data.content;
    const currentContent = content;

    // Check for conflicts
    if (hasUnsavedChanges && remoteContent !== lastServerContent.current) {
      const conflict = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        localContent: currentContent,
        remoteContent: remoteContent,
        resolved: false,
      };

      setConflicts((prev) => [...prev, conflict]);

      // Apply conflict resolution strategy
      switch (conflictResolution) {
        case "server":
          setContent(remoteContent);
          setHasUnsavedChanges(false);
          break;
        case "client":
          // Keep local changes, mark as needing save
          setHasUnsavedChanges(true);
          break;
        case "merge":
          // Simple merge strategy - could be enhanced
          const mergedContent = mergeContent(
            currentContent,
            remoteContent,
            lastServerContent.current
          );
          setContent(mergedContent);
          setHasUnsavedChanges(true);
          break;
      }
    } else {
      setContent(remoteContent);
      setHasUnsavedChanges(false);
    }

    lastServerContent.current = remoteContent;
    setLastSaved(new Date(data.updatedAt));
  };

  const handleSubmissionUpdate = (data) => {
    // Handle other submission updates (status, grade, etc.)
    if (data.content && data.content !== content) {
      setContent(data.content);
      setHasUnsavedChanges(false);
      lastServerContent.current = data.content;
    }
  };

  const mergeContent = (local, remote, base) => {
    // Simple three-way merge algorithm
    // This is a basic implementation - could be enhanced with proper diff/merge
    if (local === base) return remote;
    if (remote === base) return local;

    // If both changed, prefer local with a note
    return `${local}\n\n[MERGED CONTENT]\n${remote}`;
  };

  const updateContentLocal = useCallback((newContent) => {
    isLocalChange.current = true;
    setContent(newContent);
    setHasUnsavedChanges(newContent !== lastServerContent.current);
    setSaveError(null);
  }, []);

  const forceSave = useCallback(async () => {
    if (!submissionId || !content) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      await updateContent(submissionId, content, {
        timestamp: new Date().toISOString(),
        force: true,
      });

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastServerContent.current = content;
    } catch (error) {
      setSaveError(error.message || "Gagal menyimpan");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [submissionId, content, updateContent]);

  const resolveConflict = useCallback((conflictId, resolution) => {
    setConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === conflictId
          ? { ...conflict, resolved: true, resolution }
          : conflict
      )
    );
  }, []);

  const discardChanges = useCallback(() => {
    setContent(lastServerContent.current);
    setHasUnsavedChanges(false);
    setSaveError(null);
  }, []);

  return {
    content,
    updateContent: updateContentLocal,
    lastSaved,
    isSaving,
    saveError,
    hasUnsavedChanges,
    collaborators,
    conflicts,
    forceSave,
    resolveConflict,
    discardChanges,

    // Status helpers
    canEdit: !isSaving && conflicts.length === 0,
    saveStatus: isSaving ? "saving" : hasUnsavedChanges ? "unsaved" : "saved",
  };
};
