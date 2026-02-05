import api from "../services/api";

export default function ReportButtons() {
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownloadCsv = async () => {
    try {
      const res = await api.get("/reports/employees/csv", { responseType: "blob" });
      downloadBlob(res.data, `employees_${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      console.error("CSV download failed:", err);
      alert("Failed to download CSV");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await api.get("/reports/employees/pdf", { responseType: "blob" });
      downloadBlob(res.data, `employees_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF");
    }
  };

  return (
    <div className="flex gap-3 mb-4">
      <button onClick={handleDownloadCsv} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
        Download CSV
      </button>
      <button onClick={handleDownloadPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
        Download PDF
      </button>
    </div>
  );
}
