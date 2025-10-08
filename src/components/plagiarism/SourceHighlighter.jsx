// src/components/plagiarism/SourceHighlighter.jsx
import { useState, useMemo } from "react";
import { AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Card } from "../ui/Card";
import Badge from "../ui/Badge";
import Tooltip from "../ui/Tooltip";
import Button from "../ui/Button";

// Hanya field dan fitur yang didukung BE
export default function SourceHighlighter({
  content,
  plagiarismIndexes = [],
  sources = [],
}) {
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // Proses highlight sesuai hasil BE
  const highlightedContent = useMemo(() => {
    if (!content || !plagiarismIndexes.length) {
      return { content, highlights: [] };
    }

    let processedContent = content;
    const highlights = [];

    // Sort indexes by start position (descending to avoid offset issues)
    const sortedIndexes = [...plagiarismIndexes].sort(
      (a, b) => b.startIndex - a.startIndex
    );

    sortedIndexes.forEach((index, i) => {
      const { startIndex, endIndex, sequence } = index;

      if (
        startIndex >= 0 &&
        endIndex > startIndex &&
        endIndex <= content.length
      ) {
        const before = processedContent.substring(0, startIndex);
        const highlighted = processedContent.substring(startIndex, endIndex);
        const after = processedContent.substring(endIndex);

        const highlightId = `highlight-${i}`;
        const severity = getSeverity(highlighted.length);

        highlights.push({
          id: highlightId,
          text: highlighted,
          sequence,
          startIndex,
          endIndex,
          severity,
          sources: findMatchingSources(highlighted, sources),
        });

        processedContent = `${before}<mark data-highlight-id="${highlightId}" class="highlight-${severity}">${highlighted}</mark>${after}`;
      }
    });

    return { content: processedContent, highlights };
  }, [content, plagiarismIndexes, sources]);

  // Severity mapping sesuai BE
  const getSeverity = (length) => {
    if (length > 50) return "high";
    if (length > 20) return "medium";
    return "low";
  };

  // Matching sources sesuai BE (plagiarismFound)
  const findMatchingSources = (text, sources) => {
    return sources.filter((source) =>
      Array.isArray(source.plagiarismFound)
        ? source.plagiarismFound.some((found) =>
            found.sequence?.toLowerCase().includes(text.toLowerCase())
          )
        : false
    );
  };

  const handleHighlightClick = (highlightId) => {
    const highlight = highlightedContent.highlights.find(
      (h) => h.id === highlightId
    );
    setSelectedHighlight(highlight);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!content) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Tidak ada konten untuk ditampilkan
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      {plagiarismIndexes.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Keterangan Highlight
          </h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-200 border border-red-400 rounded"></span>
              <span>Plagiarisme Tinggi (&gt;50 kata)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></span>
              <span>Plagiarisme Sedang (20-50 kata)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></span>
              <span>Plagiarisme Rendah (&lt;20 kata)</span>
            </div>
          </div>
        </Card>
      )}

      {/* Content with Highlights */}
      <Card className="p-6">
        <div
          className="prose max-w-none plagiarism-content"
          dangerouslySetInnerHTML={{
            __html: highlightedContent.content || content,
          }}
          onClick={(e) => {
            const highlightId = e.target.getAttribute("data-highlight-id");
            if (highlightId) {
              handleHighlightClick(highlightId);
            }
          }}
        />
      </Card>

      {/* Selected Highlight Details */}
      {selectedHighlight && (
        <Card className="p-6 border-l-4 border-orange-500">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Teks Terdeteksi Plagiarisme
                </h4>
                <Badge
                  variant={
                    selectedHighlight.severity === "high"
                      ? "danger"
                      : selectedHighlight.severity === "medium"
                      ? "warning"
                      : "info"
                  }
                >
                  {selectedHighlight.severity === "high"
                    ? "Tinggi"
                    : selectedHighlight.severity === "medium"
                    ? "Sedang"
                    : "Rendah"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedHighlight(null)}
              >
                Tutup
              </Button>
            </div>

            {/* Highlighted Text */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <p className="text-gray-900 italic">
                  "{selectedHighlight.text}"
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(selectedHighlight.text)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Posisi: {selectedHighlight.startIndex} -{" "}
                {selectedHighlight.endIndex}
              </div>
            </div>

            {/* Matching Sources */}
            {selectedHighlight.sources.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Sumber yang Cocok ({selectedHighlight.sources.length})
                </h5>
                <div className="space-y-2">
                  {selectedHighlight.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {source.title || "Untitled"}
                        </div>
                        <div className="text-sm text-blue-600 truncate">
                          {source.url}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="info">
                          {Math.round(source.score)}%
                        </Badge>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .plagiarism-content .highlight-high {
          background-color: #fecaca;
          border: 1px solid #f87171;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        .plagiarism-content .highlight-medium {
          background-color: #fef3c7;
          border: 1px solid #fbbf24;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        .plagiarism-content .highlight-low {
          background-color: #dbeafe;
          border: 1px solid #60a5fa;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        .plagiarism-content mark:hover {
          opacity: 0.8;
          transform: scale(1.02);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
