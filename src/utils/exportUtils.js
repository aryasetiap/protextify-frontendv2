// src/utils/exportUtils.js
export const exportSubmissionsToCSV = (submissions, assignmentTitle) => {
  const headers = [
    "Nama Siswa",
    "Email",
    "Status",
    "Tanggal Dikumpulkan",
    "Nilai",
    "Plagiarisme (%)",
    "Feedback",
    "Institusi",
  ];

  const csvContent = [
    headers.join(","),
    ...submissions.map((submission) =>
      [
        `"${submission.student?.fullName || ""}"`,
        `"${submission.student?.email || ""}"`,
        `"${getStatusLabel(submission.status)}"`,
        `"${
          submission.submittedAt
            ? new Date(submission.submittedAt).toLocaleString("id-ID")
            : "Belum dikumpulkan"
        }"`,
        `"${submission.grade || "Belum dinilai"}"`,
        `"${submission.plagiarismScore || "Belum dicek"}"`,
        `"${submission.feedback || ""}"`,
        `"${submission.student?.institution || ""}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${assignmentTitle}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportSubmissionsToExcel = async (
  submissions,
  assignmentTitle
) => {
  // Install xlsx: npm install xlsx
  const XLSX = await import("xlsx");

  const worksheet = XLSX.utils.json_to_sheet(
    submissions.map((submission) => ({
      "Nama Siswa": submission.student?.fullName || "",
      Email: submission.student?.email || "",
      Status: getStatusLabel(submission.status),
      "Tanggal Dikumpulkan": submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString("id-ID")
        : "Belum dikumpulkan",
      Nilai: submission.grade || "Belum dinilai",
      "Plagiarisme (%)": submission.plagiarismScore || "Belum dicek",
      Feedback: submission.feedback || "",
      Institusi: submission.student?.institution || "",
      Kata: submission.wordCount || 0,
      "Terakhir Update": submission.updatedAt
        ? new Date(submission.updatedAt).toLocaleString("id-ID")
        : "",
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

  XLSX.writeFile(
    workbook,
    `submissions_${assignmentTitle}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
  );
};

const getStatusLabel = (status) => {
  const labels = {
    DRAFT: "Draft",
    SUBMITTED: "Dikumpulkan",
    GRADED: "Dinilai",
  };
  return labels[status] || status;
};
