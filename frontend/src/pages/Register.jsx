// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
};

function Register() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setSuccessMessage("");
    setLoading(true);

    try {
      const result = await registerUser(form);

      if (result.status === 201 && !result.errors) {
        const displayName = result.name || result.email || "your account";

        setSuccessMessage(
          `Welcome, ${displayName}! Your account has been created.`
        );
        setForm(EMPTY_FORM);
        setFieldErrors({});
        setGeneralError("");
        return;
      }

      // handle validation errors
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

      // Existing user
      if (result.status === 409) {
        setGeneralError(
          result.errormessage || "This email is already registered."
        );
        return;
      }

      // Generic error fallback
      setGeneralError(
        result.errorMessage || "Registration failed. Please try again."
      );
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto" }}>
      <h1>Register</h1>
      <p>Create a new account to start using Ringo.</p>

      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <div style={{ marginBottom: "12px" }}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
          {fieldErrors.name && (
            <p style={{ color: "red", marginTop: "4px" }}>{fieldErrors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div style={{ marginBottom: "12px" }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              value={form.password}
              onChange={handleChange}
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

        {/* Success message */}
        {successMessage && (
          <div style={{ marginBottom: "8px" }}>
            <p style={{ color: "green", marginBottom: "8px" }}>
              {successMessage}
            </p>
            <button type="button" onClick={() => navigate("/login")}>
              Back to login page
            </button>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
}

export default Register;
