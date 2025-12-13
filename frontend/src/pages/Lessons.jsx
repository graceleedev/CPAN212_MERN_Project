import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchLessons } from "../api/api";

function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("");

  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const loadLessons = async ({ keyword, level, page }) => {
    setLoading(true);
    setGeneralError("");

    try {
      const result = await fetchLessons({ keyword, level, page, limit });

      if (result.status === 200) {
        const list = Array.isArray(result.results) ? result.results : [];
        const more = !!result.hasMore;
        const count = Number.isFinite(result.totalCount)
          ? result.totalCount
          : 0;

        if (page === 1) {
          setLessons(list);
        } else {
          setLessons((prev) => [...prev, ...list]);
        }

        setHasMore(more);
        setTotalCount(count);
      } else {
        setGeneralError(
          result.errorMessage || "Failed to load lessons. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let redirectTimer;

    const token = localStorage.getItem("token");
    if (!token) {
      setGeneralError("Login is required to view lessons. Redirecting...");
      setLoading(false);

      redirectTimer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => redirectTimer && clearTimeout(redirectTimer);
    }

    loadLessons({ keyword, level, page });

    return () => redirectTimer && clearTimeout(redirectTimer);
  }, [navigate, keyword, level, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchInput.trim()); // Empty keyword means "load all"
  };

  /**
   * Clears search + level and reloads page 1.
   */
  const handleClear = () => {
    setSearchInput("");
    setKeyword("");
    setLevel("");
    setPage(1);
  };

  /**
   * Loads the next page if available.
   */
  const handleShowMore = () => {
    if (hasMore && !loading) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto" }}>
      <h1>Lessons</h1>
      <p>Browse available lessons after logging in.</p>

      {loading && <p>Loading lessons...</p>}

      {generalError && (
        <p style={{ color: "red", marginBottom: "12px" }}>{generalError}</p>
      )}

      {!generalError && (
        <>
          {/* Search + filter form (optional) */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: "16px" }}>
            <label>
              Search
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title (optional)"
                style={{ display: "block", width: "100%", padding: "8px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: "12px" }}>
              Level
              <select
                value={level}
                onChange={(e) => {
                  // Reset pagination when filters change
                  setPage(1);
                  setLevel(e.target.value);
                }}
                style={{ display: "block", width: "100%", padding: "8px", borderRadius: "8px", backgroundColor: "transparent" }}
              >
                <option value="">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button type="submit" disabled={loading}>
                Search
              </button>
              <button type="button" onClick={handleClear} disabled={loading}>
                Clear
              </button>
            </div>
          </form>

          {/* Optional metadata */}
          <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
            Showing {lessons.length} of {totalCount} lessons
          </p>

          {lessons.length === 0 && !loading ? (
            <p>No lessons found.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {lessons.map((lesson) => (
                <li
                  key={lesson._id || lesson.id}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <strong>{lesson.title || "Untitled lesson"}</strong>
                  <div>
                    {lesson.language && (
                      <span>Language: {lesson.language}</span>
                    )}
                  </div>
                  <div>
                    {lesson.level && <span>Level: {lesson.level}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* "Show more" pagination button */}
          {hasMore && (
            <button onClick={handleShowMore} disabled={loading}>
              Show more
            </button>
          )}

          {/* Link to setting page */}
          <Link to="/settings">Go to Settings</Link>
        </>
      )}
    </div>
  );
}

export default Lessons;
