// src/pages/instructor/TransactionHistory.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreditCard,
  Filter,
  Download,
  Eye,
  Calendar,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  DataTable, // ✅ Changed from Table to DataTable
  Pagination,
  LoadingSpinner,
  Alert,
  Badge,
} from "../../components";

import { paymentsService } from "../../services";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    search: searchParams.get("search") || "",
  });

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await paymentsService.getTransactionHistory(params);

      setTransactions(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });

      // Update URL params
      const newParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });
      setSearchParams(newParams);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(pagination.page);
  }, []);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchTransactions(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setSearchParams({});
    fetchTransactions(1);
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
      default:
        return "secondary";
    }
  };

  // Export transactions
  const handleExport = async () => {
    try {
      // Implementation for exporting transactions
      console.log("Exporting transactions...");
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      render: (transaction) => (
        <div className="font-mono text-sm">{transaction.orderId}</div>
      ),
    },
    {
      key: "assignment",
      label: "Assignment",
      render: (transaction) => (
        <div>
          <div className="font-medium">{transaction.assignment?.title}</div>
          <div className="text-sm text-gray-500">
            {transaction.assignment?.class?.name}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Jumlah",
      render: (transaction) => (
        <div className="text-right">
          <div className="font-medium">
            {formatCurrency(transaction.amount)}
          </div>
          <div className="text-sm text-gray-500">
            {transaction.expectedStudentCount} siswa
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => (
        <Badge variant={getStatusVariant(transaction.status)}>
          {transaction.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Tanggal",
      render: (transaction) => (
        <div className="text-sm">
          {formatDate(transaction.createdAt, "dd/MM/yyyy HH:mm")}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (transaction) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              navigate(`/instructor/transactions/${transaction.id}`)
            }
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Transaksi
          </h1>
          <p className="text-gray-600">
            Kelola dan monitor riwayat pembayaran assignment
          </p>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            onClick={() => fetchTransactions(pagination.page)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Cari
              </label>
              <Input
                placeholder="Order ID atau Assignment..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                <option value={PAYMENT_STATUS.SUCCESS}>Success</option>
                <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                <option value={PAYMENT_STATUS.CANCELLED}>Cancelled</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Dari Tanggal
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Sampai Tanggal
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={applyFilters}>Terapkan Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Daftar Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions.length > 0 ? (
            <>
              {/* ✅ Use DataTable instead of Table */}
              <DataTable
                columns={columns}
                data={transactions}
                className="mb-4"
              />

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => fetchTransactions(page)}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
              />
            </>
          ) : (
            <Alert>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {Object.values(filters).some((f) => f)
                    ? "Tidak ada transaksi yang sesuai dengan filter"
                    : "Belum ada transaksi"}
                </p>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
