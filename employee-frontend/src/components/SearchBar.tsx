export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className="w-full mb-4 p-3 border rounded-lg"
      placeholder="Search employees..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
