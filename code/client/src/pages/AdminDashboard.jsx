import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingUsers, verifyUser } from "../api";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [actionId, setActionId] = useState(null);

  const loadPending = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getPendingUsers(token);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (userId) => {
    setActionId(userId);
    setError("");
    try {
      await verifyUser(token, userId);
      // refresh list after approve
      await loadPending();
    } catch (err) {
      setError(err.message || "Failed to verify user");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Admin Dashboard</h1>
          <div style={{ opacity: 0.8 }}>Approve new users (pending → verified).</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/profile">My Profile</Link>
          <button onClick={loadPending} style={{ padding: "10px 12px" }}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 14,
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.2)",
            padding: 12,
            borderRadius: 10,
            color: "#b00020",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading pending users...</p>
        ) : items.length === 0 ? (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            No pending users right now ✅
          </div>
        ) : (
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              overflow: "hidden",
              background: "white",
            }}
          >
            <HeaderRow />
            {items.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                approving={actionId === u.id}
                onApprove={() => approve(u.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 2fr 1fr",
        gap: 12,
        padding: "12px 14px",
        fontSize: 12,
        opacity: 0.7,
        background: "rgba(0,0,0,0.03)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div>Email</div>
      <div>Role</div>
      <div>Full Name</div>
      <div style={{ textAlign: "right" }}>Action</div>
    </div>
  );
}

function UserRow({ user, approving, onApprove }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 2fr 1fr",
        gap: 12,
        padding: "12px 14px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        alignItems: "center",
      }}
    >
      <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
      <div>{user.role}</div>
      <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.full_name || "-"}</div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onApprove}
          disabled={approving}
          style={{
            padding: "8px 10px",
            cursor: approving ? "not-allowed" : "pointer",
          }}
        >
          {approving ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
}