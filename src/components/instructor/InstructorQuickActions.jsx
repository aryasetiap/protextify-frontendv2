// src/components/instructor/InstructorQuickActions.jsx
import { Link } from "react-router-dom";
import { Plus, BookOpen, FileText, BarChart3, DollarSign } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const InstructorQuickActions = ({ stats }) => {
  const actions = [
    {
      label: "Buat Kelas Baru",
      icon: Plus,
      href: "/instructor/create-class",
      variant: "default",
      description: "Mulai kelas baru untuk siswa",
    },
    {
      label: "Kelola Kelas",
      icon: BookOpen,
      href: "/instructor/classes",
      variant: "outline",
      description: `${stats.totalClasses} kelas aktif`,
    },
    {
      label: "Review Tugas",
      icon: FileText,
      href: "/instructor/submissions",
      variant: "outline",
      description: `${stats.pendingGrading} menunggu penilaian`,
      urgent: stats.pendingGrading > 0,
    },
    {
      label: "Lihat Analytics",
      icon: BarChart3,
      href: "/instructor/analytics",
      variant: "outline",
      description: `${stats.completionRate}% completion rate`,
      disabled: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Button
                variant={action.variant}
                className={`w-full justify-start h-auto p-4 ${
                  action.urgent
                    ? "border-red-200 bg-red-50 hover:bg-red-100"
                    : ""
                } ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={action.disabled}
              >
                <div className="flex items-center w-full">
                  <action.icon
                    className={`h-5 w-5 mr-3 flex-shrink-0 ${
                      action.urgent ? "text-red-600" : ""
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div
                      className={`font-medium ${
                        action.urgent ? "text-red-700" : ""
                      }`}
                    >
                      {action.label}
                      {action.urgent && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        action.urgent ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorQuickActions;
