// src/components/payments/PaymentCalculator.jsx
import { useState } from "react";
import { Calculator, Info, Users, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Alert } from "../ui/Alert";
import { usePaymentCalculator } from "../../hooks/usePaymentCalculator";

export default function PaymentCalculator({
  initialStudentCount = 1,
  onCalculationChange,
  showBreakdown = true,
  className = "",
}) {
  const { studentCount, setStudentCount, pricing, validation, formatCurrency } =
    usePaymentCalculator(initialStudentCount);

  const [showDetails, setShowDetails] = useState(false);

  // Notify parent component of changes
  useState(() => {
    if (onCalculationChange) {
      onCalculationChange({
        studentCount,
        pricing,
        validation,
      });
    }
  }, [studentCount, pricing, validation, onCalculationChange]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Kalkulator Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student Count Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Jumlah Siswa
          </label>
          <Input
            type="number"
            min={1}
            max={100}
            value={studentCount}
            onChange={(e) => setStudentCount(parseInt(e.target.value) || 1)}
            placeholder="Masukkan jumlah siswa"
            className={validation.isValid ? "" : "border-red-500"}
          />
          {!validation.isValid && (
            <div className="mt-1 text-sm text-red-600">
              {validation.errors.join(", ")}
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-700">Harga per siswa:</span>
            <span className="font-medium text-blue-900">
              {formatCurrency(pricing.pricePerStudent)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-blue-700">
              Total Pembayaran:
            </span>
            <span className="text-2xl font-bold text-blue-900">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>

        {/* Breakdown Toggle */}
        {showBreakdown && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? "Sembunyikan" : "Tampilkan"} Detail Pembayaran
          </Button>
        )}

        {/* Payment Breakdown */}
        {showDetails && showBreakdown && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-gray-900">Detail Pembayaran</h4>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>
                  Subtotal ({studentCount} siswa ×{" "}
                  {formatCurrency(pricing.pricePerStudent)}):
                </span>
                <span>{formatCurrency(pricing.basePrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Biaya Admin:</span>
                <span>{formatCurrency(pricing.adminFee)}</span>
              </div>

              <div className="border-t pt-1 flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Alert */}
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <div className="text-sm">
            <strong>Informasi:</strong> Assignment akan aktif setelah pembayaran
            berhasil. Siswa hanya bisa mengerjakan assignment sesuai quota yang
            dibayar.
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
