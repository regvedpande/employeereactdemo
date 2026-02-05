import { useEffect, useState } from "react";
import api from "../services/api";

interface Props {
  existingId: number | null;
  onSuccess: () => Promise<void> | void;
  onCancel: () => void;
}

interface Department {
  id: number;
  name: string;
}

interface EmployeeData {
  fullName: string;
  email: string;
  salary: number;
  departmentId: number;
}

export default function EmployeeForm({ existingId, onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState<EmployeeData>({
    fullName: "",
    email: "",
    salary: 0,
    departmentId: 1,
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get<Department[]>("/departments");
        setDepartments(res.data);
        // If no departmentId selected yet, set to first available
        setFormData((prev) => ({
          ...prev,
          departmentId: prev.departmentId || (res.data[0]?.id ?? 1),
        }));
      } catch (err: unknown) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Load employee data when editing
  useEffect(() => {
    const loadEmployee = async () => {
      if (!existingId) {
        setFormData({
          fullName: "",
          email: "",
          salary: 0,
          departmentId: departments[0]?.id ?? 1,
        });
        return;
      }

      setLoadingData(true);
      try {
        const res = await api.get(`/employees/${existingId}`);
        const employee = res.data as {
          fullName?: string;
          email?: string;
          salary?: number;
          departmentId?: number;
        };

        setFormData({
          fullName: employee.fullName ?? "",
          email: employee.email ?? "",
          salary: employee.salary ?? 0,
          departmentId: employee.departmentId ?? departments[0]?.id ?? 1,
        });
      } catch (err: unknown) {
        console.error("Failed to load employee:", err);
        alert("Failed to load employee data. Please try again.");
        onCancel();
      } finally {
        setLoadingData(false);
      }
    };

    loadEmployee();
    // include departments (if they change) so departmentId fallback is correct
  }, [existingId, onCancel, departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingId) {
        await api.put(`/employees/${existingId}`, formData);
      } else {
        await api.post("/employees", formData);
      }

      await Promise.resolve(onSuccess());
    } catch (err: unknown) {
      console.error("Failed to save employee:", err);
      alert("Failed to save employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{existingId ? "Edit Employee" : "Add New Employee"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter salary"
            value={formData.salary === 0 ? "" : String(formData.salary)}
            onChange={(e) => {
              const val = e.target.value;
              const num = val === "" ? 0 : Number(val);
              setFormData({ ...formData, salary: Number.isFinite(num) ? num : 0 });
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
          {loading ? "Saving..." : existingId ? "Update Employee" : "Add Employee"}
        </button>

        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
