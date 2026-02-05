import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function Reports() {
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
      console.error("CSV failed", err);
      alert("Failed to download CSV");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await api.get("/reports/employees/pdf", { responseType: "blob" });
      downloadBlob(res.data, `employees_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF failed", err);
      alert("Failed to download PDF");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600 mt-1">Download and export employee data</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6">
              <h3 className="font-semibold">CSV Export</h3>
              <p className="text-sm text-gray-500">Download as spreadsheet</p>
              <button onClick={handleDownloadCsv} className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg">
                Download CSV
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-semibold">PDF Export</h3>
              <p className="text-sm text-gray-500">Download as PDF document</p>
              <button onClick={handleDownloadPdf} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
