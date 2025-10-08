import { useState, useCallback, useMemo } from "react";
import { submissionsService, plagiarismService } from "../services";
import { toast } from "react-hot-toast";

export const useTextAnalytics = (initialContent = "", limits = {}) => {
  const {
    maxWords = 1000,
    maxCharacters = 7000,
    minWords = 0,
    warnAtWordPercentage = 90,
    warnAtCharacterPercentage = 90,
    submissionId = null, // opsional, jika ingin auto-save ke BE
  } = limits;

  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Calculate text statistics
  const stats = useMemo(() => {
    // Remove HTML tags for accurate counting
    const plainText = content.replace(/<[^>]*>/g, "").trim();

    // Word count
    const words =
      plainText === ""
        ? 0
        : plainText.split(/\s+/).filter((word) => word.length > 0).length;

    // Character count (without spaces)
    const charactersNoSpaces = plainText.replace(/\s/g, "").length;

    // Character count (with spaces)
    const charactersWithSpaces = plainText.length;

    // Sentence count
    const sentences =
      plainText === ""
        ? 0
        : plainText
            .split(/[.!?]+/)
            .filter((sentence) => sentence.trim().length > 0).length;

    // Paragraph count
    const paragraphs =
      content === ""
        ? 0
        : content
            .split(/<\/p>|<br\s*\/?>/i)
            .filter((para) => para.replace(/<[^>]*>/g, "").trim().length > 0)
            .length;

    // Reading time estimation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);

    return {
      words,
      charactersNoSpaces,
      charactersWithSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      plainText,
    };
  }, [content]);

  // Limit checks
  const limitChecks = useMemo(() => {
    const wordPercentage = (stats.words / maxWords) * 100;
    const characterPercentage =
      (stats.charactersWithSpaces / maxCharacters) * 100;

    return {
      isWordLimitExceeded: stats.words > maxWords,
      isCharacterLimitExceeded: stats.charactersWithSpaces > maxCharacters,
      isMinWordsMet: stats.words >= minWords,

      wordPercentage,
      characterPercentage,

      shouldWarnWords: wordPercentage >= warnAtWordPercentage,
      shouldWarnCharacters: characterPercentage >= warnAtCharacterPercentage,

      wordsRemaining: Math.max(0, maxWords - stats.words),
      charactersRemaining: Math.max(
        0,
        maxCharacters - stats.charactersWithSpaces
      ),
    };
  }, [
    stats,
    maxWords,
    maxCharacters,
    minWords,
    warnAtWordPercentage,
    warnAtCharacterPercentage,
  ]);

  // Validation
  const validation = useMemo(() => {
    const errors = [];
    const warnings = [];

    if (limitChecks.isWordLimitExceeded) {
      errors.push(`Melebihi batas maksimal ${maxWords} kata`);
    }

    if (limitChecks.isCharacterLimitExceeded) {
      errors.push(`Melebihi batas maksimal ${maxCharacters} karakter`);
    }

    if (!limitChecks.isMinWordsMet && minWords > 0) {
      warnings.push(`Minimal ${minWords} kata diperlukan`);
    }

    if (limitChecks.shouldWarnWords && !limitChecks.isWordLimitExceeded) {
      warnings.push(
        `Mendekati batas kata (${limitChecks.wordsRemaining} kata tersisa)`
      );
    }

    if (
      limitChecks.shouldWarnCharacters &&
      !limitChecks.isCharacterLimitExceeded
    ) {
      warnings.push(
        `Mendekati batas karakter (${limitChecks.charactersRemaining} karakter tersisa)`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [limitChecks, maxWords, maxCharacters, minWords]);

  // Update content
  const updateContent = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  // Auto-save ke BE jika submissionId tersedia
  const autoSaveContent = useCallback(async () => {
    if (!submissionId) return;
    setSaving(true);
    setError(null);
    try {
      await submissionsService.updateSubmissionContent(submissionId, content);
      toast.success("Draft berhasil disimpan");
    } catch (err) {
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal menyimpan draft",
      };
      setError(formattedError);
      toast.error(formattedError.message);
    } finally {
      setSaving(false);
    }
  }, [submissionId, content]);

  // Fungsi untuk trigger pengecekan plagiarisme (opsional, jika diperlukan)
  const checkPlagiarism = useCallback(
    async (options = {}) => {
      if (!submissionId) return;
      try {
        const result = await plagiarismService.checkPlagiarism(
          submissionId,
          options
        );
        toast.success("Pengecekan plagiarisme berhasil dimulai");
        return result;
      } catch (err) {
        const formattedError = {
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal memulai pengecekan plagiarisme",
        };
        setError(formattedError);
        toast.error(formattedError.message);
        throw formattedError;
      }
    },
    [submissionId]
  );

  // Get display statistics
  const getDisplayStats = useCallback(() => {
    return {
      words: `${stats.words} / ${maxWords}`,
      characters: `${stats.charactersWithSpaces} / ${maxCharacters}`,
      sentences: stats.sentences,
      paragraphs: stats.paragraphs,
      readingTime: `${stats.readingTimeMinutes} menit`,
    };
  }, [stats, maxWords, maxCharacters]);

  return {
    content,
    updateContent,
    stats,
    limitChecks,
    validation,
    getDisplayStats,
    autoSaveContent,
    saving,
    error,
    checkPlagiarism,
  };
};
