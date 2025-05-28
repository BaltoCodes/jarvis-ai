import { useNavigate, Outlet
 } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


export function AuthNavigate() {
  const navigate = useNavigate();
  return (
    <AuthProvider navigate={navigate}>
        <Outlet />
    </AuthProvider>
  );
}