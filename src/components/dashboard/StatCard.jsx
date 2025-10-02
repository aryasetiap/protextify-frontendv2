// src/components/dashboard/StatCard.jsx
import { Card, CardContent } from "../ui";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend = "neutral",
  onClick = null,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  const trendClasses = {
    positive: "text-green-600",
    warning: "text-yellow-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card
      className={`${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend !== "neutral" && (
                <span className={`text-xs ${trendClasses[trend]}`}>
                  {trend === "positive" && "↗"}
                  {trend === "warning" && "⚠"}
                  {trend === "negative" && "↘"}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
