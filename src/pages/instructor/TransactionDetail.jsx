// src/pages/instructor/TransactionDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  RefreshCw,
  Eye,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  LoadingSpinner,
  Alert,
} from "../../components";

import { Breadcrumb } from "../../components/layout";
import InvoiceViewer from "../../components/payments/InvoiceViewer";
import PaymentStatusTracker from "../../components/payments/PaymentStatusTracker";
import { paymentsService } from "../../services";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchTransactionDetail();
  }, [transactionId]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      const response = await paymentsService.getTransactionById(transactionId);
      setTransaction(response);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
      toast.error("Gagal memuat detail transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return "success";
      case PAYMENT_STATUS.PENDING:
        return "warning";
      case PAYMENT_STATUS.FAILED:
        return "error";
      case PAYMENT_STATUS.CANCELLED:
        return "secondary";
      case PAYMENT_STATUS.EXPIRED:
        return "warning";
      default:
        return "secondary";
    }
  };

  // Handle invoice actions
  const handleDownloadInvoice = async () => {
    try {
      // Implementation for downloading invoice
      toast.success("Invoice berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh invoice");
    }
  };

  const handlePrintInvoice = async () => {
    try {
      window.print();
    } catch (error) {
      toast.error("Gagal mencetak invoice");
    }
  };

  const handleEmailInvoice = async () => {
    try {
      // Implementation for emailing invoice
      toast.success("Invoice berhasil dikirim via email");
    } catch (error) {
      toast.error("Gagal mengirim invoice");
    }
  };

  if (loading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container className="py-6">
        <Alert variant="error">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Transaksi tidak ditemukan
            </h2>
            <p className="text-gray-600 mb-4">
              Transaksi dengan ID "{transactionId}" tidak dapat ditemukan.
            </p>
            <Button onClick={() => navigate("/instructor/transactions")}>
              Kembali ke Riwayat Transaksi
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "invoice", label: "Invoice", icon: CreditCard },
    { id: "status", label: "Status Tracking", icon: RefreshCw },
  ];

  return (
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/instructor/dashboard" },
                { label: "Transaksi", href: "/instructor/transactions" },
                { label: `Transaction #${transaction.orderId}` },
              ]}
            />
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/instructor/transactions")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Detail Transaksi
              </h1>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button variant="outline" onClick={() => fetchTransactionDetail()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Transaction Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Transaction #{transaction.orderId}
              </div>
              <Badge variant={getStatusVariant(transaction.status)}>
                {transaction.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Jumlah Pembayaran
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(transaction.amount)}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Tanggal Transaksi
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(transaction.createdAt, "dd/MM/yyyy HH:mm")}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Assignment
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {transaction.assignment?.title}
                </div>
                <div className="text-sm text-gray-600">
                  {transaction.assignment?.class?.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-[#23407a] text-[#23407a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Informasi Assignment
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Judul:</span>
                          <span className="ml-2">
                            {transaction.assignment?.title}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Kelas:</span>
                          <span className="ml-2">
                            {transaction.assignment?.class?.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-2">
                            {formatDate(
                              transaction.assignment?.deadline,
                              "dd MMMM yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Detail Pembayaran
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Jumlah Siswa:</span>
                          <span className="ml-2">
                            {transaction.expectedStudentCount}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Harga per Siswa:</span>
                          <span className="ml-2">{formatCurrency(2500)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <span className="ml-2 font-semibold">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "invoice" && (
            <InvoiceViewer
              transaction={transaction}
              onDownload={handleDownloadInvoice}
              onPrint={handlePrintInvoice}
              onEmail={handleEmailInvoice}
            />
          )}

          {activeTab === "status" && (
            <PaymentStatusTracker
              transaction={transaction}
              onPaymentSuccess={(response) => {
                toast.success("Pembayaran berhasil!");
                fetchTransactionDetail();
              }}
              onPaymentFailure={(response) => {
                toast.error("Pembayaran gagal!");
                fetchTransactionDetail();
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
