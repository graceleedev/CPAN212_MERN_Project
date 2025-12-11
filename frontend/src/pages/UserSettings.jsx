import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUser,
} from "../api/api";

const EMPTY_FORM = {
  name: "",
  email: "",
};

function UserSettings() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimer;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If there is no auth info, show a message and redirect back to login
    if (!token || !storedUser) {
      setGeneralError(
        "Login is required to view your settings. Redirecting..."
      );
      setLoading(false);

      redirectTimer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
      };
    }

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    const loadProfile = async () => {
      try {
        const result = await fetchUserProfile(userId);

        if (result.status === 200) {
          // Assume backend returns a user object with name and email
          setForm({
            name: result.name || "",
            email: result.email || parsedUser.email || "",
          });
          setGeneralError("");
        } else if (result.status === 404) {
          setGeneralError("User not found. Please try logging in again.");
        } else if (result.status === 401 || result.status === 403) {
          setGeneralError("Access denied. Please log in again.");
        } else {
          setGeneralError(
            result.errorMessage || "Failed to load user profile."
          );
        }
      } catch (error) {
        console.error(error);
        setGeneralError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setGeneralError("Login is required.");
        setSaving(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      // Only send fields that should be editable by the user
      const payload = {
        name: form.name,
        // If your backend allows updating email, you can also send:
        // email: form.email,
      };

      const result = await updateUserProfile(userId, payload);

      if (result.status === 200) {
        setSuccessMessage("Your profile has been updated successfully.");

        const updatedUser = {
          ...parsedUser,
          // If email can change, update it here:
          // email: result.email || form.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else if (result.status === 404) {
        setGeneralError("User not found. Please try logging in again.");
      } else if (result.status === 403 || result.status === 401) {
        setGeneralError("Access denied. Please log in again.");
      } else if (Array.isArray(result.errors)) {
        const messages = result.errors.map((err) => err.msg).join(" ");
        setGeneralError(
          messages || "Validation failed. Please check your input."
        );
      } else {
        setGeneralError(
          result.errorMessage ||
            "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setGeneralError("");
    setSuccessMessage("");

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setGeneralError("Login is required.");
        setDeleting(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      const result = await deleteUser(userId);

      if (result.status === 200) {
        // Account deleted successfully: clear auth info and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setSuccessMessage("Your account has been deleted.");

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else if (result.status === 403 || result.status === 401) {
        setGeneralError(
          result.errorMessage ||
            "You do not have permission to delete this account."
        );
      } else if (result.status === 404) {
        setGeneralError("User not found. Please try logging in again.");
      } else {
        setGeneralError(
          result.errorMessage ||
            "Failed to delete account. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "640px", margin: "40px auto" }}>
        <h1>User Settings</h1>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "40px auto" }}>
      <h1>User Settings</h1>
      <p>Update or delete your account.</p>

      {generalError && (
        <p style={{ color: "red", marginBottom: "12px" }}>{generalError}</p>
      )}

      {successMessage && (
        <p style={{ color: "green", marginBottom: "12px" }}>
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your display name"
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: "8px" }}
              disabled
            />
          </label>
          <small style={{ fontSize: "0.8rem", color: "#555" }}>
            Email is shown for reference and cannot be changed here.
          </small>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <div>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          If you no longer want to use this account, you can delete it
          permanently.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          style={{
            marginTop: "8px",
            backgroundColor: "#c0392b",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {deleting ? "Deleting..." : "Delete account"}
        </button>
      </div>
    </div>
  );
}

export default UserSettings;
