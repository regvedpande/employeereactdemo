import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmployeeForm from "../components/EmployeeForm";
import ReportButtons from "../components/ReportButtons";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";
import api from "../services/api";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  salary: number;
  department?: { name: string };
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Derived state - no useEffect needed
  const filteredEmployees = useMemo(() => {
    if (searchQuery.trim() === "") {
      return employees;
    }
    return employees.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  const totalSalary = useMemo(() => {
    return employees.reduce((sum, emp) => sum + emp.salary, 0);
  }, [employees]);

  const reloadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to reload employees:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        await reloadEmployees();
      } catch (error) {
        console.error("Failed to delete employee:", error);
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditId(null);
    await reloadEmployees();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your organization's workforce
          </p>
        </div>

        <StatsCards
          totalEmployees={employees.length}
          totalSalary={totalSalary}
        />

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              All Employees
            </h2>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
              onClick={() => {
                setEditId(null);
                setShowForm(true);
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Employee
            </button>
          </div>

          {showForm && (
            <div className="mb-6">
              <EmployeeForm
                existingId={editId}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          <div className="mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <ReportButtons />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No employees found matching your search"
                        : "No employees yet. Add your first employee!"}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {emp.fullName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {emp.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        ₹{emp.salary.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {emp.department?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm space-x-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          onClick={() => {
                            setEditId(emp.id);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}