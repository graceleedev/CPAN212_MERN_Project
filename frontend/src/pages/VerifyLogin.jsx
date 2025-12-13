// src/pages/OtpVerify.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../api/api";

function OtpVerify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load pending email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      setGeneralError("Login is required before OTP verification.");
    } else {
      setEmail(savedEmail);
    }
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email) {
      setGeneralError("Email is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtp({ email, otp });

      // Success: OTP valid, token issued
      if (result.status === 200 && result.token) {
        // Save token and user info to localStorage for later use
        localStorage.setItem("token", result.token);

        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        // OTP is no longer needed
        localStorage.removeItem("pendingEmail");

        setSuccessMessage(
          "OTP verified successfully! Redirecting to lessons..."
        );
        setGeneralError("");

        // Navigate to lessons page after success
        setTimeout(() => {
          navigate("/lessons");
        }, 800);

        return;
      }

      // Invalid OTP
      if (result.status === 403) {
        setGeneralError(
          result.errorMessage || "OTP is not valid. Please try again."
        );
        return;
      }

      // User not found
      if (result.status === 404) {
        setGeneralError(
          result.errorMessage || "User not found. Please register first."
        );
        return;
      }

      // Generic error fallback for other status codes
      setGeneralError(
        result.errorMessage || "OTP verification failed. Please try again."
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
      <h1>OTP Verification</h1>

      {/* Info message */}
      <p style={{ color: "white", marginBottom: "8px" }}>
        We’ve sent a verification code to your email address!
      </p>

      {email && (
        <p style={{ marginBottom: "8px" }}>
          Verifying email: <strong>{email}</strong>
        </p>
      )}

      {/* Error message */}
      {generalError && (
        <p style={{ color: "red", marginBottom: "8px" }}>{generalError}</p>
      )}

      {/* Success message */}
      {successMessage && (
        <p style={{ color: "green", marginBottom: "8px" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>
            OTP Code
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <button type="submit" disabled={loading || !email}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Entered a wrong email? <Link to="/login">Go back to login</Link>
      </p>
    </div>
  );
}

export default OtpVerify;
