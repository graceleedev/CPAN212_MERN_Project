import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLessons, searchLessons } from "../api/api";

function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [search, setSearch] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimer;

    const token = localStorage.getItem("token");

    if (!token) {
      setGeneralError("Login is required to view lessons. Redirecting...");
      setLoading(false);

      redirectTimer = setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      // Token exists: load initial lessons from the protected API
      const loadLessons = async () => {
        try {
          const result = await fetchLessons();

          if (result.status === 200) {
            // Backend may return either an array or an object with a lessons property
            const list = Array.isArray(result) ? result : result.lessons;
            setLessons(list || []);
            setHasMore(false);
            setGeneralError("");
          } else {
            setGeneralError(
              result.errorMessage ||
                "Failed to load lessons. Please try again."
            );
          }
        } catch (error) {
          console.error(error);
          setGeneralError("Network error. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      loadLessons();
    }

    // Clean up redirect timer if the component unmounts
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [navigate]);

  // Handle search form submission (calls /lessons/search on the backend)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    // If the search box is empty, reload the full lessons list
    if (!search.trim()) {
      setLoading(true);
      setGeneralError("");

      try {
        const result = await fetchLessons();

        if (result.status === 200) {
          const list = Array.isArray(result) ? result : result.lessons;
          setLessons(list || []);
          setHasMore(false);
        } else {
          setGeneralError(
            result.errorMessage ||
              "Failed to load lessons. Please try again."
          );
        }
      } catch (error) {
        console.error(error);
        setGeneralError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Non-empty keyword: call /lessons/search with the keyword
    setLoading(true);
    setGeneralError("");

    try {
      const keyword = search.trim();
      const result = await searchLessons(keyword, 1, 10);

      if (result.status === 200) {
        // Backend can return either [] or { results, hasMore }
        let list = [];
        let more = false;

        if (Array.isArray(result)) {
          list = result;
        } else if (Array.isArray(result.results)) {
          list = result.results;
          more = !!result.hasMore;
        }

        setLessons(list);
        setHasMore(more);
      } else {
        setGeneralError(
          result.errorMessage || "Search failed. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
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

      {!loading && !generalError && (
        <>
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: "16px" }}>
            <label>
              Search
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title"
                style={{ display: "block", width: "100%", padding: "8px" }}
              />
            </label>
            <button type="submit" style={{ marginTop: "8px" }}>
              Search
            </button>
          </form>

          {lessons.length === 0 ? (
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

          {/* Optional: information about more results (for future pagination) */}
          {hasMore && (
            <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
              There are more results available. You can add pagination or a
              "Show more" button later if needed.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Lessons;
