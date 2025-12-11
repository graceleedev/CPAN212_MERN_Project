// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (result.status === 200 && !result.errors) {
        // Save email for OTP verification
        localStorage.setItem("pendingEmail", email);
        // Navigate to OTP verification page
        navigate("/login-verify");
        return;
      }

      if (Array.isArray(result.errors)) {
        const updatedErrors = {};
        result.errors.forEach((error) => {
          if (error.path) {
            updatedErrors[error.path] = error.msg;
          }
        });
        setFieldErrors(updatedErrors);
        return;
      }
      setGeneralError(
        result.errorMessage ||
          "Login failed. Please check your email and password."
      );
    } catch (err) {
    //   console.error(err);
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto" }}>
      <h1>Login</h1>
      <p>Log in to your Ringo account to continue.</p>

      <form onSubmit={handleSubmit}>
        {/* Email field */}
        <div style={{ marginBottom: "12px" }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
          {fieldErrors.email && (
            <p style={{ color: "red", marginTop: "4px" }}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "12px" }}>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
          {fieldErrors.password && (
            <p style={{ color: "red", marginTop: "4px" }}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* General error message */}
        {generalError && (
          <p style={{ color: "red", marginBottom: "8px" }}>{generalError}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Do not have an account? <Link to="/register">Go to Register</Link>
      </p>
    </div>
  );
}

export default Login;
