// src/components/dashboard/QuickActions.jsx
import { Link } from "react-router-dom";
import { Plus, FileText, TrendingUp, BookOpen, Clock } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const QuickActions = ({ stats }) => {
  const actions = [
    {
      label: "Gabung Kelas Baru",
      icon: Plus,
      href: "/dashboard/join-class",
      variant: "default",
      description: "Bergabung dengan kelas menggunakan token",
    },
    {
      label: "Lihat Tugas",
      icon: FileText,
      href: "/dashboard/assignments",
      variant: "outline",
      description: `${stats.activeAssignments} tugas aktif`,
    },
    {
      label: "Riwayat Pengumpulan",
      icon: TrendingUp,
      href: "/dashboard/submissions",
      variant: "outline",
      description: `${stats.completedAssignments} tugas selesai`,
    },
    {
      label: "Kelas Saya",
      icon: BookOpen,
      href: "/dashboard/classes",
      variant: "outline",
      description: `${stats.totalClasses} kelas`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Button
                variant={action.variant}
                className="w-full justify-start h-auto p-4"
              >
                <div className="flex items-center w-full">
                  <action.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-gray-500 mt-1">
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

export default QuickActions;
