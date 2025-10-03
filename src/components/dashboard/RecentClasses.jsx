// src/components/dashboard/RecentClasses.jsx
import { Link } from "react-router-dom";
import { BookOpen, Plus, Users, FileText } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const RecentClasses = ({ classes, totalClasses }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Kelas Terbaru
          </CardTitle>
          <Link to="/dashboard/classes">
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
              <Link
                key={cls.id}
                to={`/dashboard/classes/${cls.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {cls.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="truncate">
                        {cls.instructor?.fullName || "Loading..."}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 ml-3">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>{cls.assignments?.length || 0}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada kelas</p>
              <Link to="/dashboard/join-class">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Gabung Kelas
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentClasses;
