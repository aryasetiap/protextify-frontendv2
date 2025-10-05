// src/pages/instructor/Analytics.jsx
import { useMemo, useState } from "react";
import { Calendar, BarChart3, TrendingUp, Users, FileText, CheckCircle } from "lucide-react";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Button,
  Badge,
} from "../../components";
import { Breadcrumb } from "../../components/layout";
import { StatCard } from "../../components/dashboard";
import { AnalyticsChart } from "../../components/instructor";

export default function InstructorAnalytics() {
  const [range, setRange] = useState("7d"); // 7d, 30d, 90d

  // Dummy stats
  const stats = useMemo(() => ({
    completionRate: 76,
    avgPlagiarism: 9,
    totalSubmissions: 128,
    gradedSubmissions: 92,
    pendingGrading: 36,
    activeClasses: 4,
  }), []);

  // Helper to generate trend arrays
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const labels = Array.from({ length: days }, (_, i) => `D-${days - i}`);

  // Generate arrays sesuai kebutuhan AnalyticsChart (expects array of items)
  const submittedSeries = labels.map((_, i) => 5 + Math.round(Math.sin(i / 2) * 3) + (i % 5 === 0 ? 4 : 0));
  const gradedSeries = labels.map((_, i) => 3 + Math.round(Math.cos(i / 3) * 2) + (i % 6 === 0 ? 3 : 0));
  const submissionTrends = labels.map((label, i) => ({
    date: label,
    submissions: submittedSeries[i],
    graded: gradedSeries[i],
  }));

  const plagiarismDistribution = [
    { name: "0-10%", activity: 58 },
    { name: "10-20%", activity: 34 },
    { name: "20-40%", activity: 11 },
    { name: ">40%", activity: 3 },
  ];

  const classActivity = [
    { name: "SIM-301", activity: 46 },
    { name: "AI-201", activity: 38 },
    { name: "DB-102", activity: 22 },
    { name: "WEB-205", activity: 31 },
  ];

  const gradingSpeed = labels.map((label, i) => ({
    date: label,
    graded: 24 - Math.round((i % 7) * 1.8), // treat as average hours
  }));

  return (
    <Container className="py-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#23407a]/10 text-[#23407a] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 text-sm">Ringkasan performa kelas dan tugas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={range === "7d" ? "default" : "outline"} size="sm" onClick={() => setRange("7d")}>7 Hari</Button>
          <Button variant={range === "30d" ? "default" : "outline"} size="sm" onClick={() => setRange("30d")}>30 Hari</Button>
          <Button variant={range === "90d" ? "default" : "outline"} size="sm" onClick={() => setRange("90d")}>90 Hari</Button>
        </div>
      </div>

      {/* Top Stats */}
      <Grid cols={1} mdCols={3} lgCols={6} gap={6}>
        <StatCard title="Completion Rate" value={`${stats.completionRate}%`} icon={TrendingUp} trend={{ label: "+4% vs last period", up: true }} />
        <StatCard title="Rata-rata Plagiarisme" value={`${stats.avgPlagiarism}%`} icon={CheckCircle} />
        <StatCard title="Total Submission" value={stats.totalSubmissions} icon={FileText} />
        <StatCard title="Sudah Dinilai" value={stats.gradedSubmissions} icon={CheckCircle} />
        <StatCard title="Menunggu Nilai" value={stats.pendingGrading} icon={FileText} />
        <StatCard title="Kelas Aktif" value={stats.activeClasses} icon={Users} />
      </Grid>

      {/* Charts */}
      <div className="mt-8 space-y-8">
        <Grid cols={1} lgCols={2} gap={8}>
          <AnalyticsChart data={submissionTrends} title="Trend Submission" type="line" />
          <AnalyticsChart data={gradingSpeed} title="Kecepatan Penilaian (rata-rata jam)" type="area" />
        </Grid>

        <Grid cols={1} lgCols={2} gap={8}>
          <AnalyticsChart data={classActivity} title="Aktivitas per Kelas" type="bar" />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#23407a]" /> Distribusi Plagiarisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={plagiarismDistribution} title="" type="bar" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">0-10%: 58</Badge>
                <Badge variant="outline">10-20%: 34</Badge>
                <Badge variant="outline">20-40%: 11</Badge>
                <Badge variant="outline">>40%: 3</Badge>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </div>
    </Container>
  );
}


