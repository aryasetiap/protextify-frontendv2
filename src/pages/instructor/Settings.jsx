// src/pages/instructor/Settings.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Camera, Save, User, Mail, Phone, Building2, Shield } from "lucide-react";
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
} from "../../components";
import { Breadcrumb } from "../../components/layout";

export default function InstructorSettings() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "Dr. John Smith",
      email: user?.email || "john.smith@university.ac.id",
      phone: user?.phone || "+62 812-3456-7890",
      institution: user?.institution || "Universitas Teknologi Nusantara",
      bio:
        user?.bio ||
        "Dosen program studi Sistem Informasi. Fokus pada tata kelola TI dan analitik data.",
      avatarUrl: user?.avatarUrl || "/src/assets/logo-protextify-warna.png",
    });
    setAvatarPreview(user?.avatarUrl || "/src/assets/logo-protextify-warna.png");
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleAvatarUrl = () => {
    if (!form.avatarUrl) return;
    setAvatarPreview(form.avatarUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Simulasi penyimpanan
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Profil berhasil disimpan");
    } catch (err) {
      toast.error("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#23407a]/10 text-[#23407a] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
            <p className="text-gray-600 text-sm">Edit profil dan informasi akun Anda</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Keamanan */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-white shrink-0 flex items-center justify-center">
                  {/* Preview */}
                  <img src={avatarPreview} alt="avatar" className="max-w-full max-h-full object-contain object-center block" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Unggah File</label>
                    <div className="mt-1 flex items-center gap-3">
                      <input type="file" accept="image/*" onChange={handleAvatarFile} />
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Atau URL Gambar</label>
                    <div className="mt-1 flex items-center gap-2 w-full max-w-md overflow-hidden">
                      <Input
                        name="avatarUrl"
                        value={form.avatarUrl}
                        onChange={handleChange}
                        placeholder="https://.../foto.png"
                        className="flex-1 min-w-0 w-full focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:ring-offset-0"
                      />
                      <Button variant="outline" size="sm" onClick={handleAvatarUrl} className="whitespace-nowrap">Terapkan</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Shield className="w-4 h-4 mr-2"/>Keamanan (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Ganti kata sandi dan atur 2FA akan tersedia di versi berikutnya.</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Profil */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@kampus.ac.id" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                    <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+62 ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institusi</label>
                    <Input name="institution" value={form.institution} onChange={handleChange} placeholder="Nama institusi" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <Textarea name="bio" rows={5} value={form.bio} onChange={handleChange} placeholder="Ceritakan peran dan keahlian Anda" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-[#23407a] hover:bg-[#1a2f5c]">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}


