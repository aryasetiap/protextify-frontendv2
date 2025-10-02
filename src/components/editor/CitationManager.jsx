import { useState } from "react";
import { Plus, Edit2, Trash2, Book, FileText, Link } from "lucide-react";
import { Button, Modal, Input, Select, Card, CardContent } from "../ui";

const CitationManager = ({
  citations = [],
  onAdd,
  onEdit,
  onRemove,
  onInsert,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    type: "book",
    title: "",
    author: "",
    year: "",
    url: "",
    publisher: "",
    pages: "",
    doi: "",
  });

  const citationTypes = [
    { value: "book", label: "Buku", icon: Book },
    { value: "article", label: "Artikel", icon: FileText },
    { value: "website", label: "Website", icon: Link },
    { value: "journal", label: "Jurnal", icon: FileText },
  ];

  const resetForm = () => {
    setFormData({
      type: "book",
      title: "",
      author: "",
      year: "",
      url: "",
      publisher: "",
      pages: "",
      doi: "",
    });
    setEditingIndex(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setFormData(citations[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingIndex !== null) {
      onEdit(editingIndex, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const formatCitation = (citation) => {
    const { type, author, year, title, publisher, url } = citation;

    switch (type) {
      case "book":
        return `${author} (${year}). ${title}. ${publisher}.`;
      case "article":
        return `${author} (${year}). ${title}.`;
      case "website":
        return `${author}. ${title}. Retrieved from ${url}`;
      case "journal":
        return `${author} (${year}). ${title}.`;
      default:
        return `${author} (${year}). ${title}.`;
    }
  };

  const getTypeIcon = (type) => {
    const typeConfig = citationTypes.find((t) => t.value === type);
    const Icon = typeConfig?.icon || Book;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daftar Pustaka</h3>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Sitasi
        </Button>
      </div>

      {citations.length > 0 ? (
        <div className="space-y-3">
          {citations.map((citation, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(citation.type)}
                      <span className="text-sm font-medium text-gray-600">
                        {
                          citationTypes.find((t) => t.value === citation.type)
                            ?.label
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {formatCitation(citation)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInsert(formatCitation(citation))}
                    >
                      Insert
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Belum ada sitasi yang ditambahkan</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Sitasi" : "Tambah Sitasi"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Sitasi
            </label>
            <Select
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              options={citationTypes}
            />
          </div>

          <div>
            <Input
              label="Judul *"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Masukkan judul..."
            />
          </div>

          <div>
            <Input
              label="Penulis *"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Masukkan nama penulis..."
            />
          </div>

          <div>
            <Input
              label="Tahun *"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="2024"
            />
          </div>

          {formData.type === "website" && (
            <div>
              <Input
                label="URL *"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          )}

          {(formData.type === "book" || formData.type === "journal") && (
            <div>
              <Input
                label="Penerbit"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                placeholder="Nama penerbit..."
              />
            </div>
          )}

          {formData.type === "journal" && (
            <div>
              <Input
                label="DOI"
                value={formData.doi}
                onChange={(e) =>
                  setFormData({ ...formData, doi: e.target.value })
                }
                placeholder="10.1000/xyz123"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              {editingIndex !== null ? "Update" : "Tambah"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CitationManager;
