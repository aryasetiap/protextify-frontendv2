// src/components/instructor/AnalyticsChart.jsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui";
import { BarChart3, TrendingUp } from "lucide-react";

// Data chart hanya menggunakan field yang tersedia dari BE/hooks
const AnalyticsChart = ({ data, title, type = "bar" }) => {
  // Untuk bar chart: activity, students, assignments (kelas)
  // Untuk line/area chart: submissions, graded (tren submissions/penilaian)
  const maxValue = Math.max(
    ...data.map((d) =>
      type === "bar"
        ? d.activity || d.students || d.assignments
        : d.submissions || d.graded
    )
  );

  const getBarHeight = (value) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const getColorClass = (type) => {
    switch (type) {
      case "line":
        return "bg-blue-500";
      case "area":
        return "bg-green-500";
      default:
        return "bg-[#23407a]";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "bar" && (
            <div className="flex items-end justify-between h-40 space-x-2">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t">
                    <div
                      className={`${getColorClass(
                        type
                      )} rounded-t transition-all duration-500`}
                      style={{
                        height: `${getBarHeight(
                          item.activity || item.students || item.assignments
                        )}%`,
                        minHeight: "4px",
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                    {item.name || item.date}
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {item.activity || item.students || item.assignments || 0}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(type === "line" || type === "area") && (
            <div className="space-y-3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${getColorClass(
                        type
                      )} mr-3`}
                    />
                    <span className="text-sm font-medium">{item.date}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {item.submissions || item.graded}
                      {type === "line" ? " submissions" : " dinilai"}
                    </span>
                    {index > 0 && (
                      <TrendingUp
                        className={`h-4 w-4 ${
                          (item.submissions || item.graded) >
                          (data[index - 1].submissions ||
                            data[index - 1].graded)
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data untuk ditampilkan</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
