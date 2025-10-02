import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const useCopyPasteMonitor = (options = {}) => {
  const {
    enabled = true,
    showWarnings = true,
    logEvents = true,
    maxPasteLength = 500,
    onPasteDetected,
    onSuspiciousActivity,
  } = options;

  const [pasteEvents, setPasteEvents] = useState([]);
  const [suspiciousCount, setSuspiciousCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(enabled);

  const editorRef = useRef(null);
  const observerRef = useRef(null);

  // Monitor paste events
  const handlePaste = useCallback(
    (event) => {
      if (!isMonitoring) return;

      const pastedText = event.clipboardData?.getData("text/plain") || "";
      const pastedHtml = event.clipboardData?.getData("text/html") || "";

      const pasteEvent = {
        id: Date.now(),
        timestamp: new Date(),
        textLength: pastedText.length,
        htmlLength: pastedHtml.length,
        hasFormatting: pastedHtml !== pastedText,
        source: detectPasteSource(pastedHtml),
        text: pastedText.substring(0, 200), // Store first 200 chars for analysis
      };

      // Check for suspicious paste
      const isSuspicious =
        pastedText.length > maxPasteLength ||
        pasteEvent.hasFormatting ||
        pasteEvent.source !== "unknown";

      if (isSuspicious) {
        setSuspiciousCount((prev) => prev + 1);

        if (showWarnings) {
          toast.warning(
            `Terdeteksi paste teks ${pastedText.length} karakter. Pastikan ini adalah karya Anda sendiri.`,
            { duration: 5000 }
          );
        }

        if (onSuspiciousActivity) {
          onSuspiciousActivity(pasteEvent);
        }
      }

      // Log paste event
      if (logEvents) {
        setPasteEvents((prev) => [
          ...prev,
          { ...pasteEvent, suspicious: isSuspicious },
        ]);
      }

      if (onPasteDetected) {
        onPasteDetected(pasteEvent);
      }
    },
    [
      isMonitoring,
      maxPasteLength,
      showWarnings,
      logEvents,
      onPasteDetected,
      onSuspiciousActivity,
    ]
  );

  // Detect paste source
  const detectPasteSource = useCallback((html) => {
    if (!html) return "unknown";

    // Common source patterns
    const sources = [
      { pattern: /docs\.google\.com/i, name: "Google Docs" },
      { pattern: /office\.live\.com/i, name: "Microsoft Office Online" },
      { pattern: /notion\.so/i, name: "Notion" },
      { pattern: /wikipedia\.org/i, name: "Wikipedia" },
      { pattern: /mso-/i, name: "Microsoft Word" },
      { pattern: /apple-/i, name: "Apple Pages" },
    ];

    for (const source of sources) {
      if (source.pattern.test(html)) {
        return source.name;
      }
    }

    return html.includes("<") ? "formatted-text" : "plain-text";
  }, []);

  // Monitor typing patterns
  const monitorTypingPattern = useCallback(
    (element) => {
      if (!element || !isMonitoring) return;

      let keystrokes = [];
      let lastKeystroke = 0;

      const handleKeydown = (event) => {
        const now = Date.now();
        const timeDiff = now - lastKeystroke;

        keystrokes.push({
          key: event.key,
          timestamp: now,
          timeDiff,
        });

        // Keep only last 100 keystrokes
        if (keystrokes.length > 100) {
          keystrokes = keystrokes.slice(-100);
        }

        // Detect suspicious typing patterns
        if (keystrokes.length >= 10) {
          const recentKeystrokes = keystrokes.slice(-10);
          const avgTimeDiff =
            recentKeystrokes.reduce((sum, k) => sum + k.timeDiff, 0) / 10;

          // Very fast typing (less than 50ms between keystrokes) might indicate paste
          if (
            avgTimeDiff < 50 &&
            recentKeystrokes.every((k) => k.timeDiff < 100)
          ) {
            setSuspiciousCount((prev) => prev + 1);

            if (showWarnings) {
              toast.warning("Terdeteksi pola pengetikan yang tidak biasa.", {
                duration: 3000,
              });
            }
          }
        }

        lastKeystroke = now;
      };

      element.addEventListener("keydown", handleKeydown);

      return () => {
        element.removeEventListener("keydown", handleKeydown);
      };
    },
    [isMonitoring, showWarnings]
  );

  // Attach monitors to editor
  const attachToEditor = useCallback(
    (editorElement) => {
      if (!editorElement || !isMonitoring) return;

      editorRef.current = editorElement;

      // Add paste event listener
      editorElement.addEventListener("paste", handlePaste);

      // Monitor typing patterns
      const cleanupTypingMonitor = monitorTypingPattern(editorElement);

      // Return cleanup function
      return () => {
        editorElement.removeEventListener("paste", handlePaste);
        if (cleanupTypingMonitor) {
          cleanupTypingMonitor();
        }
      };
    },
    [isMonitoring, handlePaste, monitorTypingPattern]
  );

  // Get monitoring stats
  const getStats = useCallback(() => {
    const totalPastes = pasteEvents.length;
    const suspiciousPastes = pasteEvents.filter((e) => e.suspicious).length;
    const totalPastedChars = pasteEvents.reduce(
      (sum, e) => sum + e.textLength,
      0
    );

    return {
      totalPastes,
      suspiciousPastes,
      totalPastedChars,
      suspiciousCount,
      riskLevel:
        suspiciousCount > 5 ? "high" : suspiciousCount > 2 ? "medium" : "low",
    };
  }, [pasteEvents, suspiciousCount]);

  // Clear monitoring data
  const clearData = useCallback(() => {
    setPasteEvents([]);
    setSuspiciousCount(0);
  }, []);

  // Toggle monitoring
  const toggleMonitoring = useCallback((enabled) => {
    setIsMonitoring(enabled);
  }, []);

  return {
    pasteEvents,
    suspiciousCount,
    isMonitoring,
    attachToEditor,
    getStats,
    clearData,
    toggleMonitoring,
  };
};
