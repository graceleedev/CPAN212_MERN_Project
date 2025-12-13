import { useNavigate } from "react-router-dom";

function LogoutButton({ onLoggedOut, children = "Log out" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token and cached user data
    localStorage.removeItem("token");
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("user");

    // Optional callback (e.g., to clear React state)
    if (typeof onLoggedOut === "function") onLoggedOut();

    // Redirect to login and prevent going back to protected pages
    navigate("/login", { replace: true });
  };

  return (
    <button onClick={handleLogout}>
      {children}
    </button>
  );
}

export default LogoutButton;
