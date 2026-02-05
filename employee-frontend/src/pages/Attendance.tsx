import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

interface Employee {
  id: number;
  fullName: string;
  email?: string;
  salary?: number;
  department?: { name: string };
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string; // ISO date
  present: boolean;
}

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [todayMap, setTodayMap] = useState<Record<number, boolean>>({});
  const [history, setHistory] = useState<AttendanceRecord[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    
      const tasks = res.data.map(async (e: Employee) => {
        try {
          const r = await api.get(`/attendance/${e.id}`);
          const records: AttendanceRecord[] = r.data;
          const todayIso = new Date().toISOString().slice(0, 10);
          const todayRecord = records.find(x => x.date.slice(0,10) === todayIso);
          return { id: e.id, present: todayRecord ? todayRecord.present : false, hasRecord: !!todayRecord };
        } catch {
          return { id: e.id, present: false, hasRecord: false };
        }
      });

      const results = await Promise.all(tasks);
      const map: Record<number, boolean> = {};
      results.forEach(r => map[r.id] = r.present);
      setTodayMap(map);
    } catch (err) {
      console.error("Failed to load employees", err);
      alert("Failed to load employees.");
    }
  };

  const toggleAttendance = async (employeeId: number, present: boolean) => {
    setLoading(true);
    try {
      await api.post("/attendance", { employeeId, present });
      setTodayMap(prev => ({ ...prev, [employeeId]: present }));
    } catch (err) {
      console.error("Failed to mark attendance", err);
      alert("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const viewHistory = async (employeeId: number) => {
    try {
      const res = await api.get(`/attendance/${employeeId}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
      alert("Failed to load attendance history.");
    }
  };

  const closeHistory = () => setHistory(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-600 mt-1">Track employee attendance and work hours</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Department</th>
                <th className="py-2">Today</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b">
                  <td className="py-3">{emp.fullName}</td>
                  <td className="py-3">{emp.department?.name ?? "N/A"}</td>
                  <td className="py-3">
                    {todayMap[emp.id] ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Present</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm">Absent</span>
                    )}
                  </td>
                  <td className="py-3 space-x-3">
                    <button
                      onClick={() => toggleAttendance(emp.id, true)}
                      className="bg-emerald-600 text-white px-3 py-1 rounded"
                      disabled={loading}
                    >
                      Mark Present
                    </button>
                    <button
                      onClick={() => toggleAttendance(emp.id, false)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      disabled={loading}
                    >
                      Mark Absent
                    </button>
                    <button
                      onClick={() => viewHistory(emp.id)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* History modal / panel */}
        {history && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Attendance History</h3>
                <button onClick={closeHistory} className="px-3 py-1 rounded bg-gray-100">Close</button>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id} className="border-b">
                      <td className="py-2">{new Date(h.date).toLocaleDateString()}</td>
                      <td className="py-2">{h.present ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
