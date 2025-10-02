import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Save, DollarSign, Info } from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Alert,
  Breadcrumb,
  LoadingSpinner,
} from "../../components";
import { assignmentsService, paymentsService } from "../../services";
import { createAssignmentSchema } from "../../utils/validation";
import { useAsyncData } from "../../hooks/useAsyncData";
import DateTimePicker from "../../components/forms/DateTimePicker";
import RichTextEditor from "../../components/forms/RichTextEditor";
import PaymentCalculator from "../../components/payments/PaymentCalculator";
import PaymentStatusTracker from "../../components/payments/PaymentStatusTracker";

export default function CreateAssignment() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [assignmentData, setAssignmentData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCalculation, setPaymentCalculation] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      instructions: "",
      deadline: "",
      expectedStudentCount: 1,
    },
  });

  // Get class detail
  const { data: classDetail, loading: classLoading } = useAsyncData(
    () => classesService.getClassById(classId),
    [classId]
  );

  const watchedValues = watch();
  const pricePerStudent = 2500;
  const totalPrice = watchedValues.expectedStudentCount * pricePerStudent;

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Format deadline to ISO string
      const formattedData = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      };

      const response = await assignmentsService.createAssignment(
        classId,
        formattedData
      );

      if (response.paymentRequired) {
        setAssignmentData(response);
        setShowPayment(true);
        toast.success(
          "Assignment berhasil dibuat! Silakan lakukan pembayaran untuk mengaktifkan."
        );
      } else {
        toast.success("Assignment berhasil dibuat dan aktif!");
        navigate(`/instructor/classes/${classId}`);
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      const paymentData = {
        amount: totalPrice,
        assignmentId: assignmentData.assignment.id,
      };

      const paymentResponse = await paymentsService.createTransaction(
        paymentData
      );

      // Redirect to Midtrans payment page
      if (paymentResponse.paymentUrl) {
        window.open(paymentResponse.paymentUrl, "_blank");
        toast.success(
          "Halaman pembayaran telah dibuka. Selesaikan pembayaran untuk mengaktifkan assignment."
        );
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (classLoading) {
    return (
      <Container className="py-6">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/instructor/classes/${classId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kelas
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Tugas Baru</h1>
          <p className="text-gray-600">Kelas: {classDetail?.name}</p>
        </div>
      </div>

      {!showPayment ? (
        /* Assignment Creation Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informasi Tugas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="Judul Tugas *"
                  placeholder="Masukkan judul tugas..."
                  {...register("title")}
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instruksi Tugas *
                </label>
                <RichTextEditor
                  value={watchedValues.instructions}
                  onChange={(value) => setValue("instructions", value)}
                  placeholder="Masukkan instruksi detail untuk tugas ini..."
                  error={errors.instructions?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <DateTimePicker
                    label="Deadline *"
                    value={watchedValues.deadline}
                    onChange={(value) => setValue("deadline", value)}
                    error={errors.deadline?.message}
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <Input
                    label="Jumlah Siswa yang Diharapkan *"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Masukkan jumlah siswa..."
                    {...register("expectedStudentCount", {
                      valueAsNumber: true,
                    })}
                    error={errors.expectedStudentCount?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      Sistem Pembayaran Assignment
                    </p>
                    <p className="text-blue-700">
                      Setiap assignment memerlukan pembayaran berdasarkan jumlah
                      siswa yang diharapkan mengerjakan. Assignment akan aktif
                      setelah pembayaran berhasil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Harga per siswa:
                  </span>
                  <span className="font-semibold text-gray-900">
                    Rp {pricePerStudent.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Jumlah siswa:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {watchedValues.expectedStudentCount} siswa
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">
                    Total pembayaran:
                  </span>
                  <span className="font-bold text-blue-900 text-lg">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/instructor/classes/${classId}`)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <Save className="h-4 w-4 mr-2" />
              Buat Assignment
            </Button>
          </div>
        </form>
      ) : (
        /* Payment Section */
        <PaymentSection
          assignmentData={assignmentData}
          totalPrice={totalPrice}
          onPayment={handlePayment}
          paymentLoading={paymentLoading}
          onCancel={() => {
            setShowPayment(false);
            navigate(`/instructor/classes/${classId}`);
          }}
        />
      )}
    </Container>
  );
}

// Payment Section Component
function PaymentSection({
  assignmentData,
  totalPrice,
  onPayment,
  paymentLoading,
  onCancel,
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Konfirmasi Pembayaran Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="success">
            <div className="text-sm">
              <strong>Assignment berhasil dibuat!</strong> Silakan lakukan
              pembayaran untuk mengaktifkan assignment ini.
            </div>
          </Alert>

          {/* Payment Calculator */}
          <PaymentCalculator
            initialStudentCount={assignmentData.assignment.expectedStudentCount}
            showBreakdown={true}
            onCalculationChange={setPaymentCalculation}
          />

          {/* Assignment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Detail Assignment:</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Judul:</span>{" "}
                {assignmentData.assignment.title}
              </p>
              <p>
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(
                  assignmentData.assignment.deadline
                ).toLocaleDateString("id-ID")}
              </p>
              <p>
                <span className="font-medium">Jumlah Siswa:</span>{" "}
                {assignmentData.assignment.expectedStudentCount}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button
              onClick={onPayment}
              loading={paymentLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Bayar Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Tracker (if payment initiated) */}
      {transactionData && (
        <PaymentStatusTracker
          transaction={transactionData}
          onPaymentSuccess={(response) => {
            toast.success("Pembayaran berhasil! Assignment telah aktif.");
            navigate(`/instructor/classes/${classId}`);
          }}
          onPaymentFailure={(response) => {
            toast.error("Pembayaran gagal. Silakan coba lagi.");
          }}
        />
      )}
    </div>
  );
}
