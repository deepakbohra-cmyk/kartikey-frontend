import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login" , "/oauth2/redirect"];

  return (
    <>
      <AuthProvider>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <main className={location.pathname === "/login" ? "" : "pt-16"}>
          <AppRoutes />
        </main>
      </AuthProvider>
    </>
  );
}

export default App;
