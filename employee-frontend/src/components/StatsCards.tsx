export default function StatsCards({
  totalEmployees,
  totalSalary,
}: {
  totalEmployees: number;
  totalSalary: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500">Total Employees</p>
        <p className="text-2xl font-bold">{totalEmployees}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500">Total Salary</p>
        <p className="text-2xl font-bold">₹{totalSalary}</p>
      </div>
    </div>
  );
}
