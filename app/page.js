"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read: fetch the current list once when the page first loads.
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects. Try refreshing.");
    }
    setLoading(false);
  }

  // Create: send the form input to the backend, then refresh the list.
  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    if (!newName.trim()) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDescription }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    setNewName("");
    setNewDescription("");
    loadProjects(); // re-fetch so the new project shows up
  }

  // Update: cycle a project's status when its badge is clicked.
  async function handleCycleStatus(project) {
    const next =
      project.status === "active"
        ? "paused"
        : project.status === "paused"
        ? "done"
        : "active";

    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    loadProjects();
  }

  // Delete: remove a project after a simple confirmation.
  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;

    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    loadProjects();
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Projects</h1>
        <a
          href="/api/export"
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, textDecoration: "none", color: "#333", background: "white" }}
        >
          Export CSV
        </a>
      </div>
      <p style={{ color: "#666", marginBottom: 32 }}>
        A minimal CRUD loop: form → API route → database → API route → UI.
      </p>

      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name"
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            background: "#0070f3",
            color: "white",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      {error && (
        <p style={{ color: "#c0392b", marginBottom: 16, fontSize: 14 }}>{error}</p>
      )}

      {loading ? (
        <p style={{ color: "#999" }}>Loading…</p>
      ) : projects.length === 0 ? (
        <p style={{ color: "#999" }}>No projects yet — add one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map((project) => (
            <li
              key={project.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "white",
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <div>
                <div>{project.name}</div>
                {project.description && (
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{project.description}</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => handleCycleStatus(project)}
                  title="Click to cycle status"
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background:
                      project.status === "done"
                        ? "#d4edda"
                        : project.status === "paused"
                        ? "#fff3cd"
                        : "#d1ecf1",
                    color: "#333",
                  }}
                >
                  {project.status}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#c0392b",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
