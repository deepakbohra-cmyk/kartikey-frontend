import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify({ email, role }));

      if (role === "L1TEAM") {
        navigate("/l1form", { replace: true });
      } else {
        navigate("/sheetdata", { replace: true });
      }
    } else {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        const { role: savedRole } = JSON.parse(savedUser);
        if (savedRole === "L1TEAM") {
          navigate("/l1form", { replace: true });
        } else {
          navigate("/sheetdata", { replace: true });
        }
      } else {
        navigate("/login?error=OAuth2Failed", { replace: true });
      }
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default OAuth2Redirect;
