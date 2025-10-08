// src/components/plagiarism/PlagiarismTrigger.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Play, Settings, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import Input from "../ui/Input";
import { Modal } from "../ui/Modal";
import { plagiarismService } from "../../services";
import toast from "react-hot-toast";

// Hanya field yang didukung BE
const plagiarismCheckSchema = z.object({
  excluded_sources: z.array(z.string().url()).optional(),
  language: z.string().default("id"),
  country: z.string().default("id"),
});

export default function PlagiarismTrigger({
  submissionId,
  onCheckStarted,
  disabled = false,
  currentScore = null,
}) {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [excludedSources, setExcludedSources] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(plagiarismCheckSchema),
    defaultValues: {
      language: "id",
      country: "id",
    },
  });

  // Hanya trigger pengecekan plagiarisme sesuai BE
  const handleStartCheck = async (data) => {
    try {
      setLoading(true);

      // Kirim hanya field yang didukung BE
      const checkData = {
        ...data,
        excluded_sources: excludedSources.filter((source) => source.trim()),
      };

      const result = await plagiarismService.checkPlagiarism(
        submissionId,
        checkData
      );

      toast.success("Pengecekan plagiarisme dimulai!");
      onCheckStarted?.(result);
      setShowAdvanced(false);
      reset();
    } catch (error) {
      console.error("Error starting plagiarism check:", error);
      toast.error(
        error.response?.data?.message || "Gagal memulai pengecekan plagiarisme"
      );
    } finally {
      setLoading(false);
    }
  };

  // Opsi exclude sources hanya jika didukung BE
  const addExcludedSource = () => {
    setExcludedSources([...excludedSources, ""]);
  };

  const updateExcludedSource = (index, value) => {
    const updated = [...excludedSources];
    updated[index] = value;
    setExcludedSources(updated);
  };

  const removeExcludedSource = (index) => {
    setExcludedSources(excludedSources.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Deteksi Plagiarisme
          </h3>
          {currentScore !== null && (
            <p className="text-sm text-gray-600">
              Skor terakhir:{" "}
              <span
                className={`font-medium ${
                  currentScore > 30
                    ? "text-red-600"
                    : currentScore > 15
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {currentScore}%
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(true)}
            disabled={disabled || loading}
          >
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>

          <Button
            onClick={handleSubmit(handleStartCheck)}
            disabled={disabled || loading}
            loading={loading}
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? "Memproses..." : "Cek Plagiarisme"}
          </Button>
        </div>
      </div>

      {disabled && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Submission harus dikumpulkan terlebih dahulu sebelum dicek
            plagiarisme
          </span>
        </div>
      )}

      {/* Advanced Settings Modal */}
      <Modal
        isOpen={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        title="Pengaturan Pengecekan Plagiarisme"
      >
        <form onSubmit={handleSubmit(handleStartCheck)} className="space-y-6">
          {/* Language & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bahasa
              </label>
              <select
                {...register("language")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23407a]"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ms">Bahasa Malaysia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Negara
              </label>
              <select
                {...register("country")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23407a]"
              >
                <option value="id">Indonesia</option>
                <option value="us">United States</option>
                <option value="my">Malaysia</option>
                <option value="sg">Singapore</option>
              </select>
            </div>
          </div>

          {/* Excluded Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Sumber yang Dikecualikan
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExcludedSource}
              >
                Tambah URL
              </Button>
            </div>

            <div className="space-y-2">
              {excludedSources.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={source}
                    onChange={(e) =>
                      updateExcludedSource(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeExcludedSource(index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
            </div>

            {excludedSources.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Tidak ada sumber yang dikecualikan
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(false)}
            >
              Batal
            </Button>
            <Button type="submit" loading={loading}>
              <Play className="h-4 w-4 mr-2" />
              Mulai Pengecekan
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
