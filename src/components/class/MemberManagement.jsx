import { useState, useMemo } from "react";
import {
  Users,
  Mail,
  UserMinus,
  Copy,
  Search,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Modal,
} from "../ui";
import { formatDate } from "../../utils/helpers";
import Pagination from "../pagination"; // Import the Pagination component

export default function MemberManagement({ classDetail, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const members = classDetail?.enrollments || [];

  // Filter members based on search
  const filteredMembers = members.filter(
    (enrollment) =>
      enrollment.student.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const handleSelectMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((e) => e.student.id));
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      // API call to remove member
      // await classesService.removeMember(classDetail.id, memberId);
      toast.success("Anggota berhasil dihapus");
      onRefresh?.();
    } catch (error) {
      toast.error("Gagal menghapus anggota");
    }
  };

  const handleBulkRemove = async () => {
    try {
      // API call to remove multiple members
      // await Promise.all(selectedMembers.map(id =>
      //   classesService.removeMember(classDetail.id, id)
      // ));
      toast.success(`${selectedMembers.length} anggota berhasil dihapus`);
      setSelectedMembers([]);
      onRefresh?.();
    } catch (error) {
      toast.error("Gagal menghapus anggota");
    }
  };

  const exportMemberList = () => {
    const csvContent = [
      "Nama,Email,Institusi,Tanggal Bergabung",
      ...filteredMembers.map(
        (enrollment) =>
          `${enrollment.student.fullName},${enrollment.student.email},${
            enrollment.student.institution
          },${formatDate(enrollment.createdAt)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${classDetail.name}_members.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Manajemen Anggota
          </h3>
          <p className="text-sm text-gray-600">
            Total: {members.length} anggota
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportMemberList}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setShowInviteModal(true)}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Mail className="h-4 w-4 mr-2" />
            Undang Siswa
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {selectedMembers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedMembers.length} dipilih
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRemove}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardContent className="p-0">
          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 w-12">
                      <Checkbox
                        checked={
                          selectedMembers.length === filteredMembers.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Siswa
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Email
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Institusi
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Bergabung
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-center p-4 font-medium text-gray-900 w-20">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((enrollment) => (
                    <tr
                      key={enrollment.student.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedMembers.includes(
                            enrollment.student.id
                          )}
                          onChange={() =>
                            handleSelectMember(enrollment.student.id)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center text-white font-medium mr-3">
                            {enrollment.student.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {enrollment.student.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              ID: {enrollment.student.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {enrollment.student.email}
                      </td>
                      <td className="p-4 text-gray-600">
                        {enrollment.student.institution}
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(enrollment.createdAt)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Progress</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setMemberToRemove(enrollment.student);
                                setShowRemoveModal(true);
                              }}
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Hapus dari Kelas
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "Tidak ada anggota yang ditemukan"
                  : "Belum ada anggota"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian"
                  : "Bagikan token kelas atau undang siswa untuk bergabung"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-[#23407a] hover:bg-[#1a2f5c]"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Undang Siswa Pertama
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredMembers.length > itemsPerPage && (
        <div className="flex justify-center py-4">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredMembers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        classDetail={classDetail}
      />

      {/* Remove Confirmation Modal */}
      <RemoveConfirmationModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setMemberToRemove(null);
        }}
        member={memberToRemove}
        onConfirm={() => {
          if (memberToRemove) {
            handleRemoveMember(memberToRemove.id);
            setShowRemoveModal(false);
            setMemberToRemove(null);
          }
        }}
      />
    </div>
  );
}

// Invite Modal Component
function InviteModal({ isOpen, onClose, classDetail }) {
  const [inviteMethod, setInviteMethod] = useState("token");

  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail.classToken);
    toast.success("Token kelas disalin!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Undang Siswa ke Kelas">
      <div className="space-y-6">
        {/* Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pilih Metode Undangan
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="inviteMethod"
                value="token"
                checked={inviteMethod === "token"}
                onChange={(e) => setInviteMethod(e.target.value)}
                className="mr-3"
              />
              Bagikan Token Kelas
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="inviteMethod"
                value="email"
                checked={inviteMethod === "email"}
                onChange={(e) => setInviteMethod(e.target.value)}
                className="mr-3"
              />
              Kirim Undangan Email
            </label>
          </div>
        </div>

        {/* Token Method */}
        {inviteMethod === "token" && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Token Kelas</h4>
            <p className="text-sm text-gray-600 mb-4">
              Bagikan token ini kepada siswa untuk bergabung ke kelas
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 font-mono text-lg font-bold bg-white px-3 py-2 rounded border">
                {classDetail.classToken}
              </div>
              <Button onClick={copyClassToken}>
                <Copy className="h-4 w-4 mr-2" />
                Salin
              </Button>
            </div>
          </div>
        )}

        {/* Email Method */}
        {inviteMethod === "email" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Siswa
              </label>
              <textarea
                rows={4}
                placeholder="Masukkan email siswa (satu per baris)&#10;contoh@email.com&#10;siswa2@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23407a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Undangan (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Tulis pesan khusus untuk siswa..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23407a]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          {inviteMethod === "email" ? (
            <Button className="bg-[#23407a] hover:bg-[#1a2f5c]">
              <Mail className="h-4 w-4 mr-2" />
              Kirim Undangan
            </Button>
          ) : (
            <Button
              onClick={() => {
                copyClassToken();
                onClose();
              }}
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin & Tutup
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// Remove Confirmation Modal
function RemoveConfirmationModal({ isOpen, onClose, member, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Anggota">
      <div className="space-y-4">
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus <strong>{member?.fullName}</strong>{" "}
          dari kelas ini?
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Peringatan:</strong> Tindakan ini akan menghapus semua data
            submission dan progress siswa di kelas ini. Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Hapus Anggota
          </Button>
        </div>
      </div>
    </Modal>
  );
}
