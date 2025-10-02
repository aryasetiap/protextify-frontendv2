// src/components/instructor/ClassOverview.jsx
import { Link } from "react-router-dom";
import { BookOpen, Users, FileText, Plus, Eye } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const ClassOverview = ({ classes, totalClasses, detailed = false }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {detailed ? "Management Kelas" : "Kelas Terbaru"}
          </CardTitle>
          <Link to="/instructor/classes">
            <Button variant="ghost" size="sm">
              Lihat Semua ({totalClasses})
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {cls.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{cls.enrollments?.length || 0} siswa</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>{cls.assignments?.length || 0} tugas</span>
                    </div>
                  </div>
                  {detailed && (
                    <div className="mt-2 text-xs text-gray-500">
                      Dibuat:{" "}
                      {new Date(cls.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {detailed && (
                    <Link to={`/instructor/classes/${cls.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link to={`/instructor/classes/${cls.id}/create-assignment`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Tugas
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada kelas</p>
              <Link to="/instructor/create-class">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Kelas Pertama
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassOverview;
