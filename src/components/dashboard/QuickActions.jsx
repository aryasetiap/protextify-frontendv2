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
      className: "bg-[#23407a] hover:bg-[#1a2f5c] text-white",
    },
    {
      label: "Lihat Kelas Saya",
      icon: BookOpen,
      href: "/dashboard/classes",
      variant: "outline",
      description: `${stats.totalClasses} kelas diikuti`,
    },
    {
      label: "Tugas Aktif",
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
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href} className="group block">
              <div
                className={`
                p-4 rounded-lg border transition-all duration-200 
                hover:shadow-md hover:scale-105
                ${action.className || "border-gray-200 hover:border-[#23407a]"}
              `}
              >
                <div className="flex items-center mb-2">
                  <action.icon
                    className={`h-5 w-5 mr-3 ${
                      action.className ? "text-white" : "text-[#23407a]"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      action.className ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {action.label}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    action.className ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
