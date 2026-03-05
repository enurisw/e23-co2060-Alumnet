// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../api";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const isAdmin = useMemo(() => {
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded?.role === "admin";
    } catch {
      return false;
    }
  }, [token]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const t = localStorage.getItem("token");
        if (!t) {
          navigate("/login");
          return;
        }

        const data = await getProfile(t);
        setProfile(data);
      } catch (e) {
        setErr(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const status = profile?.verification_status === "verified" ? "verified" : "pending";

  return (
    <div style={pageWrap}>
      <div style={container}>
        <div style={headerRow}>
          <div>
            <h1 style={title}>My Profile</h1>
            <div style={subTitle}>Manage your account status and details</div>
          </div>

          <div style={actionsRow}>
            <Link to="/directory" style={actionBtn}>Directory</Link>

            {isAdmin && (
              <Link to="/admin" style={actionBtn}>Admin</Link>
            )}

            <button onClick={logout} style={logoutBtn}>Logout</button>
          </div>
        </div>

        {err && <div style={errorBox}>{err}</div>}

        {loading && (
          <div style={card}>
            <div style={{ opacity: 0.8 }}>Loading profile…</div>
          </div>
        )}

        {!loading && profile && (
          <div style={card}>
            {/* STATUS badge ONLY (no duplicate status field) */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <span style={badge(status)}>
                {status === "verified" ? "Verified" : "Pending"}
              </span>
            </div>

            <div style={grid}>
              <div style={infoRow}>
                <div style={label}>Name</div>
                <div style={value}>{profile.full_name || "-"}</div>
              </div>

              <div style={infoRow}>
                <div style={label}>Email</div>
                <div style={value}>{profile.email || "-"}</div>
              </div>

              <div style={infoRow}>
                <div style={label}>Role</div>
                <div style={value}>{profile.role || "-"}</div>
              </div>
            </div>

            {status !== "verified" && (
              <div style={pendingNote}>
                Your account is awaiting admin approval. You can still complete your profile details.
              </div>
            )}

            <div style={divider} />

            <div style={bottomLinks}>
              <Link to="/" style={link}>← Back to Home</Link>
              <Link to="/directory" style={link}>Browse Directory →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const pageWrap = {
  minHeight: "calc(100vh - 64px)",
  background: "#f6f7fb",
  fontFamily: "DM Sans, sans-serif",
};

const container = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "28px 18px",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 16,
};

const title = {
  margin: 0,
  fontSize: 32,
  fontWeight: 600,
  color: "#0b2a6f",
  letterSpacing: "0.02em",
};

const subTitle = {
  marginTop: 6,
  color: "rgba(11,42,111,0.75)",
};

const actionsRow = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const actionBtn = {
  textDecoration: "none",
  borderRadius: 10,
  padding: "10px 12px",
  border: "1px solid rgba(11,42,111,0.18)",
  background: "white",
  color: "#0b2a6f",
  fontWeight: 600,
  letterSpacing: "0.04em",
};

const logoutBtn = {
  borderRadius: 10,
  padding: "10px 12px",
  border: "1px solid rgba(11,42,111,0.18)",
  background: "rgba(11,42,111,0.08)",
  color: "#0b2a6f",
  fontWeight: 700,
  letterSpacing: "0.04em",
  cursor: "pointer",
};

const card = {
  borderRadius: 16,
  background: "white",
  border: "1px solid rgba(11,42,111,0.12)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
  padding: 22,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const infoRow = {
  border: "1px solid rgba(11,42,111,0.10)",
  borderRadius: 12,
  padding: 14,
  background: "rgba(11,42,111,0.03)",
};

const label = {
  fontSize: 12,
  letterSpacing: "0.08em",
  color: "rgba(11,42,111,0.75)",
  textTransform: "uppercase",
  marginBottom: 6,
};

const value = {
  color: "#0b2a6f",
  fontSize: 16,
  fontWeight: 600,
};

const pendingNote = {
  marginTop: 14,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(146,64,14,0.20)",
  background: "rgba(146,64,14,0.08)",
  color: "#92400e",
  textAlign: "center",
  fontWeight: 600,
};

const divider = {
  margin: "18px 0 12px",
  height: 1,
  background: "rgba(11,42,111,0.10)",
};

const bottomLinks = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const link = {
  textDecoration: "none",
  color: "#0b2a6f",
  fontWeight: 700,
};

const errorBox = {
  marginBottom: 14,
  background: "rgba(255,0,0,0.07)",
  border: "1px solid rgba(255,0,0,0.18)",
  padding: 12,
  borderRadius: 12,
  color: "#9b1020",
  fontWeight: 600,
};

const badge = (variant) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    border: "1px solid transparent",
  };

  if (variant === "verified") {
    return {
      ...base,
      background: "rgba(16, 185, 129, 0.12)",
      border: "1px solid rgba(16, 185, 129, 0.35)",
      color: "#065f46",
    };
  }

  return {
    ...base,
    background: "rgba(245, 158, 11, 0.12)",
    border: "1px solid rgba(245, 158, 11, 0.35)",
    color: "#92400e",
  };
};