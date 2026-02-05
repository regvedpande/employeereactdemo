// src/pages/TableList.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmployeeForm from "../components/EmployeeForm";
import api from "../services/api";

interface Employee {
  id: number;
  fullName: string;
  email?: string;
  salary?: number;
  department?: { name: string } | null;
}

export default function TableList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // reload is used by delete and form-success to refresh list
  const reload = useCallback(async () => {
    try {
      const res = await api.get<Employee[]>("/employees");
      setEmployees(res.data);
    } catch (err: unknown) {
      const e = err as Error;
      console.error("Failed to load employees", e?.message ?? err);
    }
  }, []);

  // Initial fetch runs inside effect (inline async function) with a mounted guard.
  // This avoids calling setState synchronously in effect and resolves the eslint rule.
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get<Employee[]>("/employees");
        if (mounted) setEmployees(res.data);
      } catch (err: unknown) {
        const e = err as Error;
        console.error("Failed to load employees (initial fetch)", e?.message ?? err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []); // runs once on mount

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        (e.email ?? "").toLowerCase().includes(q)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      await reload();
    } catch (err: unknown) {
      const e = err as Error;
      console.error("Failed to delete", e?.message ?? err);
      alert("Failed to delete");
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditId(null);
    await reload();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Table List</h1>
            <p className="text-gray-600">Search and paginate employees</p>
          </div>
          <div>
            <button onClick={() => { setEditId(null); setShowForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded">Add Employee</button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <EmployeeForm existingId={editId} onSuccess={handleFormSuccess} onCancel={() => { setShowForm(false); setEditId(null); }} />
          </div>
        )}

        <div className="bg-white p-4 rounded shadow mb-4">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full p-2 border rounded" />
        </div>

        <div className="bg-white rounded p-4 shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-left">Department</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(e => (
                <tr key={e.id} className="border-b">
                  <td className="py-2">{e.fullName}</td>
                  <td className="py-2">{e.email}</td>
                  <td className="py-2">{e.department?.name ?? "N/A"}</td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => { setEditId(e.id); setShowForm(true); }} className="text-indigo-600">Edit</button>
                    <button onClick={() => handleDelete(e.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4">
            <div>Showing {filtered.length === 0 ? 0 : start + 1} - {Math.min(start + pageSize, filtered.length)} of {filtered.length}</div>
            <div className="space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
