import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleGuard({
  role,
  children,
}: {
  role: "Admin" | "User";
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);
  if (auth?.role !== role) return null;
  return <>{children}</>;
}
