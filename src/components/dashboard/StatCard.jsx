// src/components/dashboard/StatCard.jsx
import { Card, CardContent } from "../ui";

// StatCard hanya menerima field yang tersedia dari BE/hook
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  gradient,
  trend = "neutral", // default neutral jika tidak ada data trend dari BE/hook
  onClick = null,
}) => {
  const colorClasses = {
    blue: "from-blue-100 to-blue-50 border-blue-200",
    green: "from-green-100 to-green-50 border-green-200",
    yellow: "from-yellow-100 to-yellow-50 border-yellow-200",
    purple: "from-purple-100 to-purple-50 border-purple-200",
    red: "from-red-100 to-red-50 border-red-200",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };

  // Hanya tampilkan trend jika field trend valid (positive/warning/negative)
  const showTrend =
    ["positive", "warning", "negative"].includes(trend) && trend !== "neutral";

  return (
    <Card
      className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      } bg-gradient-to-br ${colorClasses[color]}`}
      onClick={onClick}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} opacity-20`}
          ></div>
        </div>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
                {value}
              </p>
              {showTrend && (
                <span
                  className={`text-xs px-2 py-1 rounded-full bg-white/50 ${
                    trend === "positive"
                      ? "text-green-600"
                      : trend === "warning"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {trend === "positive" && "↗ +12%"}
                  {trend === "warning" && "⚠ -5%"}
                  {trend === "negative" && "↘ -8%"}
                </span>
              )}
            </div>
          </div>
          <div
            className={`p-3 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform ${iconColors[color]}`}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
